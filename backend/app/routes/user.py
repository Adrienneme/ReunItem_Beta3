from fastapi import APIRouter, Depends
from typing import Annotated, Union
from app.models import UserModels
from app.schemas import UserSchemas

router = APIRouter(prefix='/users')  # all routes start with /users


@router.post('/register', response_model=UserSchemas.User)
def create_user_route(user: UserSchemas.UserCreate):
    return UserModels.create_user(user)


@router.post('/login', response_model=UserSchemas.LoginResponse)
def login_user_route(credentials: UserSchemas.UserLogin):
    return UserModels.login_user(credentials)


@router.get("/me", response_model=UserSchemas.User)
async def read_users_me(
    current_user: Annotated[UserSchemas.User, Depends(UserModels.get_current_active_user)],
) -> Union[UserSchemas.User, None]: 
    return current_user


@router.get("/get-user/{user_id}")
def get_user_route(user_id: str, _=Depends(UserModels.get_current_active_user)):
    user = UserModels.get_user(user_id)
    return user
