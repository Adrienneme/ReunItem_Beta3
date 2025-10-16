from app.db import supabase
from app.schemas import UserSchemas
from app.utils import Security
from fastapi import HTTPException

class UserFunctions:
  def create_user(user: UserSchemas.UserCreate):
    existing_user = supabase.table("users").select("*").eq("email", user.email).execute()
    if existing_user.data: #if not empty then it exists
      raise HTTPException(status_code=400, detail="Email already Registered")
    
    user_data = user.model_dump() #converts pydantic model to dictionary
    user_data["password_hash"] = Security.hash_password(user_data["password_hash"]) #hashing password
    user_data["role"] = user.role.value #convert enum to string for DB
    response = supabase.table('users').insert(user_data).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create user.")
    
    created_user = response.data[0]
    
    created_user.pop("password_hash", None)

    return UserSchemas.User(**created_user) 


  #Log In Logic
  def login_user(user: UserSchemas.UserLogin):
        response = supabase.table("users").select("*").eq("email", user.email).execute()
        if not response.data:
            raise HTTPException(status_code=401, detail="User is not yet Registered")
        
        user_data = response.data[0]

        if not Security.verify_password(user.password, user_data["password_hash"]):
            raise HTTPException(status_code=401, detail="Incorrect password. Try Again")
        
        user_data.pop("password_hash", None)
        
        return UserSchemas.User(**user_data)


