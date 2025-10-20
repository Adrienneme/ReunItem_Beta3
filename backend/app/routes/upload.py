from fastapi import APIRouter, UploadFile, Form
from backend.app.db import supabase

from backend.ai.generator import generate_caption

import uuid

router = APIRouter()

@router.post("/upload/")
async def upload_image(file: UploadFile, item_type: str = Form(...)):
    """
    Uploads an image, generates caption, stores both in Supabase.
    item_type = 'lost_items' or 'found_items'
    """
    # Step 1: Generate a unique file name
    file_bytes = await file.read()
    file_name = f"{uuid.uuid4()}_{file.filename}"
    file_path = f"uploads/{file_name}"

    # Step 2: Upload to Supabase Storage
    res = supabase.storage.from_("images").upload(file_path, file_bytes)
    if res.get("error"):
        return {"error": res["error"]["message"]}

    # Step 3: Get public URL
    public_url = supabase.storage.from_("images").get_public_url(file_path)

    # Step 4: Generate caption using AI
    caption = generate_caption(public_url)

    # Step 5: Insert record into database
    data = {"image_url": public_url, "caption": caption}
    insert_res = supabase.table(item_type).insert(data).execute()

    return {
        "message": "Image uploaded successfully!",
        "url": public_url,
        "caption": caption,
        "db_result": insert_res.data,
    }
