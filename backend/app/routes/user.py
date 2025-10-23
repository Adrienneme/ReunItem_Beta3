from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import Annotated, Union
from app.models import UserModels
from app.schemas import UserSchemas
##
from backend.app.schemas.user import ImageUpload, ImageType, upload_user_image
from backend.app.db import supabase
from fastapi import Depends

router = APIRouter(prefix='/users') #all routes start with /users

@router.post('/register', response_model=UserSchemas.User)
def create_user_route(user: UserSchemas.UserCreate):
  return UserModels.create_user(user)

@router.post('/login', response_model=UserSchemas.LoginResponse)
def login_user_route(credentials: UserSchemas.UserLogin):
  return UserModels.login_user(credentials)

@router.get("/me", response_model=UserSchemas.User)
async def read_users_me(
    current_user: Annotated[UserSchemas.User, Depends(UserModels.get_current_active_user)],
    ) -> Union[UserSchemas.User, None]: 
    return current_user

#The changes I added
#Image upload route/endpoit
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

#add user unique id to determine who uploaded image for matvhng and claim
@router.post("/upload_lost")
async def upload_lost_item(
    #user_id: str = Form(...),
    current_user: Annotated[UserSchemas.User, Depends(UserModels.get_current_active_user)],
    caption: str = Form(...),
    file: UploadFile = File(...)
):
  
    ##Upload a lost item image and store its details (user_id, caption, image_url).
    user_id = current_user.id
    file_path = f"lost/{user_id}/{file.filename}"

    # Upload image to Supabase storage
    res = supabase.storage.from_("images").upload(file_path, file.file)
    if res.get("error"):
        raise HTTPException(status_code=400, detail=res["error"]["message"])

    public_url = supabase.storage.from_("images").get_public_url(file_path)

    # Store in database (link to user)
    supabase.table("lost_items").insert({
        "user_id": user_id,
        "caption": caption,
        "image_url": public_url,
        "status": "active"
    }).execute()

    return {
        "message": "Lost item uploaded successfully",
        "user_id": user_id,
        "url": public_url
    }