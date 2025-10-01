"""
Authentication routes for school management
"""
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..models.schemas import *
from ..services.auth_service import AuthService
from ..core.auth import JWTHandler

router = APIRouter(prefix="/auth", tags=["Authentication"])
auth_service = AuthService()
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    token = credentials.credentials
    payload = JWTHandler.verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    return payload

async def get_admin_user(current_user: dict = Depends(get_current_user)):
    """Ensure current user is admin"""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

@router.post("/register/student", response_model=dict)
async def register_student(student_data: StudentCreate):
    """Student self-registration (admission)"""
    try:
        student = await auth_service.create_student(student_data)
        return {
            "message": "Student registration successful", 
            "student": student
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/create/teacher", response_model=dict)
async def create_teacher(
    teacher_data: TeacherCreate, 
    admin_user: dict = Depends(get_admin_user)
):
    """Create teacher account (admin only)"""
    try:
        teacher = await auth_service.create_teacher(teacher_data, admin_user["sub"])
        return {
            "message": "Teacher account created successfully", 
            "teacher": teacher
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Teacher creation failed: {str(e)}"
        )

@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    """User login"""
    try:
        response = await auth_service.login(login_data)
        return response
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.post("/forgot-password")
async def forgot_password(email: str):
    """Request password reset"""
    try:
        await auth_service.forgot_password(email)
        return {"message": "Password reset email sent (if email exists)"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Password reset failed: {str(e)}"
        )

@router.post("/reset-password")
async def reset_password(reset_data: ResetPasswordRequest):
    """Reset password using token"""
    try:
        success = await auth_service.reset_password(reset_data)
        if success:
            return {"message": "Password reset successful"}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password reset failed"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Password reset failed: {str(e)}"
        )

@router.get("/dashboard")
async def get_dashboard(current_user: dict = Depends(get_current_user)):
    """Get user dashboard data"""
    try:
        dashboard_data = await auth_service.get_dashboard_data(current_user["sub"])
        return dashboard_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Dashboard data failed: {str(e)}"
        )

@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    return {
        "user_id": current_user["sub"],
        "email": current_user["email"],
        "full_name": current_user["full_name"],
        "role": current_user["role"]
    }