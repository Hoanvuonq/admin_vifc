import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { User } from "@/types/user";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || id.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "User ID is required",
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
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

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "User not found",
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 }
      );
    }

    // Transform data to conform to User interface
    const [activeSub] = user.user_subscriptions;
    
    const transformedUser: User = {
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
      subscription: activeSub ? {
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
      } : null,
    };

    return NextResponse.json(
      {
        success: true,
        data: transformedUser,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Prisma user query failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Failed to fetch user",
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
