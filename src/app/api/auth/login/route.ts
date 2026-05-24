import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { generateTokenPair } from "../../../../lib/jwt";

// Helper function to compare unhashed password with the bcrypt hash in database
function CompareHashAndPassword(password: string, hash: string): boolean {
  try {
    return bcrypt.compareSync(password, hash);
  } catch (error) {
    console.error("Password comparison failed:", error);
    return false;
  }
}

// POST /api/auth/login - Login for Admin role only
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Username (email) and password are required",
          },
        },
        { status: 400 },
      );
    }

    // Find user by email including their roles
    const user = await prisma.user.findFirst({
      where: {
        email: username,
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
            code: "INVALID_CREDENTIALS",
            message: "Invalid username or password",
          },
        },
        { status: 401 },
      );
    }

    // Check if the user has the 'admin' role
    const isAdmin = user.user_roles.some(
      (ur) => ur.role.name.toLowerCase() === "admin",
    );

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ACCESS_DENIED",
            message: "Access denied. Only administrators are allowed to login.",
          },
        },
        { status: 403 },
      );
    }

    // Compare the unhashed password from payload with the hashed password from the DB
    if (!user.password || !CompareHashAndPassword(password, user.password)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid username or password",
          },
        },
        { status: 401 },
      );
    }

    // Login successful
    const tokens = generateTokenPair({
      id: user.id,
      email: user.email,
      role: "admin",
    });

    const cookieStore = await cookies();
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
        message: "Login successful",
        data: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          status: user.status,
          role: "admin",
          access_token: tokens.accessToken,
          expires_at: tokens.expiresAt,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Admin login API failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred during authentication",
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 },
    );
  }
}
