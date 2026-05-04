-- Enables gen_random_uuid(). Neon has this on by default; included so
-- self-hosted Postgres works without manual setup.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS inquiries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  email         TEXT,
  city          TEXT NOT NULL,
  product_slug  TEXT,
  message       TEXT NOT NULL,
  ip            TEXT,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sales workflow lists newest first.
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries (created_at DESC);

-- Faceting by interested product is likely (admin filtering).
CREATE INDEX IF NOT EXISTS idx_inquiries_product_slug ON inquiries (product_slug)
  WHERE product_slug IS NOT NULL;
