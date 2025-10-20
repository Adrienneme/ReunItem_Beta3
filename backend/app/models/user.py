from app.core import supabase, ACCESS_TOKEN_EXPIRE_MINUTES
from app.schemas import UserSchemas
from app.utils import Security
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta
from jwt.exceptions import InvalidTokenError
##
from backend.app.schema.user import ImageUpload
import uuid


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class UserModels:

    @staticmethod
    def create_user(user: UserSchemas.UserCreate) -> UserSchemas.User:
        existing_user = supabase.table("user").select("*").eq("email", user.email).execute()
        if existing_user.data:
            raise HTTPException(status_code=400, detail="Email already Registered")

        user_data = user.model_dump()
        user_data["password_hash"] = Security.hash_password(user_data["password_hash"])
        user_data["role"] = user.role.value

        response = supabase.table("user").insert(user_data).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create user.")

        created_user = response.data[0]
        created_user.pop("password_hash", None)

        return UserSchemas.User(**created_user)


    @staticmethod
    def login_user(user: UserSchemas.UserLogin):
        response = supabase.table("user").select("*").eq("email", user.email).execute()
        if not response.data:
            raise HTTPException(status_code=401, detail="User is not yet Registered")

        user_data = response.data[0]

        if not Security.verify_password(user.password, user_data["password_hash"]):
            raise HTTPException(status_code=401, detail="Incorrect password. Try Again")

        del user_data["password_hash"]
        
        token = Security.create_user_token(
            data={"sub": str(user_data["email"])},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

        return UserSchemas.LoginResponse(
            access_token=token,
            token_type="bearer",
            user=user_data
        )

    
    @staticmethod
    def get_current_active_user(token: str = Depends(oauth2_scheme)) -> UserSchemas.User:
        try:
            payload = Security.verify_user_token(token)
            email: str = payload.get("sub")
            if email is None:
                raise HTTPException(status_code=401, detail="Could not validate credentials")
        except InvalidTokenError:
            raise HTTPException(status_code=401, detail="Could not validate credentials")

        response = supabase.table("user").select("*").eq("email", email).execute()
        if not response.data:
            raise HTTPException(status_code=401, detail="User not found")

        user_data = response.data[0]
        user_data.pop("password_hash", None)

        return UserSchemas.User(**user_data)
    
    #The changes I added
# Upload Logic
def upload_user_image(image: ImageUpload, file):
    # Upload a user image to supabse storage and stores its info in the database"
    try:
       
        # generate a unique filename 
        file_extension = file.filename.split(".")[-1]
        file_path = f"public/{uuid.uuid4()}.{file_extension}" #Be inside the upload bucket

        #Read file bytes
        file_bytes = file.file.read()

        #Upload file to supabase Storage bucket name "Uploads"
        response = supabase.storage.from_("uploads").upload(
            file_path, file_bytes, {"upsert": "true"}
        )
      
      #Error checking
        if hasattr(response, "error") and response.error is not None:
            raise HTTPException(status_code=500, detail=f"Upload error: {response.error.message}")

    #get public  URL of upload file
        public_url = supabase.storage.form("uploads").get_public_ur;(file_path)

        #Determine if for lost or founf table
        table_name = "found_items" if image.image_type == "found" else "lost_items"

        #Store recors into Supabase
        db_response = supabase.table(table_name).insert({
            "first_name": image.first_name,
            "last_name": image.last_name,
            "image_url": public_url,
            "image_type": image.image_type
        }).execute()

        if not db_response.data:
            raise HTTPException(status_code=500, detail="Failed to save image info to database.")

        return {"message": "✅ Image uploaded successfully", "image_url": public_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
