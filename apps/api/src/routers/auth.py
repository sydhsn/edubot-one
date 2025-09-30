from fastapi import APIRouter, HTTPException, Depends
from ..models.schemas import LoginRequest, LoginResponse, UserCreate, User
from ..services.auth_service import AuthService

router = APIRouter()
auth_service = AuthService()

@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    user = auth_service.authenticate_user(login_data.email, login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = auth_service.create_access_token({"sub": user.email, "role": user.role})
    return LoginResponse(access_token=access_token, user=user)

@router.post("/register")
async def register(user_data: UserCreate):
    try:
        user = auth_service.create_user(user_data)
        return {"message": "User created successfully", "user_id": user.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me", response_model=User)
async def get_current_user(token: str = Depends(auth_service.get_current_user)):
    return token