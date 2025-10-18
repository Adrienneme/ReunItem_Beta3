from app.db import supabase
from app.schemas.user import ImageUpload
from fastapi import HTTPException
import uuid

def upload_user_image(image: ImageUpload, file):
    try:
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"

        # Upload image to Supabase storage
        response = supabase.storage.from_("image-upload").upload(unique_filename, file.file)

        if not response:
            raise HTTPException(status_code=500, detail="Failed to upload image to storage.")

        # Get public URL
        public_url = supabase.storage.from_("image-upload").get_public_url(unique_filename)

        # Determine which table to store the record in
        if image.image_type == "lost":
            table_name = "found_items"  # store in opposite table
        elif image.image_type == "found":
            table_name = "lost_items"   # store in opposite table
        else:
            raise HTTPException(status_code=400, detail="Invalid image type. Must be 'lost' or 'found'.")

        # Insert record into Supabase table
        response = supabase.table(table_name).insert({
            "first_name": image.first_name,
            "last_name": image.last_name,
            "image_url": public_url,
            "image_type": image.image_type
        }).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to save image info to database.")

        return {"message": "Image uploaded successfully", "image_url": public_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
