import { s3PdfClient, s3ImageClient } from "@/config";
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
    console.log("process.env.AWS_BUCKET_BDF", process.env.AWS_BUCKET_BDF);

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF allowed" }, { status: 400 });
    }

    // Validate 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File exceeds 10MB limit" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
    const pdfKey = `pdfs/${Date.now()}-${safeFilename}`;
    const thumbKey = `pdfs/thumbnails/${Date.now()}-thumb.jpg`;

    // Upload PDF
    await s3PdfClient.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_BDF!,
        Key: pdfKey,
        Body: buffer,
        ContentType: "application/pdf",
      }),
    );

    const fileUrl = `https://${process.env.AWS_BUCKET_BDF}.s3.amazonaws.com/${pdfKey}`;

    let thumbnailUrl = null;

    if (thumbnail) {
      try {
        const thumbBuffer = Buffer.from(await thumbnail.arrayBuffer());
        await s3ImageClient.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_IMAGE!,
            Key: thumbKey,
            Body: thumbBuffer,
            ContentType: "image/jpeg",
          }),
        );
        thumbnailUrl = `https://${process.env.AWS_BUCKET_IMAGE}.s3.amazonaws.com/${thumbKey}`;
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
