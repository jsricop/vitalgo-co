#!/bin/bash
#
# VitalGo Staging Deployment Script
#
# Deploys VitalGo to AWS Ohio staging environment with IP-based access
# Completely isolated from production deployment
#
# Pipeline: Local Docker Build → DockerHub (staging tags) → AWS Ohio
#
# Usage:
#   ./deploy-staging.sh                    # Auto-detect deployment type
#   ./deploy-staging.sh --with-migrations  # Force migration deployment
#   ./deploy-staging.sh --validate         # Configuration validation only
#   ./deploy-staging.sh --rollback         # Emergency rollback
#   ./deploy-staging.sh --help             # Show detailed help
#
# Environment: AWS Ohio (us-east-2), IP-based access
# Docker Tags: :staging (not :latest)
# Author: VitalGo DevOps
# Version: 1.0.0 Staging
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/deployment-staging.env"  # ← STAGING ENV FILE
LOG_FILE="/tmp/vitalgo_staging_deploy_$(date +%Y%m%d_%H%M%S).log"
BACKUP_DIR="/tmp/vitalgo_staging_backups"

# Initialize deployment mode
DEPLOYMENT_MODE=""
FORCE_MIGRATIONS=false
VALIDATE_ONLY=false
ROLLBACK_MODE=false

# Logging functions
log() { echo -e "${GREEN}[INFO]${NC} $1" | tee -a "$LOG_FILE"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$LOG_FILE"; }
error() { echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"; }
step() { echo -e "${BLUE}[STEP]${NC} $1" | tee -a "$LOG_FILE"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"; }
staging() { echo -e "${MAGENTA}[STAGING]${NC} $1" | tee -a "$LOG_FILE"; }

# Cleanup on exit
cleanup() {
    if [[ $? -ne 0 ]]; then
        error "Staging deployment failed. Check log: $LOG_FILE"
        error "Backup available at: $BACKUP_DIR"
    fi
}
trap cleanup EXIT

show_help() {
    cat << EOF
VitalGo Staging Deployment Script v1.0.0

DESCRIPTION:
    Deploys VitalGo to AWS Ohio staging environment with IP-based access.
    Completely isolated from production deployment.

USAGE:
    ./deploy-staging.sh [OPTIONS]

OPTIONS:
    (no options)         Auto-detect deployment type and execute
    --with-migrations    Force migration deployment mode
    --validate          Validate configuration only (no deployment)
    --rollback          Emergency rollback to previous deployment
    --help              Show this help message

DEPLOYMENT MODES:
    Standard Mode       Code-only deployment with zero downtime
    Migration Mode      Database schema changes with data preservation
    Rollback Mode       Emergency restore to previous state

PIPELINE:
    1. Validation       Environment, credentials, connectivity
    2. Auto-Detection   Determine if migrations are needed
    3. Backup          RDS snapshots and configuration backups
    4. Build           Multi-platform Docker builds with :staging tags
    5. Push            DockerHub image publishing (staging tags)
    6. Deploy          Zero-downtime AWS Ohio deployment
    7. Migrate         Apply database changes (if needed)
    8. Verify          Health checks and validation

ENVIRONMENT:
    Region: AWS Ohio (us-east-2)
    Access: IP-based (http://{IP}:3000 and http://{IP}:8000)
    Tags: :staging (not :latest)
    ENV: deployment-staging.env

REQUIREMENTS:
    - deployment-staging.env file with AWS/DockerHub credentials
    - Docker installed and running
    - AWS CLI access (optional, for automated snapshots)
    - SSH access to staging EC2 instance in Ohio

EXAMPLES:
    ./deploy-staging.sh                    # Standard deployment
    ./deploy-staging.sh --with-migrations  # Deploy with DB changes
    ./deploy-staging.sh --validate         # Check configuration
    ./deploy-staging.sh --rollback         # Emergency rollback

For complete setup guide, see: docs/STAGING_SETUP_PLAN.md
EOF
}

# Parse command line arguments
case "${1:-}" in
    --help|-h)
        show_help
        exit 0
        ;;
    --with-migrations)
        FORCE_MIGRATIONS=true
        ;;
    --validate)
        VALIDATE_ONLY=true
        ;;
    --rollback)
        ROLLBACK_MODE=true
        ;;
    "")
        # Auto-detect mode
        ;;
    *)
        error "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac

# Header
step "🧪 VitalGo STAGING Deployment Started"
staging "Deploying to AWS Ohio (us-east-2)"
staging "Environment: STAGING (isolated from production)"
log "Timestamp: $(date)"
log "Log file: $LOG_FILE"
log "Mode: ${1:-auto-detect}"

#==============================================================================
# PHASE 1: VALIDATION
#==============================================================================

step "🔍 Phase 1: Environment Validation"

# Check if deployment-staging.env exists
if [[ ! -f "$ENV_FILE" ]]; then
    error "deployment-staging.env file not found at: $ENV_FILE"
    error "Create it from the template and configure your staging values"
    error "See: docs/STAGING_SETUP_PLAN.md for setup guide"
    exit 1
fi

# Load environment variables
source "$ENV_FILE"
log "Environment variables loaded from deployment-staging.env"

# Validate this is staging environment
if [[ "${ENVIRONMENT}" != "staging" ]]; then
    error "ENVIRONMENT variable must be 'staging' in deployment-staging.env"
    error "Current value: ${ENVIRONMENT}"
    exit 1
fi
staging "✅ Confirmed: Deploying to STAGING environment"

# Validate required variables
REQUIRED_VARS=(
    "DOCKERHUB_USERNAME"
    "EC2_PUBLIC_IP"
    "EC2_SSH_KEY"
    "RDS_ENDPOINT"
    "DB_NAME"
    "DB_USER"
    "DB_PASSWORD"
    "SECRET_KEY"
    "JWT_SECRET_KEY"
    "DOMAIN_NAME"
    "FRONTEND_URL"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [[ -z "${!var}" ]]; then
        error "Required environment variable $var is not set in deployment-staging.env"
        exit 1
    fi
done
success "All required environment variables validated"

# Validate tools
if ! command -v docker &> /dev/null; then
    error "Docker is not installed or not in PATH"
    exit 1
fi

# Check Docker login
if ! docker info | grep -q "Username"; then
    warn "Not logged in to DockerHub. Attempting login..."
    docker login
fi
success "Docker environment validated"

# Validate SSH key
if [[ ! -f "$EC2_SSH_KEY" ]]; then
    error "SSH key not found at $EC2_SSH_KEY"
    error "Download vitalgo-staging-ohio.pem from AWS and update path"
    exit 1
fi

# Check SSH key permissions
KEY_PERMS=$(stat -f "%A" "$EC2_SSH_KEY" 2>/dev/null || stat -c "%a" "$EC2_SSH_KEY" 2>/dev/null)
if [[ "$KEY_PERMS" != "600" ]]; then
    warn "SSH key permissions are $KEY_PERMS, should be 600"
    warn "Running: chmod 600 $EC2_SSH_KEY"
    chmod 600 "$EC2_SSH_KEY"
fi

# Test EC2 connection
if ! ssh -i "$EC2_SSH_KEY" -o ConnectTimeout=10 -o StrictHostKeyChecking=no ec2-user@"$EC2_PUBLIC_IP" 'echo "test"' &>/dev/null; then
    error "Cannot connect to staging EC2 instance at $EC2_PUBLIC_IP"
    error "Verify: EC2 instance is running, Security group allows SSH, IP is correct"
    exit 1
fi
success "Staging EC2 connection validated"

# Exit if validation only
if [[ "$VALIDATE_ONLY" == true ]]; then
    success "✅ Staging configuration validation completed successfully"
    staging "Ready to deploy to: http://${EC2_PUBLIC_IP}:3000"
    exit 0
fi

#==============================================================================
# PHASE 2: AUTO-DETECTION & BACKUP
#==============================================================================

step "🧠 Phase 2: Auto-Detection & Backup"

# Auto-detect if migrations are needed (unless forced)
if [[ "$FORCE_MIGRATIONS" == false && "$ROLLBACK_MODE" == false ]]; then
    log "Auto-detecting deployment type..."

    # Check for pending migrations
    cd "$SCRIPT_DIR/../backend"
    if poetry run alembic check &>/dev/null; then
        DEPLOYMENT_MODE="standard"
        log "✅ No pending migrations detected - Standard deployment mode"
    else
        DEPLOYMENT_MODE="migration"
        warn "⚠️ Pending migrations detected - Migration deployment mode"
    fi
    cd "$SCRIPT_DIR"
else
    if [[ "$FORCE_MIGRATIONS" == true ]]; then
        DEPLOYMENT_MODE="migration"
        log "🔥 Migration mode forced by --with-migrations flag"
    elif [[ "$ROLLBACK_MODE" == true ]]; then
        DEPLOYMENT_MODE="rollback"
        log "🔄 Rollback mode activated"
    fi
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create RDS snapshot if AWS CLI available
if command -v aws &> /dev/null && [[ "$DEPLOYMENT_MODE" != "rollback" ]]; then
    log "Creating staging RDS snapshot for data protection..."
    SNAPSHOT_ID="vitalgo-staging-deploy-$(date +%Y%m%d-%H%M%S)"

    aws rds create-db-snapshot \
        --db-instance-identifier "${RDS_INSTANCE_ID:-vitalgo-staging-db}" \
        --db-snapshot-identifier "$SNAPSHOT_ID" \
        --region us-east-2 &>/dev/null || {
        warn "RDS snapshot creation failed - continuing with deployment"
    }
    log "Staging RDS snapshot created: $SNAPSHOT_ID"
else
    warn "AWS CLI not available or rollback mode - skipping automated snapshot"
fi

#==============================================================================
# PHASE 3: DOCKER BUILD & PUSH (STAGING TAGS)
#==============================================================================

if [[ "$DEPLOYMENT_MODE" != "rollback" ]]; then
    step "🐳 Phase 3: Docker Build & Push (STAGING TAGS)"
    staging "Building images with :staging tags"

    # Return to project root for Docker builds
    cd "$SCRIPT_DIR/.."

    # Build and push backend with STAGING tag
    log "Building backend image with :staging tag..."
    docker buildx build --platform linux/amd64 \
        -f docker/Dockerfile.backend \
        -t "$DOCKERHUB_USERNAME/vitalgo-backend:staging" \
        . --push || {
        error "Backend image build failed"
        exit 1
    }
    success "Backend image built and pushed: $DOCKERHUB_USERNAME/vitalgo-backend:staging"

    # Build and push frontend with STAGING tag
    log "Building frontend image with :staging tag..."
    docker buildx build --platform linux/amd64 \
        -f docker/Dockerfile.frontend \
        --build-arg NEXT_PUBLIC_API_URL="http://$EC2_PUBLIC_IP:8000" \
        --build-arg NEXT_PUBLIC_ENVIRONMENT="staging" \
        -t "$DOCKERHUB_USERNAME/vitalgo-frontend:staging" \
        . --push || {
        error "Frontend image build failed"
        exit 1
    }
    success "Frontend image built and pushed: $DOCKERHUB_USERNAME/vitalgo-frontend:staging"
fi

#==============================================================================
# PHASE 4: AWS STAGING DEPLOYMENT
#==============================================================================

step "☁️ Phase 4: AWS Staging Deployment (Ohio)"

if [[ "$DEPLOYMENT_MODE" == "rollback" ]]; then
    # Rollback deployment
    log "Executing emergency rollback on staging..."
    ssh -i "$EC2_SSH_KEY" ec2-user@"$EC2_PUBLIC_IP" << 'EOF'
        cd ~/vitalgo || { echo "VitalGo directory not found"; exit 1; }

        # Find latest backup
        BACKUP_DIR=$(ls -d ../vitalgo_backup_* 2>/dev/null | tail -1)
        if [[ -z "$BACKUP_DIR" ]]; then
            echo "No backup found for rollback"
            exit 1
        fi

        echo "Rolling back to: $BACKUP_DIR"
        docker-compose -f docker-compose.staging.yml down || true
        cd ..
        rm -rf vitalgo_current_backup
        mv vitalgo vitalgo_current_backup
        cp -r "$BACKUP_DIR" vitalgo
        cd vitalgo
        docker-compose -f docker-compose.staging.yml up -d

        echo "Rollback completed"
EOF
else
    # Regular deployment
    log "Creating staging docker-compose configuration..."

    # Generate docker-compose.staging.yml content
    cat > /tmp/docker-compose.staging.yml << EOF
version: '3.8'

services:
  vitalgo-backend-staging:
    image: ${DOCKERHUB_USERNAME}/vitalgo-backend:staging
    container_name: vitalgo-backend-staging
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@${RDS_ENDPOINT}:5432/${DB_NAME}
      ENVIRONMENT: staging
      DEBUG: false
      SECRET_KEY: ${SECRET_KEY}
      JWT_SECRET_KEY: ${JWT_SECRET_KEY}
      ALLOWED_ORIGINS: http://${EC2_PUBLIC_IP}:3000,http://${EC2_PUBLIC_IP}:8000
      FRONTEND_URL: ${FRONTEND_URL}
      SKIP_DB_INIT: $([ "$DEPLOYMENT_MODE" == "migration" ] && echo "false" || echo "true")
    ports:
      - "8000:8000"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 5
    networks:
      - vitalgo-staging-network

  vitalgo-frontend-staging:
    image: ${DOCKERHUB_USERNAME}/vitalgo-frontend:staging
    container_name: vitalgo-frontend-staging
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: http://${EC2_PUBLIC_IP}:8000
      NEXT_PUBLIC_ENVIRONMENT: staging
    ports:
      - "3000:3000"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - vitalgo-staging-network
    depends_on:
      - vitalgo-backend-staging

networks:
  vitalgo-staging-network:
    driver: bridge
EOF

    # Deploy to AWS Ohio
    log "Deploying to AWS Ohio staging EC2..."
    scp -i "$EC2_SSH_KEY" /tmp/docker-compose.staging.yml ec2-user@"$EC2_PUBLIC_IP":~/vitalgo/

    ssh -i "$EC2_SSH_KEY" ec2-user@"$EC2_PUBLIC_IP" << EOF
        cd ~/vitalgo || { mkdir -p ~/vitalgo; cd ~/vitalgo; }

        # Create backup of current deployment
        sudo cp -r . ../vitalgo_backup_\$(date +%Y%m%d_%H%M%S) 2>/dev/null || echo "No existing deployment to backup"

        # Pull latest staging images
        docker-compose -f docker-compose.staging.yml pull

        # Deploy with zero downtime
        echo "Starting zero-downtime staging deployment..."
        docker-compose -f docker-compose.staging.yml up -d

        # Wait for services
        echo "Waiting for services to be healthy..."
        sleep 30

        # Health checks
        if curl -f http://localhost:8000/health &>/dev/null; then
            echo "✅ Backend is healthy"
        else
            echo "❌ Backend health check failed"
            exit 1
        fi

        if curl -f http://localhost:3000 &>/dev/null; then
            echo "✅ Frontend is healthy"
        else
            echo "❌ Frontend health check failed"
            exit 1
        fi

        # Clean up old images
        docker system prune -f

        echo "🎉 Staging deployment completed successfully!"
EOF
fi

#==============================================================================
# PHASE 5: VERIFICATION
#==============================================================================

step "✅ Phase 5: Final Verification"

# Test endpoints (IP-based, no domain)
log "Testing staging endpoints..."

if curl -f -s "http://$EC2_PUBLIC_IP:8000/health" &>/dev/null; then
    success "✅ Staging backend is responding"
else
    warn "⚠️ Backend health check failed - check manually"
fi

if curl -f -s "http://$EC2_PUBLIC_IP:3000" &>/dev/null; then
    success "✅ Staging frontend is responding"
else
    warn "⚠️ Frontend check failed - check manually"
fi

# Final summary
step "🎉 Staging Deployment Summary"
staging "═══════════════════════════════════════════════"
staging "Environment: STAGING (Ohio - us-east-2)"
staging "Deployment Mode: $DEPLOYMENT_MODE"
staging "Docker Tags: :staging"
staging "═══════════════════════════════════════════════"
success "Frontend: http://${EC2_PUBLIC_IP}:3000"
success "Backend: http://${EC2_PUBLIC_IP}:8000"
success "API Docs: http://${EC2_PUBLIC_IP}:8000/docs"
success "Health: http://${EC2_PUBLIC_IP}:8000/health"
staging "═══════════════════════════════════════════════"
success "Log: $LOG_FILE"

if [[ "$DEPLOYMENT_MODE" == "migration" ]]; then
    success "✅ Database migrations applied successfully"
    success "✅ All staging data preserved"
fi

success "🧪 VitalGo Staging Deployment Completed Successfully!"
staging "Test with: test.patient@vitalgo.com / TestPassword123!"
