# backend/routes/image.py

from fastapi import APIRouter, UploadFile, File
from ai.generator import generate_caption
from ai.matching import find_best_match
from db import supabase
import tempfile

router = APIRouter()

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    # Save temporary file
    temp = tempfile.NamedTemporaryFile(delete=False)
    temp.write(await file.read())
    temp.close()

    # Upload to Supabase Storage
    supabase.storage.from_("images").upload(file.filename, open(temp.name, "rb"))
    public_url = supabase.storage.from_("images").get_public_url(file.filename)

    # Generate caption
    caption = generate_caption(public_url)

    # Check database for similar items
    existing_items = supabase.table("items").select("*").execute().data
    match = find_best_match(caption, existing_items)

    # Save to database
    supabase.table("items").insert({
        "filename": file.filename,
        "url": public_url,
        "caption": caption
    }).execute()

    return {
        "caption": caption,
        "match": match
    }
