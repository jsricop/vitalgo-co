#!/bin/bash
#
# VitalGo Staging Infrastructure Setup Script
#
# Creates complete staging environment in AWS Ohio (us-east-2)
# This script is SAFE - it only creates NEW resources, never touches production
#
# Prerequisites:
#   - AWS CLI v2 installed
#   - AWS credentials configured (aws configure)
#   - Permissions: EC2, RDS, VPC creation
#
# Usage:
#   ./scripts/create-staging-infrastructure.sh
#
# Author: VitalGo DevOps
# Version: 1.0.0
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
step() { echo -e "${BLUE}[STEP]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
staging() { echo -e "${MAGENTA}[STAGING]${NC} $1"; }
value() { echo -e "${CYAN}[VALUE]${NC} $1"; }

# Configuration
REGION="us-east-2"  # Ohio
PROJECT_NAME="vitalgo"
ENV_NAME="staging"
RESOURCE_PREFIX="${PROJECT_NAME}-${ENV_NAME}"

# Output file for environment variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_FILE="$SCRIPT_DIR/staging-infrastructure-output.txt"
ENV_FILE="$SCRIPT_DIR/deployment-staging.env"

# Header
echo ""
echo "═══════════════════════════════════════════════════════════════"
staging "VitalGo Staging Infrastructure Setup"
staging "AWS Region: $REGION (Ohio)"
staging "This script creates NEW resources only - Production is safe"
echo "═══════════════════════════════════════════════════════════════"
echo ""

#==============================================================================
# PHASE 1: VALIDATION
#==============================================================================

step "🔍 Phase 1: Validating Prerequisites"

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    error "AWS CLI is not installed"
    error "Install from: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

AWS_VERSION=$(aws --version 2>&1)
log "AWS CLI installed: $AWS_VERSION"

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    error "AWS credentials not configured"
    error "Run: aws configure"
    error "You'll need:"
    error "  - AWS Access Key ID"
    error "  - AWS Secret Access Key"
    error "  - Default region: us-east-2"
    exit 1
fi

CALLER_IDENTITY=$(aws sts get-caller-identity --region $REGION)
ACCOUNT_ID=$(echo $CALLER_IDENTITY | jq -r '.Account')
USER_ARN=$(echo $CALLER_IDENTITY | jq -r '.Arn')

success "AWS credentials validated"
log "Account ID: $ACCOUNT_ID"
log "User: $USER_ARN"

# Confirm with user
echo ""
warn "⚠️  This script will create the following resources in AWS Ohio:"
echo "  - EC2 Key Pair (vitalgo-staging-ohio)"
echo "  - EC2 Security Group (vitalgo-staging-sg)"
echo "  - EC2 t3.small Instance (vitalgo-staging)"
echo "  - Elastic IP"
echo "  - RDS Security Group (vitalgo-staging-db-sg)"
echo "  - RDS db.t3.micro Instance (vitalgo-staging-db)"
echo ""
echo "  Estimated monthly cost: ~\$33/month (or ~\$10/month with stop/start)"
echo ""
read -p "Continue? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
    log "Setup cancelled by user"
    exit 0
fi

echo ""

#==============================================================================
# PHASE 2: CREATE EC2 KEY PAIR
#==============================================================================

step "🔑 Phase 2: Creating EC2 Key Pair"

KEY_NAME="${RESOURCE_PREFIX}-ohio"
KEY_FILE="$HOME/.ssh/${KEY_NAME}.pem"

# Check if key already exists
if aws ec2 describe-key-pairs --region $REGION --key-names $KEY_NAME &> /dev/null; then
    warn "Key pair '$KEY_NAME' already exists in AWS"
    if [[ -f "$KEY_FILE" ]]; then
        log "Local key file exists at: $KEY_FILE"
    else
        error "Key exists in AWS but not found locally at: $KEY_FILE"
        error "Either:"
        error "  1. Delete the key in AWS Console and re-run this script"
        error "  2. Download the key from your backups to $KEY_FILE"
        exit 1
    fi
else
    log "Creating key pair: $KEY_NAME"

    # Create key pair and save to file
    aws ec2 create-key-pair \
        --region $REGION \
        --key-name $KEY_NAME \
        --query 'KeyMaterial' \
        --output text > "$KEY_FILE"

    # Set correct permissions
    chmod 600 "$KEY_FILE"

    success "Key pair created: $KEY_FILE"
fi

EC2_SSH_KEY="$KEY_FILE"

#==============================================================================
# PHASE 3: CREATE SECURITY GROUPS
#==============================================================================

step "🛡️  Phase 3: Creating Security Groups"

# Get default VPC
DEFAULT_VPC=$(aws ec2 describe-vpcs \
    --region $REGION \
    --filters "Name=isDefault,Values=true" \
    --query 'Vpcs[0].VpcId' \
    --output text)

if [[ "$DEFAULT_VPC" == "None" ]]; then
    error "No default VPC found in region $REGION"
    error "Create a VPC first or specify a custom VPC"
    exit 1
fi

log "Using VPC: $DEFAULT_VPC"

# Create EC2 Security Group
EC2_SG_NAME="${RESOURCE_PREFIX}-sg"

# Check if exists
EXISTING_EC2_SG=$(aws ec2 describe-security-groups \
    --region $REGION \
    --filters "Name=group-name,Values=$EC2_SG_NAME" \
    --query 'SecurityGroups[0].GroupId' \
    --output text 2>/dev/null || echo "None")

if [[ "$EXISTING_EC2_SG" != "None" ]]; then
    warn "EC2 security group already exists: $EXISTING_EC2_SG"
    EC2_SG_ID="$EXISTING_EC2_SG"
else
    log "Creating EC2 security group: $EC2_SG_NAME"

    EC2_SG_ID=$(aws ec2 create-security-group \
        --region $REGION \
        --group-name $EC2_SG_NAME \
        --description "Security group for VitalGo staging EC2 instance" \
        --vpc-id $DEFAULT_VPC \
        --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=$EC2_SG_NAME},{Key=Environment,Value=staging},{Key=Project,Value=VitalGo}]" \
        --query 'GroupId' \
        --output text)

    success "EC2 security group created: $EC2_SG_ID"

    # Get current public IP for SSH access
    MY_IP=$(curl -s https://checkip.amazonaws.com)
    log "Your public IP: $MY_IP"

    # Add inbound rules
    log "Adding inbound rules to EC2 security group..."

    # SSH from your IP only
    aws ec2 authorize-security-group-ingress \
        --region $REGION \
        --group-id $EC2_SG_ID \
        --protocol tcp \
        --port 22 \
        --cidr "${MY_IP}/32" \
        --group-rule-description "SSH access from my IP" || warn "SSH rule may already exist"

    # Frontend (3000) from anywhere
    aws ec2 authorize-security-group-ingress \
        --region $REGION \
        --group-id $EC2_SG_ID \
        --protocol tcp \
        --port 3000 \
        --cidr "0.0.0.0/0" \
        --group-rule-description "Frontend access" || warn "Port 3000 rule may already exist"

    # Backend (8000) from anywhere
    aws ec2 authorize-security-group-ingress \
        --region $REGION \
        --group-id $EC2_SG_ID \
        --protocol tcp \
        --port 8000 \
        --cidr "0.0.0.0/0" \
        --group-rule-description "Backend API access" || warn "Port 8000 rule may already exist"

    # HTTP (80) from anywhere (optional)
    aws ec2 authorize-security-group-ingress \
        --region $REGION \
        --group-id $EC2_SG_ID \
        --protocol tcp \
        --port 80 \
        --cidr "0.0.0.0/0" \
        --group-rule-description "HTTP access" || warn "Port 80 rule may already exist"

    success "Inbound rules configured"
fi

# Create RDS Security Group
RDS_SG_NAME="${RESOURCE_PREFIX}-db-sg"

EXISTING_RDS_SG=$(aws ec2 describe-security-groups \
    --region $REGION \
    --filters "Name=group-name,Values=$RDS_SG_NAME" \
    --query 'SecurityGroups[0].GroupId' \
    --output text 2>/dev/null || echo "None")

if [[ "$EXISTING_RDS_SG" != "None" ]]; then
    warn "RDS security group already exists: $EXISTING_RDS_SG"
    RDS_SG_ID="$EXISTING_RDS_SG"
else
    log "Creating RDS security group: $RDS_SG_NAME"

    RDS_SG_ID=$(aws ec2 create-security-group \
        --region $REGION \
        --group-name $RDS_SG_NAME \
        --description "Security group for VitalGo staging RDS instance" \
        --vpc-id $DEFAULT_VPC \
        --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=$RDS_SG_NAME},{Key=Environment,Value=staging},{Key=Project,Value=VitalGo}]" \
        --query 'GroupId' \
        --output text)

    success "RDS security group created: $RDS_SG_ID"

    # Allow PostgreSQL from EC2 security group only
    log "Adding PostgreSQL access from EC2..."
    aws ec2 authorize-security-group-ingress \
        --region $REGION \
        --group-id $RDS_SG_ID \
        --protocol tcp \
        --port 5432 \
        --source-group $EC2_SG_ID \
        --group-rule-description "PostgreSQL from staging EC2" || warn "PostgreSQL rule may already exist"

    success "RDS security group configured"
fi

#==============================================================================
# PHASE 4: CREATE EC2 INSTANCE
#==============================================================================

step "💻 Phase 4: Creating EC2 Instance"

INSTANCE_NAME="${RESOURCE_PREFIX}"

# Check if instance already exists
EXISTING_INSTANCE=$(aws ec2 describe-instances \
    --region $REGION \
    --filters "Name=tag:Name,Values=$INSTANCE_NAME" "Name=instance-state-name,Values=running,stopped,pending" \
    --query 'Reservations[0].Instances[0].InstanceId' \
    --output text 2>/dev/null || echo "None")

if [[ "$EXISTING_INSTANCE" != "None" ]]; then
    warn "EC2 instance already exists: $EXISTING_INSTANCE"
    INSTANCE_ID="$EXISTING_INSTANCE"

    # Get instance details
    INSTANCE_STATE=$(aws ec2 describe-instances \
        --region $REGION \
        --instance-ids $INSTANCE_ID \
        --query 'Reservations[0].Instances[0].State.Name' \
        --output text)

    log "Instance state: $INSTANCE_STATE"
else
    log "Creating EC2 instance: $INSTANCE_NAME (t3.small)"

    # Get latest Amazon Linux 2023 AMI
    AMI_ID=$(aws ec2 describe-images \
        --region $REGION \
        --owners amazon \
        --filters "Name=name,Values=al2023-ami-2023*-x86_64" "Name=state,Values=available" \
        --query 'sort_by(Images, &CreationDate)[-1].ImageId' \
        --output text)

    log "Using AMI: $AMI_ID (Amazon Linux 2023)"

    # Create instance
    INSTANCE_ID=$(aws ec2 run-instances \
        --region $REGION \
        --image-id $AMI_ID \
        --instance-type t3.small \
        --key-name $KEY_NAME \
        --security-group-ids $EC2_SG_ID \
        --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$INSTANCE_NAME},{Key=Environment,Value=staging},{Key=Project,Value=VitalGo}]" \
        --block-device-mappings '[{"DeviceName":"/dev/xvda","Ebs":{"VolumeSize":20,"VolumeType":"gp3","DeleteOnTermination":true}}]' \
        --query 'Instances[0].InstanceId' \
        --output text)

    success "EC2 instance created: $INSTANCE_ID"

    log "Waiting for instance to be running..."
    aws ec2 wait instance-running --region $REGION --instance-ids $INSTANCE_ID
    success "Instance is now running"
fi

#==============================================================================
# PHASE 5: CREATE AND ASSOCIATE ELASTIC IP
#==============================================================================

step "🌐 Phase 5: Creating Elastic IP"

# Check if Elastic IP already associated
EXISTING_EIP=$(aws ec2 describe-addresses \
    --region $REGION \
    --filters "Name=instance-id,Values=$INSTANCE_ID" \
    --query 'Addresses[0].PublicIp' \
    --output text 2>/dev/null || echo "None")

if [[ "$EXISTING_EIP" != "None" ]]; then
    warn "Elastic IP already associated: $EXISTING_EIP"
    ELASTIC_IP="$EXISTING_EIP"
else
    # Check for unassociated Elastic IP with staging tag
    UNASSOCIATED_EIP=$(aws ec2 describe-addresses \
        --region $REGION \
        --filters "Name=tag:Name,Values=${RESOURCE_PREFIX}-eip" "Name=domain,Values=vpc" \
        --query 'Addresses[?AssociationId==null] | [0].AllocationId' \
        --output text 2>/dev/null || echo "None")

    if [[ "$UNASSOCIATED_EIP" != "None" ]]; then
        log "Found existing unassociated Elastic IP, will use it"
        ALLOCATION_ID="$UNASSOCIATED_EIP"
    else
        log "Allocating new Elastic IP..."
        ALLOCATION_ID=$(aws ec2 allocate-address \
            --region $REGION \
            --domain vpc \
            --tag-specifications "ResourceType=elastic-ip,Tags=[{Key=Name,Value=${RESOURCE_PREFIX}-eip},{Key=Environment,Value=staging},{Key=Project,Value=VitalGo}]" \
            --query 'AllocationId' \
            --output text)

        success "Elastic IP allocated: $ALLOCATION_ID"
    fi

    log "Associating Elastic IP with instance..."
    aws ec2 associate-address \
        --region $REGION \
        --instance-id $INSTANCE_ID \
        --allocation-id $ALLOCATION_ID

    ELASTIC_IP=$(aws ec2 describe-addresses \
        --region $REGION \
        --allocation-ids $ALLOCATION_ID \
        --query 'Addresses[0].PublicIp' \
        --output text)

    success "Elastic IP associated: $ELASTIC_IP"
fi

EC2_PUBLIC_IP="$ELASTIC_IP"

#==============================================================================
# PHASE 6: CREATE RDS INSTANCE
#==============================================================================

step "🗄️  Phase 6: Creating RDS PostgreSQL Instance"

DB_INSTANCE_ID="${RESOURCE_PREFIX}-db"
DB_NAME="vitalgo_staging"
DB_USERNAME="vitalgo_staging_user"

# Check if RDS instance already exists
EXISTING_RDS=$(aws rds describe-db-instances \
    --region $REGION \
    --db-instance-identifier $DB_INSTANCE_ID \
    --query 'DBInstances[0].DBInstanceIdentifier' \
    --output text 2>/dev/null || echo "None")

if [[ "$EXISTING_RDS" != "None" ]]; then
    warn "RDS instance already exists: $DB_INSTANCE_ID"

    RDS_STATUS=$(aws rds describe-db-instances \
        --region $REGION \
        --db-instance-identifier $DB_INSTANCE_ID \
        --query 'DBInstances[0].DBInstanceStatus' \
        --output text)

    log "RDS instance status: $RDS_STATUS"

    RDS_ENDPOINT=$(aws rds describe-db-instances \
        --region $REGION \
        --db-instance-identifier $DB_INSTANCE_ID \
        --query 'DBInstances[0].Endpoint.Address' \
        --output text)

    if [[ "$RDS_ENDPOINT" == "None" ]]; then
        log "Waiting for RDS endpoint to be available..."
        aws rds wait db-instance-available --region $REGION --db-instance-identifier $DB_INSTANCE_ID

        RDS_ENDPOINT=$(aws rds describe-db-instances \
            --region $REGION \
            --db-instance-identifier $DB_INSTANCE_ID \
            --query 'DBInstances[0].Endpoint.Address' \
            --output text)
    fi

    warn "⚠️  Using existing RDS instance - password not generated"
    warn "    If you don't have the password, you'll need to reset it in AWS Console"
    DB_PASSWORD="<existing-password-check-your-notes>"
else
    log "Creating RDS instance: $DB_INSTANCE_ID (db.t3.micro)"

    # Generate secure password
    DB_PASSWORD=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-20)
    log "Generated database password (save this!): $DB_PASSWORD"

    # Create RDS instance
    aws rds create-db-instance \
        --region $REGION \
        --db-instance-identifier $DB_INSTANCE_ID \
        --db-instance-class db.t3.micro \
        --engine postgres \
        --engine-version 15.8 \
        --master-username $DB_USERNAME \
        --master-user-password "$DB_PASSWORD" \
        --allocated-storage 20 \
        --storage-type gp3 \
        --vpc-security-group-ids $RDS_SG_ID \
        --db-name $DB_NAME \
        --backup-retention-period 7 \
        --no-multi-az \
        --publicly-accessible false \
        --tags "Key=Name,Value=$DB_INSTANCE_ID" "Key=Environment,Value=staging" "Key=Project,Value=VitalGo" \
        --no-auto-minor-version-upgrade

    success "RDS instance creation initiated: $DB_INSTANCE_ID"

    log "⏳ Waiting for RDS instance to be available (this takes 5-10 minutes)..."
    aws rds wait db-instance-available --region $REGION --db-instance-identifier $DB_INSTANCE_ID

    success "RDS instance is now available"

    # Get endpoint
    RDS_ENDPOINT=$(aws rds describe-db-instances \
        --region $REGION \
        --db-instance-identifier $DB_INSTANCE_ID \
        --query 'DBInstances[0].Endpoint.Address' \
        --output text)

    success "RDS endpoint: $RDS_ENDPOINT"
fi

#==============================================================================
# PHASE 7: GENERATE SECRETS
#==============================================================================

step "🔐 Phase 7: Generating Application Secrets"

SECRET_KEY=$(openssl rand -base64 32)
JWT_SECRET_KEY=$(openssl rand -base64 32)

success "Application secrets generated"

#==============================================================================
# PHASE 8: OUTPUT CONFIGURATION
#==============================================================================

step "📝 Phase 8: Generating Configuration"

# Save all values to output file
cat > "$OUTPUT_FILE" << EOF
═══════════════════════════════════════════════════════════════
VitalGo Staging Infrastructure - Configuration Values
Created: $(date)
Region: $REGION (Ohio)
═══════════════════════════════════════════════════════════════

AWS RESOURCES CREATED:
----------------------
EC2 Instance ID:       $INSTANCE_ID
EC2 Public IP:         $EC2_PUBLIC_IP
EC2 Key Pair:          $KEY_NAME
EC2 Key File:          $EC2_SSH_KEY
EC2 Security Group:    $EC2_SG_ID
RDS Instance ID:       $DB_INSTANCE_ID
RDS Endpoint:          $RDS_ENDPOINT
RDS Security Group:    $RDS_SG_ID

DATABASE CONFIGURATION:
-----------------------
DB Name:               $DB_NAME
DB Username:           $DB_USERNAME
DB Password:           $DB_PASSWORD

APPLICATION SECRETS (STAGING ONLY - NEVER USE IN PRODUCTION):
--------------------------------------------------------------
SECRET_KEY:            $SECRET_KEY
JWT_SECRET_KEY:        $JWT_SECRET_KEY

ACCESS INFORMATION:
-------------------
SSH Command:           ssh -i $EC2_SSH_KEY ec2-user@$EC2_PUBLIC_IP
Frontend URL:          http://$EC2_PUBLIC_IP:3000
Backend URL:           http://$EC2_PUBLIC_IP:8000
API Docs:              http://$EC2_PUBLIC_IP:8000/docs
Health Check:          http://$EC2_PUBLIC_IP:8000/health

DEPLOYMENT FILE VALUES (deployment-staging.env):
------------------------------------------------
DOCKERHUB_USERNAME=your-dockerhub-username
EC2_PUBLIC_IP=$EC2_PUBLIC_IP
EC2_SSH_KEY=$EC2_SSH_KEY
DOMAIN_NAME=$EC2_PUBLIC_IP
RDS_INSTANCE_ID=$DB_INSTANCE_ID
RDS_ENDPOINT=$RDS_ENDPOINT
DB_NAME=$DB_NAME
DB_USER=$DB_USERNAME
DB_PASSWORD=$DB_PASSWORD
SECRET_KEY=$SECRET_KEY
JWT_SECRET_KEY=$JWT_SECRET_KEY
FRONTEND_URL=http://$EC2_PUBLIC_IP:3000
ENVIRONMENT=staging

═══════════════════════════════════════════════════════════════
NEXT STEPS:
═══════════════════════════════════════════════════════════════

1. SSH into EC2 and install Docker:
   ssh -i $EC2_SSH_KEY ec2-user@$EC2_PUBLIC_IP
   sudo yum update -y
   sudo yum install docker -y
   sudo systemctl start docker
   sudo usermod -a -G docker ec2-user
   # Install Docker Compose (see docs/STAGING_SETUP_PLAN.md)

2. Update deployment-staging.env:
   This script can do it automatically (see below)

3. Deploy to staging:
   ./scripts/deploy-staging.sh --with-migrations

4. Initialize test data:
   ./scripts/init-staging-db.sh

═══════════════════════════════════════════════════════════════
IMPORTANT: Save this file securely! It contains sensitive data.
═══════════════════════════════════════════════════════════════
EOF

success "Configuration saved to: $OUTPUT_FILE"

# Display summary
echo ""
echo "═══════════════════════════════════════════════════════════════"
staging "✅ STAGING INFRASTRUCTURE CREATED SUCCESSFULLY!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
value "EC2 Public IP:    $EC2_PUBLIC_IP"
value "RDS Endpoint:     $RDS_ENDPOINT"
value "SSH Key:          $EC2_SSH_KEY"
value "DB Password:      $DB_PASSWORD"
echo ""
value "Frontend:         http://$EC2_PUBLIC_IP:3000"
value "Backend:          http://$EC2_PUBLIC_IP:8000"
value "API Docs:         http://$EC2_PUBLIC_IP:8000/docs"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

#==============================================================================
# PHASE 9: UPDATE DEPLOYMENT-STAGING.ENV
#==============================================================================

if [[ -f "$ENV_FILE" ]]; then
    echo ""
    read -p "Update deployment-staging.env with these values? (yes/no): " -r
    if [[ $REPLY =~ ^[Yy]es$ ]]; then
        step "📝 Updating deployment-staging.env"

        # Backup original
        cp "$ENV_FILE" "${ENV_FILE}.backup-$(date +%Y%m%d-%H%M%S)"

        # Update values
        sed -i.tmp "s|^EC2_PUBLIC_IP=.*|EC2_PUBLIC_IP=$EC2_PUBLIC_IP|" "$ENV_FILE"
        sed -i.tmp "s|^EC2_SSH_KEY=.*|EC2_SSH_KEY=$EC2_SSH_KEY|" "$ENV_FILE"
        sed -i.tmp "s|^DOMAIN_NAME=.*|DOMAIN_NAME=$EC2_PUBLIC_IP|" "$ENV_FILE"
        sed -i.tmp "s|^RDS_INSTANCE_ID=.*|RDS_INSTANCE_ID=$DB_INSTANCE_ID|" "$ENV_FILE"
        sed -i.tmp "s|^RDS_ENDPOINT=.*|RDS_ENDPOINT=$RDS_ENDPOINT|" "$ENV_FILE"
        sed -i.tmp "s|^DB_NAME=.*|DB_NAME=$DB_NAME|" "$ENV_FILE"
        sed -i.tmp "s|^DB_USER=.*|DB_USER=$DB_USERNAME|" "$ENV_FILE"
        sed -i.tmp "s|^DB_PASSWORD=.*|DB_PASSWORD=$DB_PASSWORD|" "$ENV_FILE"
        sed -i.tmp "s|^SECRET_KEY=.*|SECRET_KEY=$SECRET_KEY|" "$ENV_FILE"
        sed -i.tmp "s|^JWT_SECRET_KEY=.*|JWT_SECRET_KEY=$JWT_SECRET_KEY|" "$ENV_FILE"
        sed -i.tmp "s|^FRONTEND_URL=.*|FRONTEND_URL=http://$EC2_PUBLIC_IP:3000|" "$ENV_FILE"

        # Clean up temporary files
        rm -f "${ENV_FILE}.tmp"

        success "deployment-staging.env updated successfully"
        warn "⚠️  Don't forget to set DOCKERHUB_USERNAME in deployment-staging.env"
    else
        log "Skipping deployment-staging.env update"
        warn "Manually update deployment-staging.env with values from: $OUTPUT_FILE"
    fi
else
    warn "deployment-staging.env not found, skipping auto-update"
    warn "Manually update deployment-staging.env with values from: $OUTPUT_FILE"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
staging "🎉 SETUP COMPLETE!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
log "Full configuration saved to: $OUTPUT_FILE"
log ""
log "Next steps:"
log "1. SSH into EC2 and install Docker (see output file)"
log "2. Verify deployment-staging.env is correct"
log "3. Deploy: ./scripts/deploy-staging.sh --with-migrations"
echo ""
warn "⚠️  SECURITY REMINDERS:"
warn "  - Never commit $OUTPUT_FILE to git"
warn "  - Keep $EC2_SSH_KEY secure (chmod 600)"
warn "  - Save DB password in secure password manager"
warn "  - These secrets are for STAGING only - never use in production"
echo ""
success "Staging infrastructure is ready! 🚀"
echo ""
