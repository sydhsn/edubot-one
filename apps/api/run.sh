#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server with PORT environment variable support
uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8000}