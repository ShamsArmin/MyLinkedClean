-- Normalize existing emails to lowercase
UPDATE users SET email = LOWER(email) WHERE email IS NOT NULL;

-- Enforce case-insensitive uniqueness on email
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));
