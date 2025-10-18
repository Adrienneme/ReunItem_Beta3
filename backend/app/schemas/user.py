#sample lang muna
from pydantic import BaseModel
from enum import Enum
import uuid

class UserRole(str, Enum):
  admin = "admin"
  user = "user"

class UserSchemas:
  class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    password_hash: str
    role: UserRole = UserRole.user

  class User(BaseModel):
    user_id: uuid.UUID
    first_name: str
    last_name: str
    email: str
    role: UserRole

  class UserLogin(BaseModel):
    email: str
    password: str
  
  # Token Schemas
  class Token(BaseModel):
    access_token: str
    token_type: str
    
  class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: 'UserSchemas.User'



