from app.db import supabase

def create_user(first_name: str):
  response = supabase.table("user").insert({"first_name": first_name}).execute() #inserts the parameter to the database
  return response.data[0] #Supabase returns a list of rows; we take the first row.
