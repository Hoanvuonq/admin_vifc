import { getS3Client } from "@/config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const thumbnail = formData.get("thumbnail") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF allowed" }, { status: 400 });
    }

    // Validate 20MB
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File exceeds 20MB limit" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
    const pdfKey = `pdfs/${Date.now()}-${safeFilename}`;
    const thumbKey = `pdfs/thumbnails/${Date.now()}-thumb.jpg`;

    const s3Client = getS3Client();
    // Upload PDF
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: pdfKey,
        Body: buffer,
        ContentType: "application/pdf",
      }),
    );

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${pdfKey}`;

    let thumbnailUrl: string | null = null;

    if (thumbnail) {
      try {
        const thumbBuffer = Buffer.from(await thumbnail.arrayBuffer());
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: thumbKey,
            Body: thumbBuffer,
            ContentType: "image/jpeg",
          }),
        );
        thumbnailUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${thumbKey}`;
      } catch (thumbErr) {
        console.warn("Thumbnail upload failed, but PDF succeeded:", thumbErr);
      }
    }

    return NextResponse.json({ fileUrl, thumbnailUrl });
  } catch (err) {
    console.error("PDF upload error:", err);
    return NextResponse.json(
      {
        error: "Upload error",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}

// Configure route to handle large file uploads (up to 50MB)
export const maxDuration = 60; // 60 second timeout for large file uploads
