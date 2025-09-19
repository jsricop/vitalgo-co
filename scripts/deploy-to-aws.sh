#!/bin/bash

# VitalGo - Deploy to AWS Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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

# Check required environment variables
if [ -z "$EC2_PUBLIC_IP" ]; then
    print_error "EC2_PUBLIC_IP environment variable is not set"
    echo "Get it from: terraform output ec2_public_ip"
    exit 1
fi

if [ -z "$KEY_PAIR_PATH" ]; then
    print_error "KEY_PAIR_PATH environment variable is not set"
    echo "Example: export KEY_PAIR_PATH=~/.ssh/vitalgo-keypair.pem"
    exit 1
fi

print_status "Deploying VitalGo to AWS EC2: $EC2_PUBLIC_IP"

# Copy docker-compose and env files to EC2
print_status "Copying deployment files to EC2..."
scp -i "$KEY_PAIR_PATH" docker/docker-compose.aws.yml ec2-user@$EC2_PUBLIC_IP:~/vitalgo/
scp -i "$KEY_PAIR_PATH" docker/.env.aws ec2-user@$EC2_PUBLIC_IP:~/vitalgo/

# SSH into EC2 and deploy
print_status "Connecting to EC2 and starting deployment..."
ssh -i "$KEY_PAIR_PATH" ec2-user@$EC2_PUBLIC_IP << 'EOF'
    set -e

    echo "🚀 Starting VitalGo deployment on EC2..."

    # Navigate to app directory
    cd ~/vitalgo

    # Pull latest images
    echo "📥 Pulling latest Docker images..."
    docker-compose -f docker-compose.aws.yml pull

    # Stop existing containers
    echo "🛑 Stopping existing containers..."
    docker-compose -f docker-compose.aws.yml down || true

    # Start new containers
    echo "▶️ Starting new containers..."
    docker-compose -f docker-compose.aws.yml up -d

    # Wait for services to be ready
    echo "⏳ Waiting for services to start..."
    sleep 30

    # Check container status
    echo "📊 Container status:"
    docker-compose -f docker-compose.aws.yml ps

    # Check application health
    echo "🏥 Checking application health..."
    if curl -f http://localhost:8000/health; then
        echo "✅ Backend is healthy"
    else
        echo "❌ Backend health check failed"
    fi

    if curl -f http://localhost:3000/api/health; then
        echo "✅ Frontend is healthy"
    else
        echo "❌ Frontend health check failed"
    fi

    # Clean up old images
    echo "🧹 Cleaning up old Docker images..."
    docker system prune -f

    echo "🎉 Deployment completed!"
EOF

print_status "✅ Deployment to AWS completed!"
print_status "🌐 Frontend URL: http://$EC2_PUBLIC_IP:3000"
print_status "🔧 Backend API: http://$EC2_PUBLIC_IP:8000"
print_status "📋 API Docs: http://$EC2_PUBLIC_IP:8000/docs"