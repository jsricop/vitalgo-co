#!/bin/bash
set -e
echo "🚀 Starting VitalGo Backend..."

echo "⏳ Waiting for database connection..."
while ! poetry run python -c "from sqlalchemy import create_engine; create_engine(\"$DATABASE_URL\").connect()" 2>/dev/null; do
    echo "Waiting for database..."
    sleep 2
done

echo "🔧 Running database initialization..."
if [[ "$SKIP_DB_INIT" == "true" ]]; then
    echo "Skipping database initialization (SKIP_DB_INIT=true)"
else
    ./scripts/init-database.sh
fi

echo "🌟 Starting FastAPI application..."
exec poetry run uvicorn main:app --host 0.0.0.0 --port 8000