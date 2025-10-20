from backend.app.db import supabase  # Make sure this uses the service role key
from backend.app.schemas.user import ImageUpload
from fastapi import HTTPException
import uuid

def upload_user_image(image: ImageUpload, file):
    """
    Uploads a user image to Supabase Storage and stores its info in the database.
    """
    try:
        # 1️⃣ Generate a unique filename
        file_extension = file.filename.split(".")[-1]
        file_path = f"public/{uuid.uuid4()}.{file_extension}"  # inside uploads bucket

        # 2️⃣ Read file bytes
        file_bytes = file.file.read()

        # 3️⃣ Upload file to Supabase Storage bucket 'uploads'
        response = supabase.storage.from_("uploads").upload(
            file_path, file_bytes, {"upsert": True}
        )

        # Check for upload errors
        if hasattr(response, "error") and response.error is not None:
            raise HTTPException(status_code=500, detail=f"Upload error: {response.error.message}")

        # 4️⃣ Get the public URL of uploaded file
        public_url = supabase.storage.from_("uploads").get_public_url(file_path)

        # 5️⃣ Determine database table based on image type
        table_name = "found_items" if image.image_type == "lost" else "lost_items"

        # 6️⃣ Insert record into Supabase table
        db_response = supabase.table(table_name).insert({
            "first_name": image.first_name,
            "last_name": image.last_name,
            "image_url": public_url,
            "image_type": image.image_type
        }).execute()

        if not db_response.data:
            raise HTTPException(status_code=500, detail="Failed to save image info to database.")

        # 7️⃣ Return success message
        return {"message": "✅ Image uploaded successfully", "image_url": public_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
