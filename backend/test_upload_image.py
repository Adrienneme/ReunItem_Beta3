import os
import uuid
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # service role key

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Local image file
local_file_path = "test_image.jpg"

# Generate unique path in bucket
file_extension = local_file_path.split(".")[-1]
file_path = f"public/{uuid.uuid4()}.{file_extension}"

# Read file bytes
local_file_path = "test_image.jpg"
with open(local_file_path, "rb") as f:
    file_bytes = f.read()

# Upload to "uploads" bucket
response = supabase.storage.from_("uploads").upload(file_path, file_bytes, {"upsert": "true"})

# Check result
if hasattr(response, "error") and response.error is not None:
    print(" Upload failed:", response.error)
else:
    public_url = supabase.storage.from_("uploads").get_public_url(file_path)
    print(" Image upload succeeded!")
    print("Public URL:", public_url)
