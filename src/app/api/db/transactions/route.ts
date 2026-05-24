import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Validate pagination parameters
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

    const skip = (page - 1) * limit;

    // Get total count
    const total = await prisma.userSubscription.count();

    // Get paginated results
    const transactions = await prisma.userSubscription.findMany({
      skip,
      take: limit,
      orderBy: [
        { status: "desc" },
        { created_at: "desc" }
      ],
      select: {
        id: true,
        user_id: true,
        subscription_plan_id: true,
        start_date: true,
        end_date: true,
        status: true,
        created_at: true,
        updated_at: true,
        users: {
          select: {
            email: true,
            avatar_url: true,
          },
        },
      },
    });

    // Transform data to conform to SubscriptionTransaction interface
    const transformedTransactions = transactions.map((t: any) => ({
      id: t.id,
      user_id: t.user_id,
      user_email: t.users?.email || null,
      user_avatar: t.users?.avatar_url || null,
      subscription_plan_id: t.subscription_plan_id,
      start_date: t.start_date ? t.start_date.toISOString() : null,
      end_date: t.end_date ? t.end_date.toISOString() : null,
      status: t.status,
      created_at: t.created_at.toISOString(),
      updated_at: t.updated_at.toISOString(),
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        data: transformedTransactions,
        meta: {
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasMore: page < totalPages,
          },
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Prisma user subscription query failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Failed to fetch transactions",
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
