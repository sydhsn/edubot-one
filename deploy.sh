#!/bin/bash

# Edubot Deployment Script
set -e

echo "🚀 Starting Edubot deployment..."

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
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed and running
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! docker info &> /dev/null; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f "apps/api/.env" ]; then
    print_warning ".env file not found. Creating from .env.example..."
    cp apps/api/.env.example apps/api/.env
    print_warning "Please update apps/api/.env with your actual configuration values."
fi

# Check if all required files exist
required_files=(
    "docker-compose.yml"
    "apps/api/Dockerfile"
    "apps/web/Dockerfile"
    "apps/api/requirements.txt"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Required file $file is missing."
        exit 1
    fi
done

print_status "All required files found."

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans || docker compose down --remove-orphans || true

# Build and start services
print_status "Building and starting services..."
if command -v docker-compose &> /dev/null; then
    docker-compose up --build -d
else
    docker compose up --build -d
fi

# Wait for services to be healthy
print_status "Waiting for services to start..."
sleep 10

# Check service health
print_status "Checking service health..."

# Check API health
if curl -f http://localhost:8000/health &> /dev/null; then
    print_status "✅ API is healthy and running on http://localhost:8000"
else
    print_error "❌ API health check failed"
fi

# Check Web health
if curl -f http://localhost &> /dev/null; then
    print_status "✅ Web app is healthy and running on http://localhost"
else
    print_error "❌ Web app health check failed"
fi

# Show running containers
print_status "Running containers:"
docker ps --filter "name=edubot"

print_status "🎉 Deployment completed!"
print_status "📊 API: http://localhost:8000"
print_status "🌐 Web: http://localhost"
print_status "📚 API Docs: http://localhost:8000/docs"

print_warning "Don't forget to:"
print_warning "1. Update apps/api/.env with your actual configuration"
print_warning "2. Configure your OpenAI API key if using AI features"
print_warning "3. Set up proper secrets for production deployment"