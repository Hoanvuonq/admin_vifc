import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { User } from "@/types/user";
import { redis } from "../../../../../lib/redis";

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
    const [primaryCard] = user.user_cards || [];
    
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

export async function PATCH(
  request: Request,
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

    const body = await request.json();
    const {
      subscription_plan_id,
      full_name,
      status,
      avatar_url,
      company,
      country,
      title,
      isVIFCPass,
      so_the,
      loai_the,
      card_username,
    } = body;

    // Execute in transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // 1. Update Basic Info
      if (
        full_name !== undefined ||
        status !== undefined ||
        avatar_url !== undefined ||
        company !== undefined ||
        country !== undefined ||
        title !== undefined
      ) {
        await tx.user.update({
          where: { id },
          data: {
            ...(full_name !== undefined && { full_name: full_name.trim() }),
            ...(status !== undefined && { status: status.toLowerCase() }),
            ...(avatar_url !== undefined && { avatar_url }),
            ...(company !== undefined && { company: company?.trim() || null }),
            ...(country !== undefined && { country: country?.trim() || null }),
            ...(title !== undefined && { title: title?.trim() || null }),
          },
        });
      }

      // 2. Update Subscription Plan
      if (subscription_plan_id !== undefined) {
        const activeSub = await tx.userSubscription.findFirst({
          where: { user_id: id, status: "active" },
        });

        if (subscription_plan_id === "FREE" || !subscription_plan_id) {
          if (activeSub) {
            await tx.userSubscription.delete({
              where: { id: activeSub.id },
            });
          }
        } else {
          if (activeSub) {
            await tx.userSubscription.update({
              where: { id: activeSub.id },
              data: { subscription_plan_id },
            });
          } else {
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 300); // Default duration of 300 days

            await tx.userSubscription.create({
              data: {
                user_id: id,
                subscription_plan_id,
                status: "active",
                start_date: new Date(),
                end_date: endDate,
              },
            });
          }
        }
      }

      // 3. Update UserCard (VIFC-Pass Card)
      if (
        isVIFCPass !== undefined ||
        so_the !== undefined ||
        loai_the !== undefined ||
        card_username !== undefined
      ) {
        const existingCard = await tx.userCard.findFirst({
          where: { user_id: id },
          orderBy: { created_at: "desc" },
        });

        if (isVIFCPass === false) {
          if (existingCard) {
            await tx.userCard.deleteMany({
              where: { user_id: id },
            });
          }
        } else if (isVIFCPass === true || existingCard || so_the !== undefined || loai_the !== undefined) {
          if (existingCard) {
            await tx.userCard.update({
              where: { id: existingCard.id },
              data: {
                ...(so_the !== undefined && { so_the: String(so_the).trim() }),
                ...(loai_the !== undefined && { loai_the: String(loai_the).trim() }),
                ...(card_username !== undefined && { username: String(card_username).trim() }),
                ...(card_username === undefined && full_name !== undefined && { username: full_name.trim() }),
              },
            });
          } else {
            let finalSoThe = so_the ? String(so_the).trim() : "";
            if (!finalSoThe) {
              const latestCard = await tx.userCard.findFirst({
                orderBy: { so_the: "desc" },
                select: { so_the: true },
              });
              const nextNumber = latestCard && !isNaN(parseInt(latestCard.so_the, 10))
                ? parseInt(latestCard.so_the, 10) + 1
                : 1;
              finalSoThe = String(nextNumber).padStart(5, "0");
            }

            const currentUser = await tx.user.findUnique({
              where: { id },
              select: { full_name: true },
            });

            await tx.userCard.create({
              data: {
                user_id: id,
                username: card_username?.trim() || full_name?.trim() || currentUser?.full_name || "MEMBER",
                so_the: finalSoThe,
                loai_the: loai_the?.trim() || subscription_plan_id || "DEFAULT",
              },
            });
          }
        }
      }
    });

    try {
      const keys = await redis.keys("users:list:*");
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (redisError) {
      console.warn("Redis cache invalidation failed for users list:", redisError);
    }

    return NextResponse.json(
      {
        success: true,
        // data: transformedUser,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Prisma user update failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UPDATE_FAILED",
          message: "Failed to update user plan/role",
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

    await prisma.$transaction(async (tx) => {
      await tx.userCard.deleteMany({ where: { user_id: id } });
      await tx.userSubscription.deleteMany({ where: { user_id: id } });
      await tx.user.delete({ where: { id } });
    });

    try {
      const keys = await redis.keys("users:list:*");
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (redisError) {
      console.warn("Redis cache invalidation failed for deleted user:", redisError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Prisma user delete failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DELETE_FAILED",
          message: error?.message || "Failed to delete user",
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}

