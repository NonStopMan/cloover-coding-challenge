import "dotenv/config";
import { Pool } from "pg";

export default async function globalSetup() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env before running E2E tests.",
    );
  }

  const pool = new Pool({ connectionString: databaseUrl });
  try {
    await pool.query("SELECT 1");
  } catch {
    throw new Error(
      "Cannot connect to PostgreSQL. Start the database with: docker compose up -d",
    );
  } finally {
    await pool.end();
  }
}
