import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { redis } from "../../../../lib/redis";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

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

    const emailSearch = searchParams.get("email");

    // Cache logic
    const cacheKey = `users:list:${page}:${limit}:${emailSearch || "all"}`;
    try {
      const cachedResponse = await redis.get(cacheKey);
      if (cachedResponse) {
        return NextResponse.json(JSON.parse(cachedResponse), { status: 200 });
      }
    } catch (redisError) {
      console.warn("Redis cache read failed:", redisError);
    }
    
    // Build where clause
    const whereClause: any = {};
    if (status && status !== "ALL") {
      whereClause.status = status;
    }
    
    if (search) {
      whereClause.OR = [
        { transaction_id: { contains: search, mode: 'insensitive' } },
        { users: { email: { contains: search, mode: 'insensitive' } } },
        { users: { full_name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Get total count
    const total = await prisma.payments.count({ where: whereClause });

    // Get paginated results
    const transactions = await prisma.payments.findMany({
      skip,
      take: limit,
      where: whereClause,
      orderBy: [
        { created_at: "desc" }
      ],
      select: {
        id: true,
        user_id: true,
        gateway: true,
        amount: true,
        currency: true,
        transaction_id: true,
        status: true,
        created_at: true,
        users: {
          select: {
            full_name: true,
            email: true,
            avatar_url: true,
          },
        },
        user_subscriptions: {
          select: {
            subscription_plans: {
              select: {
                name: true,
              }
            }
          }
        }
      },
    });

    // Transform data to conform to frontend TransactionItem interface
    const transformedTransactions = transactions.map((t: any) => ({
      id: t.id,
      userId: t.user_id,
      userName: t.users?.full_name || "Unknown User",
      userEmail: t.users?.email || "",
      userAvatar: t.users?.avatar_url || "",
      planName: t.user_subscriptions?.subscription_plans?.name || "Unknown Plan",
      amount: Number(t.amount) || 0,
      currency: t.currency || "VND",
      status: t.status ? t.status.toUpperCase() : "PENDING",
      paymentMethod: t.gateway || "Unknown",
      transactionDate: t.created_at.toISOString(),
      description: t.transaction_id ? `Txn Ref: ${t.transaction_id}` : undefined,
    }));

    const totalPages = Math.ceil(total / limit);

    const responseData = {
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
    };

    // Save to cache
    try {
      await redis.setex(cacheKey, 60, JSON.stringify(responseData));
    } catch (redisError) {
      console.warn("Redis cache write failed:", redisError);
    }

    return NextResponse.json(responseData, { status: 200 });
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
