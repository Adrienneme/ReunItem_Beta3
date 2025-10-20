from fastapi import APIRouter, HTTPException, Form, UploadFile, File
from backend.app.models.user1 import upload_user_image
from backend.app.schemas.user import ImageUpload, ImageType

router = APIRouter()

# Image Upload Endpoint
@router.post("/upload_image")
async def upload_image_route(
    first_name: str = Form(...),
    last_name: str = Form(...),
    image_type: ImageType = Form(...),
    file: UploadFile = File(...)
):
    # Create ImageUpload schema instance
    image_data = ImageUpload(
        first_name=first_name,
        last_name=last_name,
        image_type=image_type
    )

    # Call the model function to handle upload and database insert
    result = upload_user_image(image=image_data, file=file)
    return result
