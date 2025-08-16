import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";

// Configure Neon Database to use WebSockets (needed for serverless environments)
neonConfig.webSocketConstructor = ws;

// Verify database URL is available
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log("Connecting to database...");

// Create connection pool with more conservative settings for stability
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 5, // Reduce max connections for stability
  idleTimeoutMillis: 60000, // Keep connections longer
  connectionTimeoutMillis: 10000, // Increase timeout
  maxUses: 7500, // Limit connection reuse
  allowExitOnIdle: true
});

// Initialize Drizzle ORM with our schema
export const db = drizzle({ client: pool, schema });

// Add connection error handling
pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

// Test database connection with retry logic
async function testConnection(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log("Database connection successful");
      client.release();
      return true;
    } catch (err) {
      console.error(`Database connection attempt ${i + 1} failed:`, err);
      if (i === retries - 1) {
        console.error("All database connection attempts failed");
        return false;
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

testConnection();