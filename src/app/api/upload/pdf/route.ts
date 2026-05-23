import s3Client from "@/config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType } = await req.json();

    // ✅ validate file type
    if (contentType !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF allowed" },
        { status: 400 }
      );
    }

    const key = `pdfs/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      ContentType: contentType, // phải là application/pdf
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 60,
    });

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;

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
      { status: 500 }
    );
  }
}