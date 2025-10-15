from fastapi import APIRouter, HTTPException
from app.models.user import create_user, login_user
from app.schemas.user import User, UserCreate, UserLogin

router = APIRouter(prefix='/users') #all routes start with /users

@router.post('/register', response_model=User)
def create_user_route(user: UserCreate):
  return create_user(user)

@router.post('/login', response_model=User)
def login_user_route(credentials: UserLogin):
  return login_user(credentials.email, credentials.password)

#other CRUD operations here
