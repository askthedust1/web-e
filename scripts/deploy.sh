#!/bin/bash
#
# RSK Frontend Deployment Script
# Usage: ./scripts/deploy.sh [--no-cache]
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="docker-compose-production.yml"
CONTAINER_NAME="rsk-front"
STATIC_DIR="/data/rsk_front/.next/static"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

cd "$PROJECT_DIR"

echo ""
echo "=========================================="
echo "   Eldik Site Frontend Deployment"
echo "   $(date)"
echo "=========================================="
echo ""

# Parse arguments
BUILD_ARGS=""
if [[ "$1" == "--no-cache" ]]; then
    BUILD_ARGS="--no-cache"
    log_info "Building with --no-cache"
fi

# Step 1: Ensure static directory exists
log_info "Step 1: Preparing directories..."
mkdir -p "$STATIC_DIR" 2>/dev/null || {
    log_warn "Cannot create $STATIC_DIR - ensure it exists with proper permissions"
    log_warn "Run once: sudo mkdir -p $STATIC_DIR && sudo chown \$(whoami):\$(whoami) $STATIC_DIR"
}

# Step 2: Build new image
log_info "Step 2: Building new Docker image..."
docker compose -f "$COMPOSE_FILE" build $BUILD_ARGS app

# Step 3: Stop existing container
log_info "Step 3: Stopping existing container..."
docker compose -f "$COMPOSE_FILE" stop app 2>/dev/null || true

# Step 4: Remove old container (keeps the image)
log_info "Step 4: Removing old container..."
docker compose -f "$COMPOSE_FILE" rm -f app 2>/dev/null || true

# Step 5: Start new container
log_info "Step 5: Starting new container..."
docker compose -f "$COMPOSE_FILE" up -d app

# Step 6: Wait for container to be healthy
log_info "Step 6: Waiting for container to start..."
sleep 3

# Check if container is running
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    log_success "Container '$CONTAINER_NAME' is running"
else
    log_error "Container failed to start!"
    docker compose -f "$COMPOSE_FILE" logs --tail=50 app
    exit 1
fi

# Step 7: Verify static files
log_info "Step 7: Verifying static files..."
sleep 2
if [ "$(ls -A $STATIC_DIR 2>/dev/null)" ]; then
    FILE_COUNT=$(find "$STATIC_DIR" -type f | wc -l)
    log_success "Static files deployed: $FILE_COUNT files"
else
    log_warn "Static directory appears empty - checking container logs..."
    docker logs --tail=20 "$CONTAINER_NAME"
fi

# Step 8: Clean up old images
log_info "Step 8: Cleaning up dangling images..."
docker image prune -f --filter "dangling=true" 2>/dev/null || true

echo ""
echo "=========================================="
log_success "Deployment Complete!"
echo "   Container: $CONTAINER_NAME"
echo "   Static files: $STATIC_DIR"
echo "   $(date)"
echo "=========================================="
echo ""

# Show container status
docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
