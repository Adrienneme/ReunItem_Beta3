from supabase import create_client
import uuid
import os
from dotenv import load_dotenv

load_dotenv()  # load .env

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")  # service_role key
supabase = create_client(url, key)

file_path = f"public/{uuid.uuid4()}.jpg"
file_bytes = b"hello world"  # test content

res = supabase.storage.from_("uploads").upload(
    file_path,
    file_bytes,
    {"upsert": "true"}  # string instead of bool
)

print(res)
