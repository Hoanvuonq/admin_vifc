import { Pool } from "pg";

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("POSTGRES_URL is not defined in environment");
}

declare global {
  // eslint-disable-next-line no-var
  var postgresPool: Pool | undefined;
}

const pool = globalThis.postgresPool ?? new Pool({
  connectionString,
  max: 10,
});

if (process.env.NODE_ENV !== "production") {
  globalThis.postgresPool = pool;
}

export default pool;

export async function query<T = any>(text: string, params?: unknown[]) {
  return pool.query<T>(text, params);
}
