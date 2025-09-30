#!/bin/bash
# Render start script for FastAPI

echo "Starting EduBot API on Render..."

# Set the PYTHONPATH to include the src directory
export PYTHONPATH="${PYTHONPATH}:/opt/render/project/src/apps/api/src:/opt/render/project/src/apps/api"

# Change to the API directory
cd /opt/render/project/src/apps/api

# Check if PORT environment variable is set, default to 10000
PORT=${PORT:-10000}

echo "Starting server on port $PORT..."

# Start the FastAPI application with Uvicorn
exec uvicorn src.main:app --host 0.0.0.0 --port $PORT --workers 1 --log-level info