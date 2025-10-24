from app.core import supabase
from app.schemas import ItemSchemas
from PIL import Image
from fastapi import HTTPException, UploadFile
import uuid 
from io import BytesIO
from ai.generator import description_generator

class ItemModels:
    @staticmethod
    def create_item(item: ItemSchemas.ItemCreate, user_id: str, photo: UploadFile = None) -> ItemSchemas.ItemResponse:
        item_data = item.model_dump()
        item_data["user_id"] = user_id
        # Handle photo upload if provided
        if photo:
            try:
                photo_content = photo.file.read()
                photo_path = f"items/{uuid.uuid4()}_{photo.filename}"            
                # Upload file to Supabase Storage
                supabase.storage.from_("item_photos").upload(
                    photo_path,     # path in bucket
                    photo_content   # file content (bytes)
                )
                # Get public URL
                public_url_res = supabase.storage.from_("item_photos").get_public_url(photo_path)
                item_data["photo_url"] = public_url_res
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Photo upload failed: {str(e)}")

        response = supabase.table("items").insert(item_data).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create entry...")

        created_item = response.data[0]
        return ItemSchemas.ItemResponse(**created_item)

    @staticmethod
    async def gen_desc(photo: UploadFile):
        allowed_type = ["image/jpeg", "image/png", "image/jpg"]
        if photo.content_type not in allowed_type:
            raise ValueError("Only image files are allowed!")
        
        try:
            contents = await photo.read()
            description = description_generator(contents)
            return description
        
        except Exception as e:
            raise Exception(f"Error generating description: {e}")
        

    @staticmethod
    def get_items(user_id: str):
        response = supabase.table("items").select("*").eq("user_id", user_id).execute()
        if not response.data:
            return []  # empty array

        # returns list of items
        return [ItemSchemas.ItemResponse(**item) for item in response.data]


    @staticmethod
    def get_specific_item(entry_id: str):
        response = supabase.table("items").select("*").eq("entry_id", entry_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Item not found")

        return ItemSchemas.ItemResponse(**response.data[0])


    @staticmethod
    def update_item(entry_id: str, user_id: str, updates: dict, photo: UploadFile = None):
        existing = supabase.table("items").select("*").eq("entry_id", entry_id).eq("user_id", user_id).execute()
        if not existing.data:
            raise HTTPException(status_code=403, detail="You cannot edit this item")

        if photo:
            try:
                # Delete old photo if exists
                old_photo_url = existing.data[0].get("photo_url")
                if old_photo_url:
                    if "/object/public/" in old_photo_url:
                        old_path = old_photo_url.split("/object/public/")[-1]
                else:
                    old_path = old_photo_url
                supabase.storage.from_("item_photos").remove([old_path])     

                # Upload new photo
                photo_content = photo.file.read()
                photo_path = f"items/{uuid.uuid4()}_{photo.filename}"
                supabase.storage.from_("item_photos").upload(photo_path, photo_content)

                public_url_res = supabase.storage.from_("item_photos").get_public_url(photo_path)
                updates["photo_url"] = public_url_res
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Photo upload failed: {str(e)}")

        # Update database
        response = supabase.table("items").update(updates).eq("entry_id", entry_id).eq("user_id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to update item.")

        return ItemSchemas.ItemResponse(**response.data[0])

    @staticmethod
    def delete_item(entry_id: str, user_id: str):
        # Fetch existing item
        existing = supabase.table("items").select("*").eq("entry_id", entry_id).eq("user_id", user_id).execute()
        if not existing.data:
            raise HTTPException(status_code=403, detail="You cannot delete this item")

        # Delete photo if exists
        photo_url = existing.data[0].get("photo_url")
        if photo_url:
            try:
                if "/object/public/" in photo_url:
                    old_path = photo_url.split("/object/public/")[-1]
                else:
                    old_path = photo_url
                res = supabase.storage.from_("item_photos").remove([old_path])
                if hasattr(res, "error") and res.error:
                    raise HTTPException(status_code=400, detail=res.error.message)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Photo deletion failed: {str(e)}")

        # Delete database entry
        response = supabase.table("items").delete().eq("entry_id", entry_id).eq("user_id", user_id).execute()
        if not getattr(response, "data", None):
            raise HTTPException(status_code=500, detail="Failed to delete item.")

        return {"message": "Item deleted successfully"}

    @staticmethod
    def find_match(entry_id: str):
        response = supabase.table("items").select("*").eq("entry_id", entry_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Item not found")

        item = response.data[0]
        item_description = item.get("description", "")

        match_response = supabase.rpc("find_similar_items", {"item_desc": item_description}).execute()
        if not match_response.data:
            return []  # No matches found

        return [ItemSchemas.ItemResponse(**match) for match in match_response.data]