from fastapi import APIRouter, UploadFile, Form
from backend.app.db import supabase

from backend.ai.generator import generate_caption

import uuid

router = APIRouter()

@router.post("/preview/")
async def upload_image(file: UploadFile, item_type: str = Form(...)):
 
   ## Uploads an image, generates caption, a preview
    ##item_type = 'lost_items' or 'found_items'
    
    # Generate a unique file name
    file_bytes = await file.read()
    file_name = f"{uuid.uuid4()}_{file.filename}"
    file_path = f"uploads/{file_name}"

    #Upload to Supabase Storage
    res = supabase.storage.from_("images").upload(file_path, file_bytes)
    if res.get("error"):
        return {"error": res["error"]["message"]}

    # Get public URL
    public_url = supabase.storage.from_("images").get_public_url(file_path)

    #Generate caption using AI
    caption = generate_caption(public_url)


    return {
        "message": "Image uploaded successfully!",
        "url": public_url,
        "caption": caption,
        "db_result": insert_res.data,
    }

#for Commiting to database or cancelling
#Prevent imidiate insert to databse after caption
@router.post("/commit/")
async def commit_record(data: dict): # Receive the data from the preview step
    # 1. Validate incoming data (add more validation here)
    public_url = data.get("url")
    caption = data.get("caption")
    item_type = data.get("item_type")

    if not all([public_url, caption, item_type]):
        return {"error": "Missing required data for commit."}

    # 2. Insert record into database
    record_data = {"image_url": public_url, "caption": caption}
    insert_res = supabase.table(item_type).insert(record_data).execute()

    return {
        "message": "Record successfully committed to database!",
        "db_result": insert_res.data,
    }

