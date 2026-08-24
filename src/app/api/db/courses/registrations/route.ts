import { NextResponse } from "next/server";
import { query } from "../../../../../lib/postgres";
import { redis } from "../../../../../lib/redis";
import { BookingRequestItem, CourseRegistrationStats } from "@/types/course";

// GET /api/db/courses/registrations - Danh sách đơn đăng ký khóa học & booking
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const statusParam = searchParams.get("status") || undefined;
    const bookingTypeParam = searchParams.get("bookingType") || undefined;
    const search = searchParams.get("search")?.trim();

    // 1. Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 1000) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Invalid pagination parameters. Page >= 1 and Limit between 1 and 1000",
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 },
      );
    }

    const offset = (page - 1) * limit;

    // 2. Cache Logic via Redis
    const cacheKey = `courses:registrations:list:${page}:${limit}:${statusParam || "all"}:${bookingTypeParam || "all"}:${search || "none"}`;
    try {
      const cachedResponse = await redis.get(cacheKey);
      if (cachedResponse) {
        return NextResponse.json(JSON.parse(cachedResponse), { status: 200 });
      }
    } catch (redisError) {
      console.warn("Redis cache read failed for course registrations:", redisError);
    }

    // 3. Build WHERE condition for SQL
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (statusParam && statusParam !== "ALL" && statusParam !== "all") {
      const s = statusParam.toLowerCase();
      if (s === "approved" || s === "confirmed") {
        conditions.push(`LOWER(status) IN ('approved', 'confirmed')`);
      } else if (s === "rejected") {
        conditions.push(`LOWER(status) IN ('rejected', 'cancelled')`);
      } else {
        conditions.push(`LOWER(status) = $${paramIndex++}`);
        values.push(s);
      }
    }

    if (bookingTypeParam && bookingTypeParam !== "ALL" && bookingTypeParam !== "all") {
      conditions.push(`LOWER(booking_type) = $${paramIndex++}`);
      values.push(bookingTypeParam.toLowerCase());
    }

    if (search) {
      const searchPattern = `%${search.toLowerCase()}%`;
      conditions.push(
        `(LOWER(full_name) LIKE $${paramIndex} OR LOWER(email) LIKE $${paramIndex} OR LOWER(booking_title) LIKE $${paramIndex})`
      );
      values.push(searchPattern);
      paramIndex++;
    }

    const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // 4. Query PostgreSQL database directly (Unifying course_registrations and booking_requests)
    // First, check if course_registrations has records; if not, query booking_requests
    const unionSql = `
      SELECT 
        id, user_id, email, full_name, 
        NULL::text as phone, NULL::text as company,
        booking_type, booking_title, 
        0::numeric as tuition_fee, 0::numeric as deposit,
        status, source, note, created_at, updated_at
      FROM booking_requests
      UNION ALL
      SELECT 
        id, user_id, email, full_name, 
        phone::text, company::text,
        booking_type, booking_title, 
        COALESCE(tuition_fee, 0)::numeric as tuition_fee, COALESCE(deposit, 0)::numeric as deposit,
        status, source, note, created_at, updated_at
      FROM course_registrations
      WHERE deleted_at IS NULL
    `;

    const countQuery = `
      SELECT COUNT(*) as total FROM (${unionSql}) unified ${whereSql}
    `;

    const statsQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE LOWER(status) = 'pending') as pending,
        COUNT(*) FILTER (WHERE LOWER(status) IN ('approved', 'confirmed')) as approved,
        COUNT(*) FILTER (WHERE LOWER(status) IN ('rejected', 'cancelled')) as rejected,
        COUNT(*) FILTER (WHERE LOWER(status) IN ('completed', 'success')) as completed
      FROM (${unionSql}) unified
    `;

    const dataQuery = `
      SELECT unified.*, u.avatar_url, u.company as user_company,
             uc.so_the as card_so_the, uc.loai_the as card_loai_the, uc.username as card_username
      FROM (${unionSql}) unified
      LEFT JOIN users u ON unified.user_id = u.id
      LEFT JOIN (
        SELECT DISTINCT ON (user_id) user_id, so_the, loai_the, username
        FROM user_cards
        ORDER BY user_id, created_at DESC
      ) uc ON unified.user_id = uc.user_id
      ${whereSql}
      ORDER BY unified.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    const [countRes, statsRes, dataRes] = await Promise.all([
      query(countQuery, values),
      query(statsQuery),
      query(dataQuery, [...values, limit, offset]),
    ]);

    const total = parseInt(countRes.rows[0]?.total || "0", 10);
    const statsRow = statsRes.rows[0] || {};
    const stats: CourseRegistrationStats = {
      total: parseInt(statsRow.total || "0", 10),
      pending: parseInt(statsRow.pending || "0", 10),
      approved: parseInt(statsRow.approved || "0", 10),
      rejected: parseInt(statsRow.rejected || "0", 10),
      completed: parseInt(statsRow.completed || "0", 10),
    };

    const transformedItems: BookingRequestItem[] = dataRes.rows.map((r: any) => ({
      id: r.id,
      user_id: r.user_id,
      email: r.email,
      full_name: r.full_name,
      phone: r.phone || null,
      company: r.company || r.user_company || null,
      booking_type: r.booking_type || "course",
      booking_title: r.booking_title,
      tuition_fee: r.tuition_fee ? Number(r.tuition_fee) : 0,
      deposit: r.deposit ? Number(r.deposit) : 0,
      tuitionFee: r.tuition_fee ? Number(r.tuition_fee) : 0,
      status: (r.status || "pending").toLowerCase(),
      source: r.source || "web-dashboard",
      note: r.note || "",
      created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
      avatar_url: r.avatar_url || null,
      card: r.card_so_the
        ? {
            so_the: r.card_so_the,
            loai_the: r.card_loai_the,
            username: r.card_username,
          }
        : null,
      users: r.user_id
        ? {
            id: r.user_id,
            email: r.email,
            full_name: r.full_name,
            avatar_url: r.avatar_url,
          }
        : null,
    }));

    const totalPages = Math.ceil(total / limit);

    const responseData = {
      success: true,
      data: transformedItems,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: totalPages || 1,
          hasMore: page < totalPages,
        },
        stats,
        timestamp: new Date().toISOString(),
      },
    };

    // 5. Save to Redis Cache (TTL 30s)
    try {
      await redis.setex(cacheKey, 30, JSON.stringify(responseData));
    } catch (redisError) {
      console.warn("Redis cache write failed for course registrations:", redisError);
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("GET /api/db/courses/registrations error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Failed to fetch course registrations",
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

// POST /api/db/courses/registrations - Tạo mới đơn đăng ký
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      full_name,
      fullName,
      phone,
      company,
      booking_type,
      bookingType,
      booking_title,
      bookingTitle,
      tuition_fee,
      tuitionFee,
      deposit,
      source,
      note,
      user_id,
    } = body;

    const finalEmail = email ? email.trim() : "";
    const finalName = (full_name || fullName || "").trim();
    const finalTitle = (booking_title || bookingTitle || "").trim();
    const finalType = (booking_type || bookingType || "course").toLowerCase();

    // 1. Validate required fields
    if (!finalEmail || !finalName || !finalTitle) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing required fields: email, full_name and booking_title are required",
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 },
      );
    }

    // Insert into booking_requests and course_registrations
    const insertSql = `
      INSERT INTO course_registrations (
        user_id, email, full_name, phone, company,
        booking_type, booking_title, tuition_fee, deposit,
        status, source, note, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', $10, $11, NOW(), NOW()
      )
      RETURNING *
    `;

    const res = await query(insertSql, [
      user_id || null,
      finalEmail,
      finalName,
      phone || null,
      company || null,
      finalType,
      finalTitle,
      Number(tuition_fee ?? tuitionFee) || 0,
      Number(deposit) || 0,
      source || "web-dashboard",
      note ? note.trim() : null,
    ]);

    const created = res.rows[0];

    // Invalidate Redis Caches
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
        data: created,
        message: "Created course registration successfully",
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/db/courses/registrations error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Failed to create course registration",
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
