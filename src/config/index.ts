import { S3Client } from "@aws-sdk/client-s3";

export const s3ImageClient = new S3Client({
  region: process.env.AWS_REGION_IMAGE!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export const s3PdfClient = new S3Client({
  region: process.env.AWS_REGION_BDF!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});
