import { getS3Client } from "@/config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");
    const contentType = searchParams.get("contentType");
    const type = searchParams.get("type"); // "pdf", "image", "thumbnail"

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Missing filename or contentType" },
        { status: 400 },
      );
    }

    const safeFilename = filename.replace(/[^\x00-\x7F]/g, "").replace(/[^a-zA-Z0-9.\-_]/g, "");
    
    let folder = "uploads";
    if (type === "pdf") folder = "pdfs";
    else if (type === "image") folder = "image";
    else if (type === "thumbnail") folder = "pdfs/thumbnails";

    const key = `${folder}/${Date.now()}-${safeFilename}`;

    const s3Client = getS3Client();
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour
    });

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;

    return NextResponse.json({ presignedUrl, fileUrl, key });
  } catch (err) {
    console.error("Presign error:", err);
    return NextResponse.json(
      {
        error: "Failed to generate pre-signed URL",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
