#!/bin/bash
# Render build script for FastAPI

# Install dependencies
pip install -r requirements.txt

# Create logs directory if it doesn't exist
mkdir -p logs

echo "Build completed successfully!"