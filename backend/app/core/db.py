import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv() #load .env file

SUPABASE_URL= os.getenv('SUPABASE_URL')
SUPABASE_KEY= os.getenv('SUPABASE_KEY')
##
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

#the changes I added
#note path baclend/app/core/db.py
#supabase client 
# Create Supabase client using service role key
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# confirm connection
print(f"SUPABASE_URL: {SUPABASE_URL}")
print(f"Using service role key for backend operations")