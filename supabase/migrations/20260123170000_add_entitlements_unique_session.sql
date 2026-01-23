-- Add unique index to prevent duplicate entitlements by Stripe session_id
-- Run this in your Supabase SQL editor or via psql against your DB.

CREATE UNIQUE INDEX IF NOT EXISTS idx_entitlements_session_id
  ON entitlements(session_id);
