from fastapi import APIRouter, Depends
from typing import Annotated, Union
from backend.app.models import UserFunctions
from backend.app.schemas import UserSchemas


router = APIRouter(prefix='/users') #all routes start with /users

@router.post('/register', response_model=UserSchemas.User)
def create_user_route(user: UserSchemas.UserCreate):
  return UserFunctions.create_user(user)

@router.post('/login', response_model=UserSchemas.LoginResponse)
def login_user_route(credentials: UserSchemas.UserLogin):
  return UserFunctions.login_user(credentials)

@router.get("/me", response_model=UserSchemas.User)
async def read_users_me(
    current_user: Annotated[UserSchemas.User, Depends(UserFunctions.get_current_active_user)],
    ) -> Union[UserSchemas.User, None]: 
    return current_user
