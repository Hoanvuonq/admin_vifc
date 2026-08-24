import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { User } from "@/types/user";
import { redis } from "../../../../lib/redis";

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
        { status: 400 },
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

    // Build the where clause
    const whereClause: any = {};
    if (emailSearch) {
      whereClause.email = {
        contains: emailSearch,
        mode: "insensitive",
      };
    }

    // Get total count
    const total = await prisma.user.count({
      where: whereClause,
    });

    // Get paginated results
    const users = await prisma.user.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        email: true,
        full_name: true,
        status: true,
        auth_provider: true,
        provider_id: true,
        avatar_url: true,
        company: true,
        title: true,
        country: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
        user_cards: {
          select: {
            id: true,
            user_id: true,
            username: true,
            so_the: true,
            loai_the: true,
            created_at: true,
            updated_at: true,
          },
          orderBy: {
            created_at: "desc",
          },
        },
        user_subscriptions: {
          where: {
            status: "active",
          },
          select: {
            id: true,
            user_id: true,
            subscription_plan_id: true,
            status: true,
            start_date: true,
            end_date: true,
            created_at: true,
            updated_at: true,
            subscription_plans: {
              select: {
                id: true,
                name: true,
                price: true,
                duration_days: true,
                description: true,
                is_active: true,
              },
            },
          },
        },
      },
    });

    // Transform data to conform to User interface
    const transformedUsers: User[] = users.map((user) => {
      const [activeSub] = user.user_subscriptions;
      const [primaryCard] = user.user_cards || [];

      return {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        status: user.status,
        auth_provider: user.auth_provider,
        provider_id: user.provider_id,
        avatar_url: user.avatar_url,
        company: user.company,
        title: user.title,
        country: user.country,
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at.toISOString(),
        deleted_at: user.deleted_at ? user.deleted_at.toISOString() : null,
        card: primaryCard
          ? {
              id: primaryCard.id,
              user_id: primaryCard.user_id,
              username: primaryCard.username,
              so_the: primaryCard.so_the,
              loai_the: primaryCard.loai_the,
              created_at: primaryCard.created_at.toISOString(),
              updated_at: primaryCard.updated_at.toISOString(),
            }
          : null,
        user_cards: user.user_cards?.map((c) => ({
          id: c.id,
          user_id: c.user_id,
          username: c.username,
          so_the: c.so_the,
          loai_the: c.loai_the,
          created_at: c.created_at.toISOString(),
          updated_at: c.updated_at.toISOString(),
        })),
        subscription: activeSub
          ? {
            id: activeSub.id,
            user_id: activeSub.user_id,
            subscription_plan_id: activeSub.subscription_plan_id,
            status: activeSub.status,
            start_date: activeSub.start_date ? activeSub.start_date.toISOString() : null,
            end_date: activeSub.end_date ? activeSub.end_date.toISOString() : null,
            created_at: activeSub.created_at.toISOString(),
            updated_at: activeSub.updated_at.toISOString(),
            plan: {
              id: activeSub.subscription_plans.id,
              name: activeSub.subscription_plans.name,
              price: Number(activeSub.subscription_plans.price),
              duration_days: activeSub.subscription_plans.duration_days,
              description: activeSub.subscription_plans.description,
              is_active: activeSub.subscription_plans.is_active,
            },
          }
          : null,
      };
    });

    const totalPages = Math.ceil(total / limit);

    const responseData = {
      success: true,
      data: transformedUsers,
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
    console.error("Prisma user query failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Failed to fetch users",
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, password, subscription_plan_id, status = "active", company, isVIFCPass = false } = body;

    if (!email || !full_name || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Missing required fields: email, full_name, password are required",
          },
        },
        { status: 400 },
      );
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "EMAIL_EXISTS",
            message: "Email này đã tồn tại trong hệ thống",
          },
        },
        { status: 409 },
      );
    }

    const bcrypt = await import("bcryptjs");
    const hashedPassword = bcrypt.hashSync(password, 10);

    await prisma.$transaction(async (tx) => {
      // Create user in DB
      const user = await tx.user.create({
        data: {
          full_name: full_name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          status: status.toLowerCase(),
          company: company?.trim() || null,
        },
      });

      if (!!subscription_plan_id) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 300); // Assuming a default duration of 300 days for new subscriptions
        
        await tx.userSubscription.create({
          data: {
            user_id: user.id,
            subscription_plan_id,
            status: "active",
            start_date: new Date(),
            end_date: endDate,
          },
        });
      }

      if (isVIFCPass) {
        // Find the latest card number and increment
        const latestCard = await tx.userCard.findFirst({
          orderBy: { so_the: "desc" },
          select: { so_the: true },
        });

        const nextNumber = latestCard ? parseInt(latestCard.so_the, 10) + 1 : 1;
        const so_the = String(nextNumber).padStart(5, "0");

        await tx.userCard.create({
          data: {
            user_id: user.id,
            username: full_name.trim(),
            so_the,
            loai_the: subscription_plan_id || "DEFAULT", // Default card type if subscription_plan_id is not provided
          },
        });
      }
    });

    // Invalidate Redis cache if available
    try {
      const keys = await redis.keys("users:list:*");
      if (keys && keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (e) {
      // Redis is optional
    }

    return NextResponse.json(
      {
        success: true,
        message: "Created user successfully",
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create user API failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 },
    );
  }
}
