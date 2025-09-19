#!/bin/bash

# VitalGo - Production Database Management Script
# Handles migrations, seeding, and data persistence safely
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="/tmp/vitalgo_backups"
DEPLOYMENT_MARKER="vitalgo_deployment_info"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check required environment variables
if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL environment variable is not set"
    echo "Format: postgresql://user:password@host:port/dbname"
    exit 1
fi

print_step "🔍 Analyzing production database state..."

# Test database connection first
print_status "Testing database connection..."
poetry run python -c "
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
import os
import sys

try:
    engine = create_engine(os.environ['DATABASE_URL'])
    with engine.connect() as conn:
        result = conn.execute(text('SELECT version()'))
        version = result.scalar()
        print(f'✅ Connected to: {version}')
except OperationalError as e:
    print(f'❌ Database connection failed: {e}')
    sys.exit(1)
except Exception as e:
    print(f'❌ Unexpected error: {e}')
    sys.exit(1)
"

# Get current database state
DB_STATE=$(poetry run python -c "
from sqlalchemy import create_engine, text
import os
import json

engine = create_engine(os.environ['DATABASE_URL'])
with engine.connect() as conn:
    # Check if this is a fresh database
    tables_result = conn.execute(text(\"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'\"))
    tables_count = tables_result.scalar()

    # Check if alembic version table exists
    alembic_exists = False
    try:
        conn.execute(text('SELECT version_num FROM alembic_version LIMIT 1'))
        alembic_exists = True
    except:
        pass

    # Check production data indicators
    users_count = 0
    patients_count = 0
    document_types_count = 0

    if tables_count > 0:
        try:
            result = conn.execute(text('SELECT COUNT(*) FROM document_types'))
            document_types_count = result.scalar()
        except:
            pass

        try:
            result = conn.execute(text('SELECT COUNT(*) FROM users'))
            users_count = result.scalar()
        except:
            pass

        try:
            result = conn.execute(text('SELECT COUNT(*) FROM patients'))
            patients_count = result.scalar()
        except:
            pass

    state = {
        'tables_count': tables_count,
        'alembic_exists': alembic_exists,
        'users_count': users_count,
        'patients_count': patients_count,
        'document_types_count': document_types_count,
        'is_fresh': tables_count == 0,
        'has_production_data': users_count > 0 or patients_count > 0
    }

    print(json.dumps(state))
")

echo "Database State: $DB_STATE"

# Parse database state
IS_FRESH=$(echo $DB_STATE | python -c "import sys, json; data=json.load(sys.stdin); print('true' if data['is_fresh'] else 'false')")
HAS_PRODUCTION_DATA=$(echo $DB_STATE | python -c "import sys, json; data=json.load(sys.stdin); print('true' if data['has_production_data'] else 'false')")
ALEMBIC_EXISTS=$(echo $DB_STATE | python -c "import sys, json; data=json.load(sys.stdin); print('true' if data['alembic_exists'] else 'false')")
USERS_COUNT=$(echo $DB_STATE | python -c "import sys, json; data=json.load(sys.stdin); print(data['users_count'])")
PATIENTS_COUNT=$(echo $DB_STATE | python -c "import sys, json; data=json.load(sys.stdin); print(data['patients_count'])")
DOC_TYPES_COUNT=$(echo $DB_STATE | python -c "import sys, json; data=json.load(sys.stdin); print(data['document_types_count'])")

print_status "📊 Database Analysis:"
print_status "  - Fresh database: $IS_FRESH"
print_status "  - Has production data: $HAS_PRODUCTION_DATA"
print_status "  - Users: $USERS_COUNT"
print_status "  - Patients: $PATIENTS_COUNT"
print_status "  - Document types: $DOC_TYPES_COUNT"

# Create backup if production data exists
if [ "$HAS_PRODUCTION_DATA" = "true" ]; then
    print_step "🛡️ Creating backup of production data..."
    mkdir -p $BACKUP_DIR

    BACKUP_FILE="$BACKUP_DIR/vitalgo_backup_$(date +%Y%m%d_%H%M%S).sql"

    # Extract connection details for pg_dump
    poetry run python -c "
import os
from urllib.parse import urlparse

url = urlparse(os.environ['DATABASE_URL'])
print(f'PGPASSWORD={url.password} pg_dump -h {url.hostname} -p {url.port} -U {url.username} -d {url.path[1:]} --clean --if-exists --create > $BACKUP_FILE')
" | bash

    print_status "✅ Backup created: $BACKUP_FILE"
else
    print_status "ℹ️ No production data found - skipping backup"
fi

# Run migrations safely
if [ "$IS_FRESH" = "true" ]; then
    print_step "🆕 Fresh database detected - running full setup..."
    poetry run alembic upgrade head
    NEEDS_SEEDING=true
elif [ "$ALEMBIC_EXISTS" = "true" ]; then
    print_step "🔄 Running incremental migrations..."
    # Check current migration version
    CURRENT_VERSION=$(poetry run alembic current)
    print_status "Current migration: $CURRENT_VERSION"

    # Run migrations
    poetry run alembic upgrade head
    NEEDS_SEEDING=false
else
    print_step "🔧 Setting up alembic for existing database..."
    # Stamp current version without running migrations
    poetry run alembic stamp head
    NEEDS_SEEDING=$([ "$DOC_TYPES_COUNT" = "0" ] && echo "true" || echo "false")
fi

# Seed only essential data if needed
if [ "$NEEDS_SEEDING" = "true" ]; then
    print_step "📝 Seeding essential data..."
    poetry run python -c "
from sqlalchemy import create_engine, text
import os

engine = create_engine(os.environ['DATABASE_URL'])

with engine.connect() as conn:
    # Only seed document types if they don't exist
    result = conn.execute(text('SELECT COUNT(*) FROM document_types'))
    count = result.scalar()

    if count == 0:
        print('📝 Seeding document types...')
        conn.execute(text('''
            INSERT INTO document_types (code, name, description, is_active) VALUES
            ('CC', 'Cédula de Ciudadanía', 'Documento de identidad para ciudadanos colombianos mayores de 18 años', true),
            ('CE', 'Cédula de Extranjería', 'Documento de identidad para extranjeros residentes en Colombia', true),
            ('PA', 'Pasaporte', 'Documento de identidad internacional', true),
            ('TI', 'Tarjeta de Identidad', 'Documento de identidad para menores de edad entre 7 y 17 años', true),
            ('RC', 'Registro Civil', 'Documento de identidad para menores de 7 años', true),
            ('AS', 'Adulto sin Identificación', 'Para personas adultas que no poseen documento de identidad', true),
            ('MS', 'Menor sin Identificación', 'Para menores que no poseen documento de identidad', true),
            ('NU', 'Número Único de Identificación Personal', 'NUIP - Nuevo formato de cédula de ciudadanía', true),
            ('CD', 'Carné Diplomático', 'Documento de identidad para personal diplomático', true),
            ('SC', 'Salvoconducto', 'Documento temporal de identificación', true)
        '''))
        conn.commit()
        print('✅ Document types seeded successfully')
    else:
        print(f'ℹ️ Document types already exist ({count} records) - skipping seed')
"
else
    print_status "ℹ️ Production data exists - skipping seeding to preserve data integrity"
fi

# Record deployment info
print_step "📋 Recording deployment information..."
poetry run python -c "
from sqlalchemy import create_engine, text
import os
from datetime import datetime

engine = create_engine(os.environ['DATABASE_URL'])

with engine.connect() as conn:
    # Create deployment tracking table if it doesn't exist
    conn.execute(text('''
        CREATE TABLE IF NOT EXISTS deployment_history (
            id SERIAL PRIMARY KEY,
            deployment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            version VARCHAR(50),
            notes TEXT
        )
    '''))

    # Record this deployment
    conn.execute(text('''
        INSERT INTO deployment_history (version, notes)
        VALUES ('v1.0.0', 'Production deployment with enhanced database management')
    '''))

    conn.commit()
    print('✅ Deployment recorded')
"

# Final verification
print_step "🔍 Final verification..."
FINAL_STATE=$(poetry run python -c "
from sqlalchemy import create_engine, text
import os

engine = create_engine(os.environ['DATABASE_URL'])
with engine.connect() as conn:
    tables = conn.execute(text(\"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'\")).scalar()
    users = conn.execute(text('SELECT COUNT(*) FROM users')).scalar()
    patients = conn.execute(text('SELECT COUNT(*) FROM patients')).scalar()
    doc_types = conn.execute(text('SELECT COUNT(*) FROM document_types')).scalar()

    print(f'📊 Final state:')
    print(f'  - Tables: {tables}')
    print(f'  - Users: {users}')
    print(f'  - Patients: {patients}')
    print(f'  - Document types: {doc_types}')
")

echo "$FINAL_STATE"

print_status "🎉 Database management completed successfully!"
print_status "🔒 Production data is safe and persistent"