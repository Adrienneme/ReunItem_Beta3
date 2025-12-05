from fastapi import APIRouter, Depends
from typing import Annotated, Union
from app.models import UserModels
from app.schemas import UserSchemas
from app.admin.routes import get_current_admin

router = APIRouter(prefix='/users') 

@router.post('/register', response_model=UserSchemas.User)
def create_user_route(user: UserSchemas.UserCreate):
  return UserModels.create_user(user)


@router.post("/admin-create", response_model=UserSchemas.User)
def admin_create_user_route(user: UserSchemas.UserCreate, admin = Depends(get_current_admin)):
    return UserModels.create_user(user, actor_id=admin.user_id)


@router.post('/login', response_model=UserSchemas.LoginResponse)
def login_user_route(credentials: UserSchemas.UserLogin):
  return UserModels.login_user(credentials)

@router.post("/logout/{user_id}")
def logout_user_route(user_id: str):
    return UserModels.logout_user(user_id)


@router.get("/me", response_model=UserSchemas.User)
async def read_users_me(
    current_user: Annotated[UserSchemas.User, Depends(UserModels.get_current_active_user)],
    ) -> Union[UserSchemas.User, None]: 
    return current_user
  
  
@router.get("/get-all-user")
def get_all_user_route(admin = Depends(get_current_admin)):
  return UserModels.get_all_users()


@router.get("/get-user/{user_id}", response_model=UserSchemas.User)
def get_user_route(user_id: str, _= Depends(UserModels.get_current_active_user)):
    return UserModels.get_user(user_id)
  

@router.put("/update/{user_id}", response_model=UserSchemas.User)
def update_user_route(user_id: str, updates: dict, admin = Depends(get_current_admin)):
    return UserModels.update_user(user_id, updates, admin.user_id)


@router.delete("/delete/{user_id}")
def delete_user_route(user_id: str, admin = Depends(get_current_admin)):
    return UserModels.delete_user(user_id, admin.user_id)