import { NextResponse } from "next/server";
import { query } from "@/lib/postgres";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const newsletter_id = searchParams.get("newsletter_id");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let sql = `SELECT id, newsletter_id, user_id, email, full_name, newsletter_title, newsletter_date, location, status, note, created_at, updated_at 
               FROM newsletter_registrations 
               WHERE 1=1`;
    const params: any[] = [];

    if (newsletter_id) {
      params.push(newsletter_id);
      sql += ` AND newsletter_id = $${params.length}`;
    }

    if (status && status !== "ALL" && status !== "all") {
      params.push(status.toLowerCase());
      sql += ` AND status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (full_name ILIKE $${params.length} OR email ILIKE $${params.length} OR newsletter_title ILIKE $${params.length})`;
    }

    sql += ` ORDER BY created_at DESC`;

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error("GET /api/db/newsletters/registrations error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to fetch newsletter registrations",
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
      newsletter_id,
      user_id,
      email,
      full_name,
      newsletter_title,
      newsletter_date,
      location,
      status = "pending",
      note,
    } = body;

    if (!newsletter_id || !email || !newsletter_title) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing required fields: newsletter_id, email, newsletter_title",
          },
        },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO newsletter_registrations (newsletter_id, user_id, email, full_name, newsletter_title, newsletter_date, location, status, note, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *;
    `;

    const params = [
      newsletter_id,
      user_id || null,
      email.trim(),
      full_name?.trim() || null,
      newsletter_title.trim(),
      newsletter_date?.trim() || null,
      location?.trim() || null,
      status || "pending",
      note?.trim() || null,
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
    console.error("POST /api/db/newsletters/registrations error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to create newsletter registration",
        },
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, note } = body;

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

    if (note !== undefined) {
      params.push(note);
      fields.push(`note = $${params.length}`);
    }

    if (fields.length === 0) {
      return NextResponse.json({ success: true, message: "Nothing to update" });
    }

    fields.push(`updated_at = NOW()`);
    params.push(id);

    const sql = `UPDATE newsletter_registrations SET ${fields.join(", ")} WHERE id = $${params.length} RETURNING *;`;
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
    console.error("PUT /api/db/newsletters/registrations error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to update newsletter registration",
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

    await query(`DELETE FROM newsletter_registrations WHERE id = $1;`, [id]);

    return NextResponse.json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/db/newsletters/registrations error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to delete registration",
        },
      },
      { status: 500 }
    );
  }
}
