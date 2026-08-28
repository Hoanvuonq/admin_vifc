import { NextResponse } from "next/server";
import { query } from "@/lib/postgres";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let sql = `SELECT id, title, description, date, location, image, status, order_index, created_at, updated_at 
               FROM newsletters 
               WHERE 1=1`;
    const params: any[] = [];

    if (status && status !== "ALL" && status !== "all") {
      params.push(status.toLowerCase());
      sql += ` AND status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length} OR location ILIKE $${params.length})`;
    }

    sql += ` ORDER BY order_index ASC, created_at DESC`;

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error("GET /api/db/newsletters error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to fetch newsletters",
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
      description,
      date,
      location = "HCMC, Viet Nam",
      image,
      status = "active",
      order_index = 0,
    } = body;

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing required field: title",
          },
        },
        { status: 400 }
      );
    }

    const finalImage = image ? String(image).trim() : null;
    const finalDate = date?.trim() || new Date().toLocaleDateString("vi-VN");
    const finalLocation = location?.trim() || "HCMC, Viet Nam";

    const sql = `
      INSERT INTO newsletters (title, description, date, location, image, status, order_index, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *;
    `;

    const params = [
      title.trim(),
      description?.trim() || null,
      finalDate,
      finalLocation,
      finalImage,
      status || "active",
      Number(order_index) || 0,
    ];

    const result = await query(sql, params);
    const newNewsletter = result.rows[0];

    return NextResponse.json(
      {
        success: true,
        data: newNewsletter,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/db/newsletters error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to create newsletter",
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
            message: "Missing newsletter id",
          },
        },
        { status: 400 }
      );
    }

    const fields: string[] = [];
    const params: any[] = [];

    const allowedFields: Record<string, string> = {
      title: "title",
      description: "description",
      date: "date",
      location: "location",
      image: "image",
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
    const sql = `UPDATE newsletters SET ${fields.join(", ")} WHERE id = $${params.length} RETURNING *;`;

    const result = await query(sql, params);
    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Newsletter not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("PUT /api/db/newsletters error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to update newsletter",
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
            message: "Missing newsletter id",
          },
        },
        { status: 400 }
      );
    }

    await query(`DELETE FROM newsletters WHERE id = $1;`, [id]);

    return NextResponse.json({
      success: true,
      message: "Newsletter deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/db/newsletters error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Failed to delete newsletter",
        },
      },
      { status: 500 }
    );
  }
}
