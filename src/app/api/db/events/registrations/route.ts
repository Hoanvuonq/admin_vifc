import { NextResponse } from "next/server";
import { query } from "@/lib/postgres";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let sql = `SELECT id, user_id, email, full_name, phone, event_id, event_title, event_date, location, status, notes, created_at, updated_at 
               FROM event_registrations`;
    const params: any[] = [];

    if (status && status !== "ALL" && status !== "all") {
      params.push(status.toLowerCase());
      sql += ` WHERE status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      const prefix = params.length === 1 ? " WHERE" : " AND";
      sql += `${prefix} (full_name ILIKE $${params.length} OR email ILIKE $${params.length} OR event_title ILIKE $${params.length} OR phone ILIKE $${params.length})`;
    }

    sql += ` ORDER BY created_at DESC`;

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error("GET /api/db/events/registrations error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to fetch event registrations",
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
      user_id,
      email,
      full_name,
      phone,
      event_id,
      event_title,
      event_date,
      location,
      status = "pending",
      notes,
    } = body;

    if (!email || !event_title) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing required fields: email and event_title",
          },
        },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO event_registrations (user_id, email, full_name, phone, event_id, event_title, event_date, location, status, notes, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING *;
    `;

    const params = [
      user_id || null,
      email.trim(),
      full_name?.trim() || null,
      phone?.trim() || null,
      event_id || null,
      event_title.trim(),
      event_date?.trim() || null,
      location?.trim() || null,
      status || "pending",
      notes?.trim() || null,
    ];

    const result = await query(sql, params);

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/db/events/registrations error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to create event registration",
        },
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing registration id",
          },
        },
        { status: 400 }
      );
    }

    const fields: string[] = [];
    const params: any[] = [];

    if (status !== undefined) {
      params.push(status);
      fields.push(`status = $${params.length}`);
    }

    if (notes !== undefined) {
      params.push(notes);
      fields.push(`notes = $${params.length}`);
    }

    fields.push(`updated_at = NOW()`);
    params.push(id);

    const sql = `UPDATE event_registrations SET ${fields.join(", ")} WHERE id = $${params.length} RETURNING *;`;
    const result = await query(sql, params);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Registration not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("PUT /api/db/events/registrations error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to update event registration",
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
            message: "Missing registration id",
          },
        },
        { status: 400 }
      );
    }

    await query(`DELETE FROM event_registrations WHERE id = $1;`, [id]);

    return NextResponse.json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/db/events/registrations error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to delete event registration",
        },
      },
      { status: 500 }
    );
  }
}
