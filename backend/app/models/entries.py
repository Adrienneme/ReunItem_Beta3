from app.core import supabase
from app.schemas import ItemSchemas, MatchSchemas
from fastapi import HTTPException, UploadFile
import json
import uuid 
import re
from urllib.parse import unquote
from ai.generator import description_generator
from ai.matching import match

def clean_filename(name: str) -> str:
    return re.sub(r'[^A-Za-z0-9._-]', '_', name)
    
class ItemModels:
    
    @staticmethod
    def create_item(item: ItemSchemas.ItemCreate, user_id: str, photo: UploadFile = None) -> ItemSchemas.ItemResponse:
        item_data = item.model_dump()
        item_data["user_id"] = user_id

        if photo:
            try:
                content = photo.file.read()
                safe_name = clean_filename(photo.filename)
                photo_path = f"items/{uuid.uuid4()}_{safe_name}"

                result = supabase.storage.from_("item_photos").upload(
                    photo_path,
                    content,
                    {"content-type": photo.content_type}
                )
                print("Upload Result:", result)
                
                public_url_res = supabase.storage.from_("item_photos").get_public_url(photo_path)
                item_data["photo_url"] = public_url_res

            except Exception as e:
                print("UPLOAD ERROR:", e)
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
            return []  

        return [ItemSchemas.ItemResponse(**item) for item in response.data]


    @staticmethod
    def get_specific_item(entry_id: str):
        response = supabase.table("items").select("*").eq("entry_id", entry_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Item not found")

        return ItemSchemas.ItemResponse(**response.data[0])


    @staticmethod
    def update_item(entry_id: str, updates: dict, photo: UploadFile = None):
        
        existing = supabase.table("items").select("*").eq("entry_id", entry_id).execute()

        if not existing.data:
            raise HTTPException(status_code=403, detail="You cannot edit this item")

        if photo:
            try:
                old_photo_url = existing.data[0].get("photo_url")
                
                if old_photo_url and "/object/public/item_photos/" in old_photo_url:
                    old_path = unquote(old_photo_url.split("/object/public/item_photos/")[1])
                    print("DECODED OLD PATH:", old_path)
                    delete_res = supabase.storage.from_("item_photos").remove([old_path])
                    print("DELETE RESULT:", delete_res)

                    if delete_res and "error" in delete_res[0]:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Failed to delete old photo: {delete_res[0]['error']}"
                    )

                content = photo.file.read()
                safe_name = clean_filename(photo.filename)
                print(f'safe name: {safe_name}')
                photo_path = f"items/{uuid.uuid4()}_{safe_name}"

                result = supabase.storage.from_("item_photos").upload(
                    photo_path,
                    content,
                    {"content-type": photo.content_type}
                )
                print("UPLOAD RESULT:", result)

                # Save public URL
                public_url_res = supabase.storage.from_("item_photos").get_public_url(photo_path)
                updates["photo_url"] = public_url_res

            except Exception as e:
                print("UPLOAD ERROR:", e)
                raise HTTPException(status_code=500, detail=f"Photo upload failed: {str(e)}")

        response = supabase.table("items").update(updates).eq("entry_id", entry_id).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to update item.")

        return ItemSchemas.ItemResponse(**response.data[0])


    @staticmethod
    def delete_item(entry_id: str):
        existing = supabase.table("items").select("*").eq("entry_id", entry_id).execute()
        if not existing.data:
            raise HTTPException(status_code=403, detail="You cannot delete this item")

        photo_url = existing.data[0].get("photo_url")
        print(f'photo_url{photo_url}')
        
        if photo_url:
            try:
                if "/object/public/item_photos/" in photo_url:
                    old_path = photo_url.split("/object/public/item_photos/")[1]
                    print(f'old_path{old_path}')
                old_path = unquote(old_path)

                print("DECODED OLD PATH:", old_path)

                delete_res = supabase.storage.from_("item_photos").remove([old_path])
                print("DELETE RESULT:", delete_res)

            except Exception as e:
                print("PHOTO DELETE ERROR:", e)
                raise HTTPException(status_code=500, detail=f"Photo deletion failed: {str(e)}")

        response = supabase.table("items").delete().eq("entry_id", entry_id).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to delete item.")

        return {"message": "Item deleted successfully"}


    @staticmethod
    def find_match(entry_id: str, user_id: str):
        lost = supabase.table("items").select("*").eq("entry_id", entry_id).execute()
        if not lost.data:
            raise HTTPException(status_code=404, detail="Item not found")

        lostItemInfo = lost.data[0]
        lost_description = lostItemInfo.get("description", "")

        found = supabase.table("items").select("*").eq("type", "found").eq("status", "Approved").neq("user_id", user_id).execute()
        foundItems = found.data
        potential_matches = []
        for i in foundItems:
            found_description = i.get("description", "")
            similarity = match(lost_description, found_description)
            if similarity:
                matched_item = MatchSchemas.FoundMatchResponse(**i, similarity=similarity)
                potential_matches.append(matched_item)
        print(f"Potential Matches: {potential_matches}")
        return potential_matches

    @staticmethod
    def set_match(lostentry_id: str, foundentry_id: str, similarity: int):
        #insert matched items
        lostentry_id = str(lostentry_id)
        foundentry_id = str(foundentry_id)
        matched_item = MatchSchemas.MatchedItems(
            lost_entry_id=lostentry_id,
            found_entry_id=foundentry_id,
            similarity=int(similarity)
        )
        response = supabase.table("matches_table").insert(json.loads(matched_item.json(exclude_none=True))).execute()
        if not response.data:
            raise Exception("Failed to insert match")
        
        inserted_match = response.data[0]
        
        #update status
        supabase.table("items").update({"status": "Pending Claim"}).eq("entry_id", lostentry_id).execute()
        supabase.table("items").update({"status": "Pending Claim"}).eq("entry_id", foundentry_id).execute()
        
        lost_item_response = (supabase.table("items").select("*").eq("entry_id", lostentry_id).execute())
        lost_item = ItemSchemas.ItemResponse(**lost_item_response.data[0])
        found_item_response = (supabase.table("items").select("*").eq("entry_id", foundentry_id).execute())
        found_item = ItemSchemas.ItemResponse(**found_item_response.data[0])
        if not lost_item_response.data or not found_item_response.data:
            raise Exception("item records were not found.")

        match_response = MatchSchemas.MatchResponse(
            match_id=inserted_match["match_id"],
            similarity=inserted_match["similarity"],
            is_claimed=inserted_match["is_claimed"],
            lost_item=lost_item,
            found_item=found_item,
        )

        return match_response

    @staticmethod
    def get_match(entry_id: str):
        #check muna ung lost
        entry_id = str(entry_id)
        response = supabase.table("matches_table").select("found_entry_id, similarity").eq("lost_entry_id", entry_id).execute()
        if response.data:
            return response.data[0]
        response = supabase.table("matches_table").select("lost_entry_id, similarity").eq("found_entry_id", entry_id).execute()
        if response.data:
            return response.data[0]
        
        return None

    @staticmethod
    def cancel_claim(lostentry_id: str):
        lostentry_id = str(lostentry_id)

        match_response = supabase.table("matches_table").select("found_entry_id").eq("lost_entry_id", lostentry_id).execute()
        if not match_response.data or len(match_response.data) == 0:
            raise HTTPException(status_code=404, detail="Match not found.")

        foundentry_id = match_response.data[0]["found_entry_id"]

        delete_response = supabase.table("matches_table").delete().eq("lost_entry_id", lostentry_id).execute()
        if not delete_response.data:
            raise HTTPException(status_code=500, detail="Failed to cancel claim.")

        supabase.table("items").update({"status": "Approved"}).eq("entry_id", lostentry_id).execute()
        supabase.table("items").update({"status": "Approved"}).eq("entry_id", foundentry_id).execute()

        return {"message": "Claim Canceled Successfully."}

            
            
            
        