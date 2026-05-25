import { S3Client } from "@aws-sdk/client-s3";

export const getS3Client = () => {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_KEY_ID || process.env.AWS_SECRET_KEY;
  const region = process.env.AWS_REGION || "ap-southeast-2";

  if (!accessKeyId || !secretAccessKey) {
    console.error("❌ AWS Credentials missing in environment variables!");
    console.error("AWS Access Key is:", accessKeyId ? "SET" : "UNDEFINED");
    console.error(
      "AWS Secret Key is:",
      secretAccessKey ? "SET" : "UNDEFINED",
    );
  }

  return new S3Client({
    region,
    credentials: {
      accessKeyId: accessKeyId || "",
      secretAccessKey: secretAccessKey || "",
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
  });
};
