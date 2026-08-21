import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { redis } from "../../../../../../lib/redis";
import { BookingRequestItem } from "@/types/course";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Validate ID parameter (Standard from api/db/users/[id])
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
        { status: 400 }
      );
    }

    // 2. Cache Logic
    const cacheKey = `courses:registrations:detail:${id}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json(JSON.parse(cached), { status: 200 });
      }
    } catch (redisError) {
      console.warn("Redis cache read failed for registration detail:", redisError);
    }

    // 3. Find registration
    const items: BookingRequestItem[] = globalThis.__mockCourseRegistrations || [];
    const found = items.find((i) => i.id === id);

    if (!found) {
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
        { status: 404 }
      );
    }

    const transformedItem: BookingRequestItem = {
      id: found.id,
      user_id: found.user_id || `usr-${found.id.slice(0, 8)}`,
      email: found.email || (found as any).userEmail || "",
      full_name: found.full_name || (found as any).userName || "Học viên",
      booking_type: found.booking_type || (found as any).bookingType || "course",
      booking_title: found.booking_title || (found as any).courseName || "Khóa học",
      status: (found.status || "pending").toLowerCase() as BookingRequestItem["status"],
      source: found.source || "web-dashboard",
      note: found.note || (found as any).notes || (found as any).adminNotes || "",
      created_at: found.created_at || (found as any).registrationDate || new Date().toISOString(),
      updated_at: found.updated_at || new Date().toISOString(),
      phone: found.phone || (found as any).userPhone || "",
      company: found.company || "",
      tuitionFee: Number((found as any).tuitionFee) || 0,
      deposit: Number((found as any).deposit) || 0,
    };

    const responseData = {
      success: true,
      data: transformedItem,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    // 4. Save to Redis Cache (TTL 60s)
    try {
      await redis.setex(cacheKey, 60, JSON.stringify(responseData));
    } catch (redisError) {
      console.warn("Redis cache write failed:", redisError);
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Prisma course registration detail query failed:", error);
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
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Validate ID parameter
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
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, note, phone, company, booking_title, tuitionFee, deposit } = body;

    const items: BookingRequestItem[] = globalThis.__mockCourseRegistrations || [];
    const index = items.findIndex((i) => i.id === id);

    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Course registration not found to update",
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 }
      );
    }

    const currentItem = items[index];
    const updatedItem: BookingRequestItem = {
      ...currentItem,
      status: status !== undefined ? status : currentItem.status,
      note: note !== undefined ? note : currentItem.note,
      phone: phone !== undefined ? phone : currentItem.phone,
      company: company !== undefined ? company : currentItem.company,
      booking_title: booking_title !== undefined ? booking_title : currentItem.booking_title,
      tuitionFee: tuitionFee !== undefined ? Number(tuitionFee) : currentItem.tuitionFee,
      deposit: deposit !== undefined ? Number(deposit) : currentItem.deposit,
      updated_at: new Date().toISOString(),
    };

    items[index] = updatedItem;
    globalThis.__mockCourseRegistrations = items;

    // 2. Invalidate Redis Cache (Standard pattern from api/db/users/[id])
    try {
      const keys = await redis.keys("courses:registrations:*");
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (redisError) {
      console.warn("Redis cache invalidation failed for course registrations:", redisError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Updated course registration successfully",
        data: updatedItem,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Prisma course registration update failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UPDATE_FAILED",
          message: "Failed to update course registration",
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Validate ID parameter
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
        { status: 400 }
      );
    }

    const items: BookingRequestItem[] = globalThis.__mockCourseRegistrations || [];
    const initialLength = items.length;
    const filtered = items.filter((i) => i.id !== id);

    if (filtered.length === initialLength) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Course registration not found to delete",
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 }
      );
    }

    globalThis.__mockCourseRegistrations = filtered;

    // 2. Invalidate Redis Cache
    try {
      const keys = await redis.keys("courses:registrations:*");
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (redisError) {
      console.warn("Redis cache invalidation failed:", redisError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Deleted course registration successfully",
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Prisma course registration delete failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DELETE_FAILED",
          message: "Failed to delete course registration",
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
