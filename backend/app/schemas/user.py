#sample lang muna
from pydantic import BaseModel

class UserCreate(BaseModel):
  first_name: str

class User(UserCreate):
  id: int

