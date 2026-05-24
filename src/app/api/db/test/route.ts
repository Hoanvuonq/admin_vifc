import { NextResponse } from "next/server";
import { query } from "@/lib/postgres";

export async function GET() {
  try {
    const result = await query("SELECT NOW() AS now");

    return NextResponse.json({
      status: "ok",
      now: result.rows[0]?.now ?? null,
    });
  } catch (error) {
    console.error("Postgres connection error:", error);
    return NextResponse.json(
      {
        error: "Postgres connection failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
