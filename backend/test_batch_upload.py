import os
import uuid
from supabase import create_client
from dotenv import load_dotenv
from backend.ai.generator import generate_caption  # your AI caption function

# --- Load environment variables ---
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # service role key
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Local image path ---
local_file_path = "test_image.jpg"  # replace with your image file path

# --- Supabase bucket ---
BUCKET_NAME = "uploads"  # your bucket name

def upload_image(file_path):
    try:
        # Generate unique file name
        file_extension = file_path.split(".")[-1]
        storage_path = f"public/{uuid.uuid4()}.{file_extension}"

        # Read file bytes
        with open(file_path, "rb") as f:
            file_bytes = f.read()

        # Upload to Supabase storage
        response = supabase.storage.from_(BUCKET_NAME).upload(storage_path, file_bytes, {"upsert": True})
        if hasattr(response, "error") and response.error:
            raise Exception(f"Upload error: {response.error.message}")

        # Get public URL
        public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(storage_path)
        return public_url

    except Exception as e:
        print(f"Error uploading image: {e}")
        return None

def store_in_db(image_url, table_name="found_items"):
    try:
        caption = generate_caption(image_url)
        print(f"Generated caption: {caption}")

        res = supabase.table(table_name).insert({
            "image_url": image_url,
            "caption": caption
        }).execute()

        if not res.data:
            print("Failed to insert into database.")
        else:
            print("Inserted into database successfully.")

    except Exception as e:
        print(f"Error storing in DB: {e}")

if __name__ == "__main__":
    uploaded_url = upload_image(local_file_path)
    if uploaded_url:
        print(f"✅ Uploaded successfully! Public URL: {uploaded_url}")
        store_in_db(uploaded_url)
