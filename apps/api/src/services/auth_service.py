from ..core.security import verify_password, get_password_hash, create_access_token, verify_token
from ..models.schemas import User, UserCreate
from typing import Optional

class AuthService:
    def __init__(self):
        # Mock database - replace with real database
        self.users = []
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        user = next((u for u in self.users if u.email == email), None)
        if user and verify_password(password, user.password_hash):
            return user
        return None
    
    def create_user(self, user_data: UserCreate) -> User:
        # Check if user already exists
        if any(u.email == user_data.email for u in self.users):
            raise Exception("User already exists")
        
        # Create new user
        user_dict = user_data.dict()
        user_dict["password_hash"] = get_password_hash(user_data.password)
        user_dict.pop("password")
        user_dict["id"] = str(len(self.users) + 1)
        
        user = User(**user_dict)
        self.users.append(user)
        return user
    
    def create_access_token(self, data: dict):
        return create_access_token(data)
    
    def get_current_user(self, token: str):
        payload = verify_token(token)
        if not payload:
            raise Exception("Invalid token")
        return payload