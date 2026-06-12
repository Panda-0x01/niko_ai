#!/bin/bash
set -e

echo ""
echo "============================================="
echo "   Niko AI Backend — Starting"
echo "============================================="

# Always run from /app so alembic.ini is found
cd /app

# ── 1. Wait for PostgreSQL ─────────────────────────────────────
echo "[1/3] Waiting for database..."
MAX_TRIES=30
COUNT=0
until python -c "
import psycopg2, os, sys
try:
    psycopg2.connect(os.environ['DATABASE_URL'])
except Exception as e:
    sys.exit(1)
" 2>/dev/null; do
  COUNT=$((COUNT+1))
  if [ $COUNT -ge $MAX_TRIES ]; then
    echo "ERROR: Database never became ready after ${MAX_TRIES} attempts."
    exit 1
  fi
  echo "  waiting... ($COUNT/$MAX_TRIES)"
  sleep 2
done
echo "  Database is ready."

# ── 2. Run migrations ──────────────────────────────────────────
echo "[2/3] Running Alembic migrations..."
alembic -c /app/alembic.ini upgrade head
echo "  Migrations applied."

# ── 3. Seed disease knowledge base ────────────────────────────
echo "[3/3] Seeding disease knowledge base..."
python -m app.db.seed
echo "  Seed complete."

echo "============================================="
echo "   Starting Uvicorn on :8000"
echo "============================================="
echo ""

exec python -m uvicorn app.main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --workers 2 \
  --forwarded-allow-ips "*"
