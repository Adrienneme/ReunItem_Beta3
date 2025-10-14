from fastapi import APIRouter, HTTPException
from app.models.user import create_user
from app.schemas.user import User, UserCreate

app = APIRouter(prefix='/users') #all routes start with /users

@app.post('/', response_model=User) #validates output
def add_user(item: UserCreate): #takes request parameters(in JSON) and parses it into UserCreate object
  new_item = create_user(item.first_name) #call model to insert into supabase
  return new_item

@app.get('/')
def testing():
  return {"message": "Testing"}

#other CRUD operations here
