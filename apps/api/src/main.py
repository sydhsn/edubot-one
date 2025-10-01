from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import available routers
from .routers import admissions, auth
from .core.config import settings

app = FastAPI(
    title="School Management System API",
    description="Simple school management with student admission and authentication",
    version="1.0.0"
)

# Configure CORS
origins = settings.allowed_origins.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1", tags=["Authentication"])
app.include_router(admissions.router, prefix="/api/v1/admissions", tags=["Admissions"])

@app.get("/")
async def root():
    return {
        "message": "School Management System API",
        "status": "running",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
async def root():
    return {"message": "Edubot API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    import os
    
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)