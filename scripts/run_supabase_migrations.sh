#!/usr/bin/env bash
set -euo pipefail

# Simple migration runner for Supabase SQL files in supabase/migrations
# Requires: PGPASSWORD or connection string via SUPABASE_DB_URL
# Usage: SUPABASE_DB_URL="postgresql://user:pass@host:5432/db" ./scripts/run_supabase_migrations.sh

MIGRATIONS_DIR="$(dirname "$0")/../supabase/migrations"

if [ -z "${SUPABASE_DB_URL:-}" ]; then
  echo "SUPABASE_DB_URL not set. Set it to your Postgres connection string and retry."
  exit 1
fi

echo "Running migrations from $MIGRATIONS_DIR against $SUPABASE_DB_URL"

for f in $(ls "$MIGRATIONS_DIR"/*.sql 2>/dev/null | sort); do
  echo "-- Applying $f"
  psql "$SUPABASE_DB_URL" -f "$f"
done

echo "Migrations complete."
