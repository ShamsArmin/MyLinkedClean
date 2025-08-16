const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read the migration SQL file
const migrationFile = path.join(__dirname, '01-add-industry-and-referral-features.sql');
const migrationSQL = fs.readFileSync(migrationFile, 'utf8');

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
    
    // Execute the migration SQL
    await pool.query(migrationSQL);
    
    // Commit the transaction
    await pool.query('COMMIT');
    
    console.log('-'.repeat(80));
    console.log('Migration completed successfully!');
    console.log('The following schema changes were applied:');
    console.log('1. Created industries table with sample data');
    console.log('2. Added industry_id, location, interests, and tags columns to users table');
    console.log('3. Created referral_links table for the Referral Links feature');
    console.log('4. Added necessary indexes for optimization');
    
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