# backend/app/routes/image_caption.py
from fastapi import APIRouter, File, UploadFile
from backend.ai.generator import generate_caption

router = APIRouter(prefix="/caption", tags=["Image Captioning"])

@router.post("/generate")
async def generate_caption_from_upload(file: UploadFile = File(...)):
    """
    Accepts an uploaded image and returns a generated caption.
    """
    image_bytes = await file.read()
    caption = generate_caption(image_bytes)
    return {"caption": caption}
