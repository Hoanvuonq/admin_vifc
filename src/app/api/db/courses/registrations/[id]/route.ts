import { NextResponse } from "next/server";
import { query } from "../../../../../../lib/postgres";
import { redis } from "../../../../../../lib/redis";
import { BookingRequestItem } from "@/types/course";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id || id.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Registration ID is required",
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 },
      );
    }

    const cacheKey = `courses:registrations:detail:${id}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json(JSON.parse(cached), { status: 200 });
      }
    } catch (redisError) {
      console.warn(`Redis get failed for registration ${id}:`, redisError);
    }

    const unionSql = `
      SELECT 
        id, user_id, email, full_name, phone::text, company::text,
        booking_type, booking_title, 
        COALESCE(tuition_fee, 0)::numeric as tuition_fee, COALESCE(deposit, 0)::numeric as deposit,
        status, source, note, created_at, updated_at
      FROM course_registrations
      WHERE id = $1 AND deleted_at IS NULL
      UNION ALL
      SELECT 
        id, user_id, email, full_name, NULL::text as phone, NULL::text as company,
        booking_type, booking_title, 0::numeric as tuition_fee, 0::numeric as deposit,
        status, source, note, created_at, updated_at
      FROM booking_requests
      WHERE id = $1
    `;

    const sql = `
      SELECT unified.*, u.avatar_url, u.company as user_company
      FROM (${unionSql}) unified
      LEFT JOIN users u ON unified.user_id = u.id
      LIMIT 1
    `;

    const res = await query(sql, [id]);
    const dbItem = res.rows[0];

    if (!dbItem) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Course registration not found",
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 },
      );
    }

    const foundItem: BookingRequestItem = {
      id: dbItem.id,
      user_id: dbItem.user_id,
      email: dbItem.email,
      full_name: dbItem.full_name,
      phone: dbItem.phone || null,
      company: dbItem.company || dbItem.user_company || null,
      booking_type: dbItem.booking_type || "course",
      booking_title: dbItem.booking_title,
      tuition_fee: dbItem.tuition_fee ? Number(dbItem.tuition_fee) : 0,
      deposit: dbItem.deposit ? Number(dbItem.deposit) : 0,
      tuitionFee: dbItem.tuition_fee ? Number(dbItem.tuition_fee) : 0,
      status: (dbItem.status || "pending").toLowerCase(),
      source: dbItem.source || "web-dashboard",
      note: dbItem.note || "",
      created_at: new Date(dbItem.created_at).toISOString(),
      updated_at: new Date(dbItem.updated_at).toISOString(),
      avatar_url: dbItem.avatar_url || null,
      users: dbItem.user_id
        ? {
            id: dbItem.user_id,
            email: dbItem.email,
            full_name: dbItem.full_name,
            avatar_url: dbItem.avatar_url,
          }
        : null,
    };

    const responseData = {
      success: true,
      data: foundItem,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    try {
      await redis.setex(cacheKey, 30, JSON.stringify(responseData));
    } catch (redisError) {
      console.warn(`Redis setex failed for registration ${id}:`, redisError);
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("GET /api/db/courses/registrations/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Failed to fetch course registration",
          details: error instanceof Error ? error.message : String(error),
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id || id.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Registration ID is required",
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { status, note, phone, company, booking_title, tuition_fee, tuitionFee, deposit } = body;

    const finalStatus = status ? String(status).toLowerCase() : undefined;
    const finalNote = note !== undefined ? String(note).trim() : undefined;

    let updatedItem: any = null;

    const updateCourseSql = `
      UPDATE course_registrations
      SET 
        status = COALESCE($2, status),
        note = COALESCE($3, note),
        phone = COALESCE($4, phone),
        company = COALESCE($5, company),
        booking_title = COALESCE($6, booking_title),
        tuition_fee = COALESCE($7, tuition_fee),
        deposit = COALESCE($8, deposit),
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const resCourse = await query(updateCourseSql, [
      id,
      finalStatus || null,
      finalNote ?? null,
      phone || null,
      company || null,
      booking_title || null,
      tuition_fee ?? tuitionFee ?? null,
      deposit ?? null,
    ]);

    if (resCourse.rows.length > 0) {
      updatedItem = resCourse.rows[0];
    } else {
      const updateBookingSql = `
        UPDATE booking_requests
        SET 
          status = COALESCE($2, status),
          note = COALESCE($3, note),
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      const resBooking = await query(updateBookingSql, [id, finalStatus || null, finalNote ?? null]);
      if (resBooking.rows.length > 0) {
        updatedItem = resBooking.rows[0];
      }
    }

    if (!updatedItem) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Registration not found to update",
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 },
      );
    }

    try {
      const keys = await redis.keys("courses:registrations:*");
      if (keys && keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (redisError) {
      console.warn("Redis cache invalidation failed:", redisError);
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedItem,
        message: "Updated registration successfully",
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH /api/db/courses/registrations/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Failed to update course registration",
          details: error instanceof Error ? error.message : String(error),
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  return PATCH(request, context);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id || id.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Registration ID is required",
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 },
      );
    }

    await query("UPDATE course_registrations SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1", [id]);
    await query("DELETE FROM booking_requests WHERE id = $1", [id]);

    try {
      const keys = await redis.keys("courses:registrations:*");
      if (keys && keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (redisError) {
      console.warn("Redis cache invalidation failed:", redisError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registration deleted successfully",
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/db/courses/registrations/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Failed to delete course registration",
          details: error instanceof Error ? error.message : String(error),
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    );
  }
}
