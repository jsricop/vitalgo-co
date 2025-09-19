#!/bin/bash

# VitalGo - Build and Push Docker Images Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOCKERHUB_USERNAME=${DOCKERHUB_USERNAME:-""}
IMAGE_TAG=${IMAGE_TAG:-"latest"}

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

# Check if DockerHub username is provided
if [ -z "$DOCKERHUB_USERNAME" ]; then
    print_error "DOCKERHUB_USERNAME environment variable is not set"
    echo "Usage: DOCKERHUB_USERNAME=your-username ./scripts/build-and-push.sh"
    exit 1
fi

print_status "Starting VitalGo Docker build and push process..."

# Build backend image
print_status "Building backend image..."
docker build -f docker/Dockerfile.backend -t $DOCKERHUB_USERNAME/vitalgo-backend:$IMAGE_TAG .

# Build frontend image
print_status "Building frontend image..."
docker build -f docker/Dockerfile.frontend -t $DOCKERHUB_USERNAME/vitalgo-frontend:$IMAGE_TAG .

# Check if user is logged in to DockerHub
print_status "Checking DockerHub login status..."
if ! docker info | grep -q "Username"; then
    print_warning "Not logged in to DockerHub. Please login:"
    docker login
fi

# Push images
print_status "Pushing backend image to DockerHub..."
docker push $DOCKERHUB_USERNAME/vitalgo-backend:$IMAGE_TAG

print_status "Pushing frontend image to DockerHub..."
docker push $DOCKERHUB_USERNAME/vitalgo-frontend:$IMAGE_TAG

print_status "✅ Build and push completed successfully!"
print_status "Backend image: $DOCKERHUB_USERNAME/vitalgo-backend:$IMAGE_TAG"
print_status "Frontend image: $DOCKERHUB_USERNAME/vitalgo-frontend:$IMAGE_TAG"