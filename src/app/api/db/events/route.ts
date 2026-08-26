import { NextResponse } from "next/server";
import { query } from "@/lib/postgres";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let sql = `SELECT id, title, subtitle, location, date, image, badge, luma_url, description, status, order_index, created_at, updated_at 
               FROM events 
               WHERE deleted_at IS NULL`;
    const params: any[] = [];

    if (status && status !== "all") {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (title ILIKE $${params.length} OR subtitle ILIKE $${params.length} OR location ILIKE $${params.length} OR badge ILIKE $${params.length})`;
    }

    sql += ` ORDER BY order_index ASC, created_at DESC`;

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error("GET /api/db/events error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to fetch events",
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
      subtitle,
      location,
      date,
      image,
      badge = "Private Club Exclusive",
      luma_url,
      description,
      status = "active",
      order_index = 0,
    } = body;

    if (!title || !location) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing required fields: title and location",
          },
        },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO events (title, subtitle, location, date, image, badge, luma_url, description, status, order_index, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING *;
    `;

    const params = [
      title.trim(),
      subtitle?.trim() || null,
      location.trim(),
      date?.trim() || null,
      image?.trim() || null,
      badge?.trim() || "Private Club Exclusive",
      luma_url?.trim() || null,
      description?.trim() || null,
      status || "active",
      Number(order_index) || 0,
    ];

    const result = await query(sql, params);
    const newEvent = result.rows[0];

    return NextResponse.json(
      {
        success: true,
        data: newEvent,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/db/events error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to create event",
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
            message: "Missing event id",
          },
        },
        { status: 400 }
      );
    }

    const fields: string[] = [];
    const params: any[] = [];

    const allowedFields: Record<string, string> = {
      title: "title",
      subtitle: "subtitle",
      location: "location",
      date: "date",
      image: "image",
      badge: "badge",
      luma_url: "luma_url",
      description: "description",
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
    const sql = `UPDATE events SET ${fields.join(", ")} WHERE id = $${params.length} RETURNING *;`;

    const result = await query(sql, params);
    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Event not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("PUT /api/db/events error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to update event",
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
            message: "Missing event id",
          },
        },
        { status: 400 }
      );
    }

    await query(`DELETE FROM events WHERE id = $1;`, [id]);

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/db/events error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to delete event",
        },
      },
      { status: 500 }
    );
  }
}
