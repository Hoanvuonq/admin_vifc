import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { redis } from "../../../../lib/redis";
import type { SubscriptionPlan } from "@/types/user";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const cacheKey = `subscription_plans:list:${activeOnly ? "active" : "all"}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json(JSON.parse(cached), { status: 200 });
      }
    } catch (redisError) {
      console.warn("Redis cache read failed for subscription plans:", redisError);
    }

    const whereClause: any = {
      deleted_at: null,
    };
    if (activeOnly) {
      whereClause.is_active = true;
    }

    const plans = await prisma.subscription_plans.findMany({
      where: whereClause,
      orderBy: {
        price: "asc",
      },
      select: {
        id: true,
        name: true,
        price: true,
        duration_days: true,
        description: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    const transformed: SubscriptionPlan[] = plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      price: Number(plan.price),
      duration_days: plan.duration_days,
      description: plan.description,
      is_active: plan.is_active,
    }));

    const responseData = {
      success: true,
      data: transformed,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    try {
      await redis.setex(cacheKey, 60, JSON.stringify(responseData));
    } catch (redisError) {
      console.warn("Redis cache write failed for subscription plans:", redisError);
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Prisma subscription plans GET failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Failed to fetch subscription plans",
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
