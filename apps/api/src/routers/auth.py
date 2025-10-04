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

@router.post("/setup-defaults")
async def setup_default_users():
    """Setup default admin, teacher, and student users (for development/testing)"""
    try:
        result = await auth_service.setup_default_users()
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Setup failed: {str(e)}"
        )

@router.get("/users")
async def get_all_users(admin_user: dict = Depends(get_admin_user)):
    """Get all users (admin only)"""
    try:
        users = await auth_service.get_all_users()
        return users
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get users: {str(e)}"
        )

@router.get("/users/by-role")
async def get_users_by_role(
    role: str,
    admin_user: dict = Depends(get_admin_user)
):
    """Get users by role (admin only)"""
    try:
        if role not in ["admin", "teacher", "student"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid role. Must be one of: admin, teacher, student"
            )
        users = await auth_service.get_users_by_role(role)
        return users
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get {role}s: {str(e)}"
        )

@router.get("/me")
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    try:
        user_profile = await auth_service.get_user_by_id(current_user["sub"])
        if not user_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        # Remove sensitive information
        safe_profile = {key: value for key, value in user_profile.items() 
                      if key not in ["password", "reset_token", "reset_token_expires"]}
        return safe_profile
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user profile: {str(e)}"
        )

@router.post("/change-password")
async def change_password(
    password_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Change user password"""
    try:
        old_password = password_data.get("old_password")
        new_password = password_data.get("new_password")
        
        if not old_password or not new_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Both old_password and new_password are required"
            )
        
        success = await auth_service.change_password(
            current_user["sub"], 
            old_password, 
            new_password
        )
        
        if success:
            return {"message": "Password changed successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid old password"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Password change failed: {str(e)}"
        )

@router.post("/refresh")
async def refresh_token(current_user: dict = Depends(get_current_user)):
    """Refresh JWT token"""
    try:
        # Generate new token with same user data
        new_token = JWTHandler.create_access_token(data={
            "sub": current_user["sub"],
            "email": current_user["email"],
            "role": current_user["role"],
            "full_name": current_user.get("full_name", "")
        })
        
        return {
            "access_token": new_token,
            "token_type": "bearer",
            "user": {
                "id": current_user["sub"],
                "email": current_user["email"],
                "role": current_user["role"],
                "full_name": current_user.get("full_name", "")
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token refresh failed: {str(e)}"
        )

@router.post("/register/teacher")
async def register_teacher(
    teacher_data: TeacherCreate,
    admin_user: dict = Depends(get_admin_user)
):
    """Register a new teacher (Admin only)"""
    try:
        teacher = await auth_service.create_teacher(teacher_data, admin_user["sub"])
        return {
            "message": "Teacher registered successfully",
            "teacher": teacher
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Teacher registration failed: {str(e)}"
        )

@router.post("/register/student")
async def register_student(
    student_data: StudentCreate,
    admin_user: dict = Depends(get_admin_user)
):
    """Register a new student (Admin only)"""
    try:
        student = await auth_service.create_student(student_data)
        return {
            "message": "Student registered successfully",
            "student": student
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Student registration failed: {str(e)}"
        )