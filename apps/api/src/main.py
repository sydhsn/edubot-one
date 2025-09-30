from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Only import what actually exists
from .routers import admissions  # Remove the other imports

app = FastAPI(
    title="Edubot API",
    description="School Management System API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Only include the router that exists
app.include_router(admissions.router, prefix="/api/v1/admissions", tags=["Admissions"])

# Include all routers
##app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
##app.include_router(attendance.router, prefix="/api/v1/attendance", tags=["Attendance"])
##app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI Services"])
##app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])

@app.get("/")
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