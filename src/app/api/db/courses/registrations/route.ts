import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { redis } from "../../../../../lib/redis";
import { BookingRequestItem } from "@/types/course";

// Global data store to guarantee real-time synchronization and offline support
declare global {
  // eslint-disable-next-line no-var
  var __mockCourseRegistrations: BookingRequestItem[] | undefined;
}

const initialRegistrations: BookingRequestItem[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    user_id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    email: "hung.nguyen@vifc.vn",
    full_name: "Nguyễn Văn Hùng",
    booking_type: "course",
    booking_title: "Solidity & Smart Contract Security Masterclass",
    status: "pending",
    source: "admin-dashboard",
    note: "Học viên đăng ký học chuyên sâu về Audit Smart Contract và DeFi.",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    phone: "0912 345 678",
    company: "VIFC Global Lab",
    tuitionFee: 15000000,
    deposit: 5000000,
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678902",
    user_id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    email: "maianh.tran@techvn.io",
    full_name: "Trần Thị Mai Anh",
    booking_type: "course",
    booking_title: "DeFi Protocols & Liquidity Pool Mechanics",
    status: "confirmed",
    source: "web-dashboard",
    note: "Đăng ký khóa học cuối tuần, yêu cầu xuất hóa đơn VAT công ty.",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000 + 3600000).toISOString(),
    phone: "0987 654 321",
    company: "FinTech Innovations",
    tuitionFee: 12500000,
    deposit: 12500000,
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789033",
    user_id: "d4e5f6a7-b8c9-0123-def0-123456789013",
    email: "long.le@cryptoviet.com",
    full_name: "Lê Hoàng Long",
    booking_type: "workshop",
    booking_title: "Crypto Trading & On-Chain Data Analytics",
    status: "approved",
    source: "mobile-app",
    note: "Đã chuyển khoản đủ qua ngân hàng, cần link nhóm Zalo lớp.",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2 + 7200000).toISOString(),
    phone: "0903 112 233",
    company: "CryptoViet Capital",
    tuitionFee: 8500000,
    deposit: 8500000,
  },
  {
    id: "d4e5f6a7-b8c9-0123-def0-123456789044",
    user_id: "e5f6a7b8-c9d0-1234-ef01-123456789014",
    email: "tuan.pq@nexusblock.org",
    full_name: "Phạm Quốc Tuấn",
    booking_type: "meeting-room",
    booking_title: "Phòng họp Blockchain Hub (Gói 4h)",
    status: "pending",
    source: "web-dashboard",
    note: "Đặt phòng họp 8 người chiều thứ 6 tuần tới.",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    phone: "0977 889 900",
    company: "Nexus Block",
    tuitionFee: 4000000,
    deposit: 2000000,
  },
  {
    id: "e5f6a7b8-c9d0-1234-ef01-123456789055",
    user_id: "f6a7b8c9-d0e1-2345-f012-123456789015",
    email: "hang.vu@gmail.com",
    full_name: "Vũ Thanh Hằng",
    booking_type: "workshop",
    booking_title: "Web3 Design & Tokenomics Seminar",
    status: "rejected",
    source: "web-dashboard",
    note: "Khách bận lịch công tác, xin hủy chuyển sang khóa sau.",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5 + 3600000).toISOString(),
    phone: "0918 223 344",
    company: "Freelance",
    tuitionFee: 6000000,
    deposit: 0,
  },
];

if (!globalThis.__mockCourseRegistrations) {
  globalThis.__mockCourseRegistrations = initialRegistrations;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status")?.toLowerCase();
    const bookingType = searchParams.get("bookingType")?.toLowerCase();
    const search = searchParams.get("search")?.toLowerCase().trim();

    // 1. Validate pagination parameters (Standard across api/db/users and api/db/transactions)
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Invalid pagination parameters",
            details: "Page and limit must be positive, limit max 100",
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    // 2. Cache Logic (Standard Redis pattern)
    const cacheKey = `courses:registrations:list:${page}:${limit}:${status || "all"}:${bookingType || "all"}:${search || "none"}`;
    try {
      const cachedResponse = await redis.get(cacheKey);
      if (cachedResponse) {
        return NextResponse.json(JSON.parse(cachedResponse), { status: 200 });
      }
    } catch (redisError) {
      console.warn("Redis cache read failed for course registrations:", redisError);
    }

    // 3. Filter & Search Query
    let items = [...(globalThis.__mockCourseRegistrations || [])];

    if (status && status !== "all") {
      items = items.filter((item) => {
        const itemStatus = (item.status || "").toLowerCase();
        if (status === "approved" || status === "confirmed") {
          return itemStatus === "approved" || itemStatus === "confirmed";
        }
        return itemStatus === status;
      });
    }

    if (bookingType && bookingType !== "all") {
      items = items.filter(
        (item) => (item.booking_type || "").toLowerCase() === bookingType
      );
    }

    if (search) {
      items = items.filter(
        (item) =>
          item.id.toLowerCase().includes(search) ||
          (item.full_name || "").toLowerCase().includes(search) ||
          (item.email || "").toLowerCase().includes(search) ||
          (item.booking_title || "").toLowerCase().includes(search) ||
          (item.phone || "").toLowerCase().includes(search) ||
          (item.company || "").toLowerCase().includes(search)
      );
    }

    // 4. Sort newest first
    items.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const paginatedItems = items.slice(skip, skip + limit);

    // Transform and normalize all items
    const transformedItems: BookingRequestItem[] = paginatedItems.map((item: any) => ({
      id: item.id,
      user_id: item.user_id || `usr-${item.id.slice(0, 8)}`,
      email: item.email || item.userEmail || "",
      full_name: item.full_name || item.userName || "Học viên",
      booking_type: item.booking_type || item.bookingType || "course",
      booking_title: item.booking_title || item.courseName || "Khóa học",
      status: (item.status || "pending").toLowerCase() as BookingRequestItem["status"],
      source: item.source || "web-dashboard",
      note: item.note || item.notes || item.adminNotes || "",
      created_at: item.created_at || item.registrationDate || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
      phone: item.phone || item.userPhone || "",
      company: item.company || "",
      tuitionFee: Number(item.tuitionFee) || 0,
      deposit: Number(item.deposit) || 0,
    }));

    // 5. Dynamic Stats Calculation
    const all = globalThis.__mockCourseRegistrations || [];
    const stats = {
      total: all.length,
      pending: all.filter((i: any) => (i.status || "").toLowerCase() === "pending").length,
      approved: all.filter(
        (i: any) =>
          (i.status || "").toLowerCase() === "confirmed" ||
          (i.status || "").toLowerCase() === "approved"
      ).length,
      rejected: all.filter((i: any) => (i.status || "").toLowerCase() === "rejected").length,
      completed: all.filter(
        (i: any) =>
          (i.status || "").toLowerCase() === "cancelled" ||
          (i.status || "").toLowerCase() === "completed"
      ).length,
    };

    const responseData = {
      success: true,
      data: transformedItems,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages,
        },
        stats,
        timestamp: new Date().toISOString(),
      },
    };

    // 6. Save to Redis Cache (TTL 60s)
    try {
      await redis.setex(cacheKey, 60, JSON.stringify(responseData));
    } catch (redisError) {
      console.warn("Redis cache write failed for course registrations:", redisError);
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Prisma course registrations query failed:", error);
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
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      full_name,
      userName,
      email,
      userEmail,
      phone,
      userPhone,
      booking_title,
      courseName,
      booking_type = "course",
      note = "",
      notes = "",
      source = "web-dashboard",
      company = "",
      tuitionFee = 0,
      deposit = 0,
    } = body;

    const finalName = (full_name || userName || "").trim();
    const finalEmail = (email || userEmail || "").toLowerCase().trim();
    const finalTitle = (booking_title || courseName || "").trim();

    // 1. Required fields validation
    if (!finalEmail || !finalTitle) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Missing required fields: email and booking_title (or courseName) are required",
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    const randomSuffix = Math.random().toString(36).substring(2, 10);
    const newId = `bk-${Date.now()}-${randomSuffix}`;

    const newRegistration: BookingRequestItem = {
      id: newId,
      user_id: `usr-${randomSuffix}`,
      email: finalEmail,
      full_name: finalName || "Học viên mới",
      booking_type,
      booking_title: finalTitle,
      status: "pending",
      source,
      note: (note || notes || "").trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      phone: (phone || userPhone || "").trim(),
      company: (company || "").trim(),
      tuitionFee: Number(tuitionFee) || 0,
      deposit: Number(deposit) || 0,
    };

    if (!globalThis.__mockCourseRegistrations) {
      globalThis.__mockCourseRegistrations = initialRegistrations;
    }

    globalThis.__mockCourseRegistrations.unshift(newRegistration);

    // 2. Invalidate Redis Cache
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
        message: "Created course registration successfully",
        data: newRegistration,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create course registration API failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create course registration",
          details: error instanceof Error ? error.message : String(error),
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
