import { s3ImageClient } from "@/config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType } = await req.json();

    const key = `uploads/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_IMAGE!,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3ImageClient, command, {
      expiresIn: 60,
    });

    const fileUrl = `https://${process.env.AWS_BUCKET_IMAGE}.s3.amazonaws.com/${key}`;

    return NextResponse.json({
      uploadUrl,
      fileUrl,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Upload error",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
