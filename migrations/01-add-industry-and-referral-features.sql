-- Create the industries table if it doesn't exist
CREATE TABLE IF NOT EXISTS industries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add new columns to the users table for Industry Discovery feature
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS industry_id INTEGER REFERENCES industries(id),
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS interests TEXT[],
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Create the referral_links table for the Referral Links feature
CREATE TABLE IF NOT EXISTS referral_links (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  image TEXT,
  link_type TEXT NOT NULL DEFAULT 'friend',
  reference_user_id INTEGER REFERENCES users(id),
  reference_company TEXT,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Insert some sample industries
INSERT INTO industries (name, icon) VALUES
  ('Technology', 'computer'),
  ('Design', 'paintbrush'),
  ('Marketing', 'megaphone'),
  ('Finance', 'currency-dollar'),
  ('Education', 'book'),
  ('Healthcare', 'heart-pulse'),
  ('Entertainment', 'film'),
  ('Architecture', 'building'),
  ('Photography', 'camera'),
  ('Writing', 'pen-tool')
ON CONFLICT (name) DO NOTHING;

-- Add industry index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_industry_id ON users(industry_id);

-- Add indexes for referral links
CREATE INDEX IF NOT EXISTS idx_referral_links_user_id ON referral_links(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_links_link_type ON referral_links(link_type);