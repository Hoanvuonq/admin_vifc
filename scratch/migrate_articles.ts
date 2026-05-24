import { Client } from "pg";

const connectionString = "postgresql://postgres.wojnvwjrguhitupkdqth:CUl0lFsNMuVoIlZw@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log("Connected to PostgreSQL database");

  try {
    // 1. Drop existing primary key or other constraints on articles.id if needed
    // In PostgreSQL, to alter UUID to VARCHAR, we can do type conversion USING cast
    console.log("Altering articles.id to VARCHAR(255)...");
    
    // First, let's drop the default gen_random_uuid() constraint on id
    await client.query(`ALTER TABLE "articles" ALTER COLUMN "id" DROP DEFAULT;`);
    
    // Now alter the column type to VARCHAR(255)
    await client.query(`ALTER TABLE "articles" ALTER COLUMN "id" TYPE VARCHAR(255);`);
    
    // 2. Add description, thumbnail, layouts, blocks, seo_title, seo_description, seo_keywords
    console.log("Adding description column...");
    await client.query(`ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "description" TEXT;`);
    
    console.log("Adding thumbnail column...");
    await client.query(`ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "thumbnail" TEXT;`);
    
    console.log("Adding layouts column...");
    await client.query(`ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "layouts" VARCHAR(255);`);
    
    console.log("Adding blocks column...");
    await client.query(`ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "blocks" JSONB;`);
    
    console.log("Adding seo_title column...");
    await client.query(`ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "seo_title" VARCHAR(255);`);
    
    console.log("Adding seo_description column...");
    await client.query(`ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "seo_description" TEXT;`);
    
    console.log("Adding seo_keywords column...");
    await client.query(`ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "seo_keywords" VARCHAR(500);`);
    
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.end();
  }
}

main();
