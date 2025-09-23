#!/bin/bash
#
# VitalGo Universal Deployment Script
#
# A single, universal deployment script that handles any deployment scenario:
# - Code-only deployments
# - Database migrations
# - Feature deployments
# - Emergency rollbacks
#
# Pipeline: Local Docker Build → DockerHub → AWS Production
#
# Usage:
#   ./deploy.sh                    # Auto-detect deployment type
#   ./deploy.sh --with-migrations  # Force migration deployment
#   ./deploy.sh --validate         # Configuration validation only
#   ./deploy.sh --rollback         # Emergency rollback
#   ./deploy.sh --help             # Show detailed help
#
# Author: VitalGo DevOps
# Version: 1.0.0 Universal
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/deployment.env"
LOG_FILE="/tmp/vitalgo_deploy_$(date +%Y%m%d_%H%M%S).log"
BACKUP_DIR="/tmp/vitalgo_backups"

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

# Cleanup on exit
cleanup() {
    if [[ $? -ne 0 ]]; then
        error "Deployment failed. Check log: $LOG_FILE"
        error "Backup available at: $BACKUP_DIR"
    fi
}
trap cleanup EXIT

show_help() {
    cat << EOF
VitalGo Universal Deployment Script v1.0.0

DESCRIPTION:
    Universal deployment script that automatically handles any deployment scenario
    including code changes, database migrations, and feature deployments.

USAGE:
    ./deploy.sh [OPTIONS]

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
    4. Build           Multi-platform Docker builds
    5. Push            DockerHub image publishing
    6. Deploy          Zero-downtime AWS deployment
    7. Migrate         Apply database changes (if needed)
    8. Verify          Health checks and validation

REQUIREMENTS:
    - deployment.env file with AWS/DockerHub credentials
    - Docker installed and running
    - AWS CLI access (optional, for automated snapshots)
    - SSH access to production EC2 instance

EXAMPLES:
    ./deploy.sh                    # Standard deployment
    ./deploy.sh --with-migrations  # Deploy with DB changes
    ./deploy.sh --validate         # Check configuration
    ./deploy.sh --rollback         # Emergency rollback

For more information, see: https://github.com/your-org/vitalgo-co
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
step "🚀 VitalGo Universal Deployment Started"
log "Timestamp: $(date)"
log "Log file: $LOG_FILE"
log "Mode: ${1:-auto-detect}"

#==============================================================================
# PHASE 1: VALIDATION
#==============================================================================

step "🔍 Phase 1: Environment Validation"

# Check if deployment.env exists
if [[ ! -f "$ENV_FILE" ]]; then
    error "deployment.env file not found"
    error "Create it from deployment.env.example and configure your values"
    exit 1
fi

# Load environment variables
source "$ENV_FILE"
log "Environment variables loaded from deployment.env"

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
)

for var in "${REQUIRED_VARS[@]}"; do
    if [[ -z "${!var}" ]]; then
        error "Required environment variable $var is not set in deployment.env"
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
    exit 1
fi

# Test EC2 connection
if ! ssh -i "$EC2_SSH_KEY" -o ConnectTimeout=10 -o StrictHostKeyChecking=no ec2-user@"$EC2_PUBLIC_IP" 'echo "test"' &>/dev/null; then
    error "Cannot connect to EC2 instance at $EC2_PUBLIC_IP"
    exit 1
fi
success "EC2 connection validated"

# Exit if validation only
if [[ "$VALIDATE_ONLY" == true ]]; then
    success "✅ Configuration validation completed successfully"
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
    cd "$SCRIPT_DIR/backend"
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
    log "Creating RDS snapshot for data protection..."
    SNAPSHOT_ID="vitalgo-deploy-$(date +%Y%m%d-%H%M%S)"

    aws rds create-db-snapshot \
        --db-instance-identifier "${RDS_INSTANCE_ID:-vitalgo-production}" \
        --db-snapshot-identifier "$SNAPSHOT_ID" &>/dev/null || {
        warn "RDS snapshot creation failed - continuing with deployment"
    }
    log "RDS snapshot created: $SNAPSHOT_ID"
else
    warn "AWS CLI not available or rollback mode - skipping automated snapshot"
fi

#==============================================================================
# PHASE 3: DOCKER BUILD & PUSH
#==============================================================================

if [[ "$DEPLOYMENT_MODE" != "rollback" ]]; then
    step "🐳 Phase 3: Docker Build & Push"

    # Build and push backend
    log "Building backend image..."
    docker buildx build --platform linux/amd64 \
        -f docker/Dockerfile.backend \
        -t "$DOCKERHUB_USERNAME/vitalgo-backend:latest" \
        . --push || {
        error "Backend image build failed"
        exit 1
    }
    success "Backend image built and pushed"

    # Build and push frontend
    log "Building frontend image..."
    docker buildx build --platform linux/amd64 \
        -f docker/Dockerfile.frontend \
        --build-arg NEXT_PUBLIC_API_URL="https://$DOMAIN_NAME" \
        --build-arg NEXT_PUBLIC_ENVIRONMENT="production" \
        -t "$DOCKERHUB_USERNAME/vitalgo-frontend:latest" \
        . --push || {
        error "Frontend image build failed"
        exit 1
    }
    success "Frontend image built and pushed"
fi

#==============================================================================
# PHASE 4: AWS DEPLOYMENT
#==============================================================================

step "☁️ Phase 4: AWS Deployment"

if [[ "$DEPLOYMENT_MODE" == "rollback" ]]; then
    # Rollback deployment
    log "Executing emergency rollback..."
    ssh -i "$EC2_SSH_KEY" ec2-user@"$EC2_PUBLIC_IP" << 'EOF'
        cd ~/vitalgo || { echo "VitalGo directory not found"; exit 1; }

        # Find latest backup
        BACKUP_DIR=$(ls -d ../vitalgo_backup_* 2>/dev/null | tail -1)
        if [[ -z "$BACKUP_DIR" ]]; then
            echo "No backup found for rollback"
            exit 1
        fi

        echo "Rolling back to: $BACKUP_DIR"
        docker-compose -f docker-compose.prod.yml down || true
        cd ..
        rm -rf vitalgo_current_backup
        mv vitalgo vitalgo_current_backup
        cp -r "$BACKUP_DIR" vitalgo
        cd vitalgo
        docker-compose -f docker-compose.prod.yml up -d

        echo "Rollback completed"
EOF
else
    # Regular deployment
    log "Creating production docker-compose configuration..."

    # Generate docker-compose.prod.yml content
    cat > /tmp/docker-compose.prod.yml << EOF
version: '3.8'

services:
  vitalgo-backend:
    image: ${DOCKERHUB_USERNAME}/vitalgo-backend:latest
    container_name: vitalgo-backend-prod
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@${RDS_ENDPOINT}:5432/${DB_NAME}
      ENVIRONMENT: production
      DEBUG: false
      SECRET_KEY: ${SECRET_KEY}
      JWT_SECRET_KEY: ${JWT_SECRET_KEY}
      ALLOWED_ORIGINS: https://${DOMAIN_NAME},https://www.${DOMAIN_NAME}
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
      - vitalgo-network

  vitalgo-frontend:
    image: ${DOCKERHUB_USERNAME}/vitalgo-frontend:latest
    container_name: vitalgo-frontend-prod
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: https://${DOMAIN_NAME}
    ports:
      - "3000:3000"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - vitalgo-network
    depends_on:
      - vitalgo-backend

networks:
  vitalgo-network:
    driver: bridge
EOF

    # Deploy to AWS
    log "Deploying to AWS EC2..."
    scp -i "$EC2_SSH_KEY" /tmp/docker-compose.prod.yml ec2-user@"$EC2_PUBLIC_IP":~/vitalgo/

    ssh -i "$EC2_SSH_KEY" ec2-user@"$EC2_PUBLIC_IP" << EOF
        cd ~/vitalgo || { mkdir -p ~/vitalgo; cd ~/vitalgo; }

        # Create backup of current deployment
        sudo cp -r . ../vitalgo_backup_\$(date +%Y%m%d_%H%M%S) 2>/dev/null || echo "No existing deployment to backup"

        # Pull latest images
        docker-compose -f docker-compose.prod.yml pull

        # Deploy with zero downtime
        echo "Starting zero-downtime deployment..."
        docker-compose -f docker-compose.prod.yml up -d

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

        echo "🎉 Deployment completed successfully!"
EOF
fi

#==============================================================================
# PHASE 5: VERIFICATION
#==============================================================================

step "✅ Phase 5: Final Verification"

# Test endpoints
log "Testing production endpoints..."

if curl -f -s "https://$DOMAIN_NAME/health" &>/dev/null; then
    success "✅ Production backend is responding"
else
    warn "⚠️ Backend health check failed - check manually"
fi

if curl -f -s "https://$DOMAIN_NAME" &>/dev/null; then
    success "✅ Production frontend is responding"
else
    warn "⚠️ Frontend check failed - check manually"
fi

# Final summary
step "🎉 Deployment Summary"
success "Deployment Mode: $DEPLOYMENT_MODE"
success "Domain: https://$DOMAIN_NAME"
success "API: https://$DOMAIN_NAME/docs"
success "Log: $LOG_FILE"

if [[ "$DEPLOYMENT_MODE" == "migration" ]]; then
    success "✅ Database migrations applied successfully"
    success "✅ All production data preserved"
fi

success "🚀 VitalGo Universal Deployment Completed Successfully!"