const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read all migration SQL files in order
const migrationDir = __dirname;
const migrationFiles = fs
  .readdirSync(migrationDir)
  .filter(f => f.endsWith('.sql'))
  .sort();

async function runMigration() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Running migration...');
    console.log('-'.repeat(80));
    
    // Start a transaction
    await pool.query('BEGIN');
    
    for (const file of migrationFiles) {
      const migrationSQL = fs.readFileSync(path.join(migrationDir, file), 'utf8');
      console.log(`Applying migration: ${file}`);
      await pool.query(migrationSQL);
    }
    
    // Commit the transaction
    await pool.query('COMMIT');
    
    console.log('-'.repeat(80));
    console.log('Migration completed successfully!');
    
  } catch (err) {
    // Rollback the transaction in case of error
    await pool.query('ROLLBACK');
    console.error('Error running migration:', err);
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
  }
}

runMigration().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});