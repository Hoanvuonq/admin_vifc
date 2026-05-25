import { S3Client } from "@aws-sdk/client-s3";

export const getS3Client = () => {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_KEY_ID;
  const region = process.env.AWS_REGION || "ap-southeast-2";

  if (!accessKeyId || !secretAccessKey) {
    console.error("❌ AWS Credentials missing in environment variables!");
    console.error("AWS_ACCESS_KEY_ID is:", accessKeyId ? "SET" : "UNDEFINED");
    console.error(
      "AWS_SECRET_KEY_ID is:",
      secretAccessKey ? "SET" : "UNDEFINED",
    );
  }

  return new S3Client({
    region,
    credentials: {
      accessKeyId: accessKeyId || "",
      secretAccessKey: secretAccessKey || "",
    },
  });
};
