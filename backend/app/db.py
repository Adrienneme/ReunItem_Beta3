import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load .env file
load_dotenv()

# ✅ Environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # make sure this exists in your .env

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise Exception("Supabase URL or Service Role Key is missing in .env")

# Create Supabase client using service role key
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Debugging: confirm connection
print(f"🔍 SUPABASE_URL: {SUPABASE_URL}")
print(f"🔍 Using service role key for backend operations")
