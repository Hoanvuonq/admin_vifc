import s3Client from "@/config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType } = await req.json();

    const key = `image/${Date.now()}-${filename}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        ContentType: contentType,
      })
    )

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;

    return NextResponse.json({ fileUrl });
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
