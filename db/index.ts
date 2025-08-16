import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Pull your database URL from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // should be defined in your Replit secrets
});

export const db = drizzle(pool);
