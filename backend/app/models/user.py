from app.db import supabase
from app.schemas import UserSchemas
from app.utils import Security
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta
from jwt.exceptions import InvalidTokenError  # You missed this import
from app.config import ACCESS_TOKEN_EXPIRE_MINUTES


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class UserFunctions:

    @staticmethod
    def create_user(user: UserSchemas.UserCreate) -> UserSchemas.User:
        existing_user = supabase.table("user").select("*").eq("email", user.email).execute()
        if existing_user.data:
            raise HTTPException(status_code=400, detail="Email already Registered")

        user_data = user.model_dump()
        user_data["password_hash"] = Security.hash_password(user_data["password_hash"])
        user_data["role"] = user.role.value

        response = supabase.table("user").insert(user_data).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create user.")

        created_user = response.data[0]
        created_user.pop("password_hash", None)

        return UserSchemas.User(**created_user)

    @staticmethod
    def login_user(user: UserSchemas.UserLogin):
        response = supabase.table("user").select("*").eq("email", user.email).execute()
        if not response.data:
            raise HTTPException(status_code=401, detail="User is not yet Registered")

        user_data = response.data[0]

        if not Security.verify_password(user.password, user_data["password_hash"]):
            raise HTTPException(status_code=401, detail="Incorrect password. Try Again")

        user_data.pop("password_hash", None)
        
        token = Security.create_user_token(
            data={"sub": str(user_data["email"])},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user_data  # includes email, id, etc.
        }

    
    @staticmethod
    def get_current_active_user(token: str = Depends(oauth2_scheme)) -> UserSchemas.User:
        try:
            payload = Security.verify_user_token(token)
            email: str = payload.get("sub")
            if email is None:
                raise HTTPException(status_code=401, detail="Could not validate credentials")
        except InvalidTokenError:
            raise HTTPException(status_code=401, detail="Could not validate credentials")

        response = supabase.table("user").select("*").eq("email", email).execute()
        if not response.data:
            raise HTTPException(status_code=401, detail="User not found")

        user_data = response.data[0]
        user_data.pop("password_hash", None)

        return UserSchemas.User(**user_data)

