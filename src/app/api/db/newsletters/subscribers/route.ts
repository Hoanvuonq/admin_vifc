import { NextResponse } from "next/server";
import { query } from "@/lib/postgres";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let sql = `SELECT id, user_id, email, full_name, source, status, created_at, updated_at 
               FROM newsletter_subscriptions 
               WHERE 1=1`;
    const params: any[] = [];

    if (status && status !== "ALL" && status !== "all") {
      params.push(status.toLowerCase());
      sql += ` AND status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (email ILIKE $${params.length} OR full_name ILIKE $${params.length} OR source ILIKE $${params.length})`;
    }

    sql += ` ORDER BY created_at DESC`;

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error("GET /api/db/newsletters/subscribers error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to fetch subscribers",
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, full_name, source = "dashboard", status = "subscribed" } = body;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing required field: email",
          },
        },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO newsletter_subscriptions (email, full_name, source, status, updated_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (email) DO UPDATE SET
        full_name = COALESCE(EXCLUDED.full_name, newsletter_subscriptions.full_name),
        status = EXCLUDED.status,
        updated_at = NOW()
      RETURNING *;
    `;

    const params = [
      email.trim().toLowerCase(),
      full_name?.trim() || null,
      source?.trim() || "dashboard",
      status || "subscribed",
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
    console.error("POST /api/db/newsletters/subscribers error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to add subscriber",
        },
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, full_name, source } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing subscriber id",
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

    if (full_name !== undefined) {
      params.push(full_name);
      fields.push(`full_name = $${params.length}`);
    }

    if (source !== undefined) {
      params.push(source);
      fields.push(`source = $${params.length}`);
    }

    if (fields.length === 0) {
      return NextResponse.json({ success: true, message: "Nothing to update" });
    }

    fields.push(`updated_at = NOW()`);
    params.push(id);

    const sql = `UPDATE newsletter_subscriptions SET ${fields.join(", ")} WHERE id = $${params.length} RETURNING *;`;
    const result = await query(sql, params);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Subscriber not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("PUT /api/db/newsletters/subscribers error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to update subscriber",
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
            message: "Missing subscriber id",
          },
        },
        { status: 400 }
      );
    }

    await query(`DELETE FROM newsletter_subscriptions WHERE id = $1;`, [id]);

    return NextResponse.json({
      success: true,
      message: "Subscriber deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/db/newsletters/subscribers error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to delete subscriber",
        },
      },
      { status: 500 }
    );
  }
}
