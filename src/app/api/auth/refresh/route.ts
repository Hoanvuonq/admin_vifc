import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "../../../../lib/prisma";
import { generateTokenPair, verifyRefreshToken } from "../../../../lib/jwt";

// POST /api/auth/refresh - Refresh access token using a refresh token
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const refresh_token = cookieStore.get("refresh_token")?.value;

    if (!refresh_token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "refresh_token cookie is missing",
          },
        },
        { status: 401 }
      );
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refresh_token);
    } catch (err: any) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: err.name === "TokenExpiredError" ? "Refresh token expired" : "Invalid refresh token",
          },
        },
        { status: 401 }
      );
    }

    // Check if the user still exists and is active
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
        status: "active",
        deleted_at: null,
      },
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "USER_NOT_FOUND",
            message: "User not found or inactive",
          },
        },
        { status: 401 }
      );
    }

    // Check if the user still has the 'admin' role
    const isAdmin = user.user_roles.some(
      (ur) => ur.role.name.toLowerCase() === "admin"
    );

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ACCESS_DENIED",
            message: "Access denied. Only administrators are allowed.",
          },
        },
        { status: 403 }
      );
    }

    // Generate a new token pair
    const tokens = generateTokenPair({
      id: user.id,
      email: user.email,
      role: "admin",
    });

    cookieStore.set("refresh_token", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json(
      {
        success: true,
        message: "Token refreshed successfully",
        data: {
          access_token: tokens.accessToken,
          expires_at: tokens.expiresAt,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin refresh token API failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred during token refresh",
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 }
    );
  }
}
