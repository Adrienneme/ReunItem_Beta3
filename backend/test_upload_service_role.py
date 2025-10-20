import os
import uuid
from supabase import create_client
from dotenv import load_dotenv

# Load .env
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # make sure this exists in .env

# Initialize Supabase client with service role
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Generate a unique file path
file_extension = "txt"
file_path = f"public/{uuid.uuid4()}.{file_extension}"

# Test file content
file_bytes = b"Hello Supabase! Testing upload with service role key."

try:
    # Upload to "uploads" bucket
    response = supabase.storage.from_("uploads").upload(file_path, file_bytes, {"upsert": "true"})

    
    if hasattr(response, "error") and response.error is not None:
        print(f"Upload failed: {response.error.message}")
    else:
        print("✅ Upload succeeded!")
        public_url = supabase.storage.from_("uploads").get_public_url(file_path)
        print(f"Public URL: {public_url}")

except Exception as e:
    print(f"Error: {e}")
