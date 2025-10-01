#!/usr/bin/env python3
"""
Simple FastAPI server without pydantic dependency issues
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
import os
import uvicorn

app = FastAPI(title="Edubot API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://localhost:4201"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory users storage for quick testing
users_db = {}

@app.get("/")
async def root():
    return {"message": "Edubot API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is working"}

@app.post("/api/v1/auth/setup-defaults")
async def setup_default_users():
    """Create default users for testing"""
    default_users = [
        {
            "id": "1",
            "email": "admin@school.com",
            "password": "admin123",
            "role": "admin",
            "name": "System Admin"
        },
        {
            "id": "2", 
            "email": "teacher@school.com",
            "password": "teacher123",
            "role": "teacher",
            "name": "Test Teacher"
        },
        {
            "id": "3",
            "email": "student@school.com", 
            "password": "student123",
            "role": "student",
            "name": "Test Student"
        }
    ]
    
    for user in default_users:
        users_db[user["email"]] = user
    
    return {
        "message": "Default users created successfully",
        "users": [
            {"email": user["email"], "role": user["role"], "name": user["name"]}
            for user in default_users
        ]
    }

@app.post("/api/v1/auth/login")
async def login(credentials: Dict[str, Any]):
    """Simple login endpoint"""
    email = credentials.get("email")
    password = credentials.get("password")
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")
    
    user = users_db.get(email)
    if not user or user["password"] != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Return user info without password
    return {
        "user": {
            "id": user["id"],
            "email": user["email"],
            "role": user["role"],
            "name": user["name"]
        },
        "token": f"dummy_token_for_{user['id']}"
    }

@app.get("/api/v1/auth/users")
async def list_users():
    """List all users (for testing)"""
    return {
        "users": [
            {"email": user["email"], "role": user["role"], "name": user["name"]}
            for user in users_db.values()
        ]
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)