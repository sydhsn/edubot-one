#!/usr/bin/env python3
"""
Startup script for the school management API
"""
import sys
import os
import subprocess

# Add the src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

def kill_port_8000():
    """Kill any processes running on port 8000"""
    try:
        subprocess.run(["lsof", "-ti:8000"], capture_output=True, check=True)
        subprocess.run(["lsof", "-ti:8000", "|", "xargs", "kill", "-9"], shell=True)
        print("🔄 Killed existing processes on port 8000")
    except subprocess.CalledProcessError:
        pass  # No processes found on port 8000

if __name__ == "__main__":
    import uvicorn
    
    # Kill any existing processes on port 8000
    kill_port_8000()
    
    print("🏫 Starting School Management System API...")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔍 Health Check: http://localhost:8000/health")
    print("✅ Using virtual environment with Motor installed")
    
    # Import from src after path is set
    from src.main import app
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=["src"]
    )