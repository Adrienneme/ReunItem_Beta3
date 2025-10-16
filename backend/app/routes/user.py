from fastapi import APIRouter
from app.models import UserFunctions
from app.schemas import UserSchemas

router = APIRouter(prefix='/users') #all routes start with /users

@router.post('/register', response_model=UserSchemas.User)
def create_user_route(user: UserSchemas.UserCreate):
  return UserFunctions.create_user(user)

@router.post('/login', response_model=UserSchemas.User)
def login_user_route(credentials: UserSchemas.UserLogin):
  return UserFunctions.login_user(credentials)

#other CRUD operations here
