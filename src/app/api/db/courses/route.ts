import { NextResponse } from "next/server";
import { query } from "@/lib/postgres";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let sql = `SELECT id, title, booking_type, booking_title, description, image, fallback_image, instructor, duration, schedule, tuition_fee, status, order_index, created_at, updated_at 
               FROM courses 
               WHERE deleted_at IS NULL`;
    const params: any[] = [];

    if (status && status !== "all") {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (title ILIKE $${params.length} OR booking_title ILIKE $${params.length} OR instructor ILIKE $${params.length})`;
    }

    sql += ` ORDER BY order_index ASC, created_at DESC`;

    const result = await query(sql, params);

    // Format tuition_fee as number
    const courses = result.rows.map((row) => ({
      ...row,
      tuition_fee: Number(row.tuition_fee) || 0,
    }));

    return NextResponse.json({
      success: true,
      data: courses,
    });
  } catch (error: any) {
    console.error("GET /api/db/courses error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to fetch courses",
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      booking_type,
      booking_title,
      description,
      image,
      fallback_image,
      instructor,
      duration,
      schedule,
      tuition_fee,
      status = "active",
      order_index = 0,
    } = body;

    if (!title || !booking_type) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing required fields: title and booking_type",
          },
        },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO courses (title, booking_type, booking_title, description, image, fallback_image, instructor, duration, schedule, tuition_fee, status, order_index, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
      ON CONFLICT (booking_type) DO UPDATE SET
        title = EXCLUDED.title,
        booking_title = EXCLUDED.booking_title,
        description = EXCLUDED.description,
        image = EXCLUDED.image,
        fallback_image = EXCLUDED.fallback_image,
        instructor = EXCLUDED.instructor,
        duration = EXCLUDED.duration,
        schedule = EXCLUDED.schedule,
        tuition_fee = EXCLUDED.tuition_fee,
        status = EXCLUDED.status,
        order_index = EXCLUDED.order_index,
        deleted_at = NULL,
        updated_at = NOW()
      RETURNING *;
    `;

    const params = [
      title.trim(),
      booking_type.trim(),
      (booking_title || title).trim(),
      description?.trim() || null,
      image?.trim() || null,
      fallback_image?.trim() || null,
      instructor?.trim() || null,
      duration?.trim() || null,
      schedule?.trim() || null,
      Number(tuition_fee) || 0,
      status || "active",
      Number(order_index) || 0,
    ];

    const result = await query(sql, params);
    const newCourse = result.rows[0];

    return NextResponse.json(
      {
        success: true,
        data: {
          ...newCourse,
          tuition_fee: Number(newCourse.tuition_fee) || 0,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/db/courses error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to create course",
        },
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing course id",
          },
        },
        { status: 400 }
      );
    }

    const fields: string[] = [];
    const params: any[] = [];

    const allowedFields: Record<string, string> = {
      title: "title",
      booking_type: "booking_type",
      booking_title: "booking_title",
      description: "description",
      image: "image",
      fallback_image: "fallback_image",
      instructor: "instructor",
      duration: "duration",
      schedule: "schedule",
      tuition_fee: "tuition_fee",
      status: "status",
      order_index: "order_index",
    };

    for (const [key, col] of Object.entries(allowedFields)) {
      if (updateData[key] !== undefined) {
        params.push(updateData[key]);
        fields.push(`${col} = $${params.length}`);
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ success: true, message: "Nothing to update" });
    }

    fields.push(`updated_at = NOW()`);
    params.push(id);
    const sql = `UPDATE courses SET ${fields.join(", ")} WHERE id = $${params.length} RETURNING *;`;

    const result = await query(sql, params);
    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Course not found" } },
        { status: 404 }
      );
    }

    const updated = result.rows[0];
    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        tuition_fee: Number(updated.tuition_fee) || 0,
      },
    });
  } catch (error: any) {
    console.error("PUT /api/db/courses error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to update course",
        },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing course id",
          },
        },
        { status: 400 }
      );
    }

    await query(`DELETE FROM courses WHERE id = $1;`, [id]);

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/db/courses error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to delete course",
        },
      },
      { status: 500 }
    );
  }
}
