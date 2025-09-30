#!/bin/bash

echo "🐳 Checking Docker Desktop installation..."

# Check if Docker Desktop is installed
if [ ! -d "/Applications/Docker.app" ]; then
    echo "❌ Docker Desktop not found in Applications folder"
    echo "Please download and install Docker Desktop for Apple Silicon from:"
    echo "https://desktop.docker.com/mac/main/arm64/Docker.dmg"
    exit 1
fi

echo "✅ Docker Desktop found in Applications"

# Check if Docker command is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker command not available in PATH"
    echo "Please make sure Docker Desktop is running"
    echo "You may need to restart your terminal after installation"
    exit 1
fi

echo "✅ Docker command available"

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo "❌ Docker daemon is not running"
    echo "Please start Docker Desktop from Applications"
    echo "Wait for the whale icon to appear in your menu bar"
    exit 1
fi

echo "✅ Docker daemon is running"
echo "🎉 Docker is ready!"

# Show Docker version
echo ""
echo "Docker version:"
docker --version
docker-compose --version 2>/dev/null || docker compose version

echo ""
echo "✅ Docker setup complete! Ready to deploy applications."