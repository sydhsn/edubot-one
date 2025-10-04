#!/bin/bash

# Activate virtual environment if it exists
if [ -d ".venv" ]; then
    source .venv/bin/activate
fi

# Install dependencies
python -m pip install -r requirements.txt

# Run the FastAPI server with PORT environment variable support
python -m uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8000} --reload