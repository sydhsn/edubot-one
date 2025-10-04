from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

# Import available routers
from .routers import admissions, auth, ai, attendance, courses, timetables, assignments, reports
from .core.config import settings
from .database import connect_to_mongo, close_mongo_connection

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Starting School Management System API...")
    await connect_to_mongo()
    logger.info("✅ API startup complete")
    yield
    # Shutdown
    logger.info("🛑 Shutting down API...")
    await close_mongo_connection()
    logger.info("✅ API shutdown complete")

app = FastAPI(
    title="School Management System API",
    description="Complete school management with role-based access control",
    version="1.0.0",
    lifespan=lifespan
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
app.include_router(auth.router, prefix="/api", tags=["Authentication"])
app.include_router(admissions.router, prefix="/api/admissions", tags=["Admissions"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI Features"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["Attendance"])
app.include_router(courses.router, prefix="/api/courses", tags=["Courses"])
app.include_router(timetables.router, prefix="/api/timetables", tags=["Timetables"])
app.include_router(assignments.router, prefix="/api/assignments", tags=["Assignments"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])

@app.get("/")
async def root():
    return {
        "message": "School Management System API",
        "status": "running",
        "docs": "/docs",
        "version": "1.0.0",
        "features": {
            "authentication": "JWT-based with role-based access control",
            "admissions": "Complete admission workflow",
            "ai_features": "Gemini-powered content generation",
            "attendance": "Comprehensive attendance tracking",
            "courses": "Course and curriculum management",
            "timetables": "Class scheduling system",
            "assignments": "Assignment creation and submission",
            "reports": "Student performance reports"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": "2025-01-01T00:00:00Z"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)