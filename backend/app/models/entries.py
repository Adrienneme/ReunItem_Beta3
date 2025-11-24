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


def log_action(actor_id: str, action: str, status_code: int, details: str, entity: str):
    try:
        actor_id = str(actor_id)
        user_res = supabase.table("user").select("first_name, last_name, role").eq("user_id", actor_id).execute()

        if user_res.data:
            u = user_res.data[0]
            full_name = f"{u.get('first_name', '')} {u.get('last_name', '')}".strip()
            user_role = u.get("role", None)
        else:
            full_name = None
            user_role = None

        full_status = f"{status_code} - {details}"

        supabase.table("audit_logs").insert({
            "actor_id": actor_id,
            "user": full_name,
            "role": user_role,
            "action": action,
            "status": full_status,
            "entity": entity
        }).execute()

    except Exception as e:
        print("AUDIT LOGGING ERROR:", e)


class ItemModels:

    @staticmethod
    def create_item(item: ItemSchemas.ItemCreate, user_id: str, photo: UploadFile = None):
        try:
            item_data = item.model_dump()
            item_data["user_id"] = user_id

            if photo:
                content = photo.file.read()
                safe_name = clean_filename(photo.filename)
                photo_path = f"items/{uuid.uuid4()}_{safe_name}"

                supabase.storage.from_("item_photos").upload(photo_path, content, {"content-type": photo.content_type})
                public_url_res = supabase.storage.from_("item_photos").get_public_url(photo_path)
                item_data["photo_url"] = public_url_res

            response = supabase.table("items").insert(item_data).execute()

            if not response.data:
                raise Exception("Failed to create entry")

            log_action(user_id, "CREATE_ITEM", 200, "Item created successfully", "items")
            return ItemSchemas.ItemResponse(**response.data[0])

        except Exception as e:
            log_action(user_id, "CREATE_ITEM", 500, str(e), "items")
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def gen_desc(photo: UploadFile):
        allowed_types = ["image/jpeg", "image/png", "image/jpg"]
        if photo.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Only image files are allowed")

        try:
            contents = await photo.read()
            return description_generator(contents)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

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
        try:
            existing = supabase.table("items").select("*").eq("entry_id", entry_id).execute()
            if not existing.data:
                raise HTTPException(status_code=403, detail="You cannot edit this item")

            user_id = existing.data[0]["user_id"]

            if photo:
                old_url = existing.data[0].get("photo_url")
                if old_url and "/object/public/item_photos/" in old_url:
                    old_path = unquote(old_url.split("/object/public/item_photos/")[1])
                    supabase.storage.from_("item_photos").remove([old_path])

                content = photo.file.read()
                safe_name = clean_filename(photo.filename)
                photo_path = f"items/{uuid.uuid4()}_{safe_name}"

                supabase.storage.from_("item_photos").upload(photo_path, content, {"content-type": photo.content_type})
                public_url_res = supabase.storage.from_("item_photos").get_public_url(photo_path)
                updates["photo_url"] = public_url_res

            response = supabase.table("items").update(updates).eq("entry_id", entry_id).execute()

            if not response.data:
                raise Exception("Failed to update item")

            log_action(user_id, "UPDATE_ITEM", 200, "Item updated successfully", "items")
            return ItemSchemas.ItemResponse(**response.data[0])

        except Exception as e:
            log_action(existing.data[0]["user_id"], "UPDATE_ITEM", 500, str(e), "items")
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    def delete_item(entry_id: str):
        try:
            existing = supabase.table("items").select("*").eq("entry_id", entry_id).execute()
            if not existing.data:
                raise HTTPException(status_code=403, detail="You cannot delete this item")

            user_id = existing.data[0]["user_id"]
            photo_url = existing.data[0].get("photo_url")

            if photo_url and "/object/public/item_photos/" in photo_url:
                old_path = unquote(photo_url.split("/object/public/item_photos/")[1])
                supabase.storage.from_("item_photos").remove([old_path])

            response = supabase.table("items").delete().eq("entry_id", entry_id).execute()
            if not response.data:
                raise Exception("Failed to delete item")

            log_action(user_id, "DELETE_ITEM", 200, "Item deleted successfully", "items")
            return {"message": "Item deleted successfully"}

        except Exception as e:
            log_action(existing.data[0]["user_id"], "DELETE_ITEM", 500, str(e), "items")
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    def find_match(entry_id: str, user_id: str):
        try:
            lost = supabase.table("items").select("*").eq("entry_id", entry_id).execute()
            if not lost.data:
                raise HTTPException(status_code=404, detail="Item not found")

            lost_desc = lost.data[0].get("description", "")
            found = supabase.table("items").select("*").eq("type", "found").eq("status", "Approved").neq("user_id", user_id).execute()

            matches = []
            for item in found.data:
                similarity = match(lost_desc, item.get("description", ""))
                if similarity:
                    matches.append(MatchSchemas.FoundMatchResponse(**item, similarity=similarity))

            log_action(user_id, "FIND_MATCH", 200, "Match search completed", "items")
            return matches

        except Exception as e:
            log_action(user_id, "FIND_MATCH", 500, str(e), "items")
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    def set_match(lostentry_id: str, foundentry_id: str, similarity: int):
        try:
            lostentry_id = str(lostentry_id)
            foundentry_id = str(foundentry_id)

            matched_item = MatchSchemas.MatchedItems(
                lost_entry_id=lostentry_id,
                found_entry_id=foundentry_id,
                similarity=int(similarity)
            )

            res = supabase.table("matches_table").insert(json.loads(matched_item.json(exclude_none=True))).execute()
            if not res.data:
                raise Exception("Failed to insert match")

            supabase.table("items").update({"status": "Pending Claim"}).eq("entry_id", lostentry_id).execute()
            supabase.table("items").update({"status": "Pending Claim"}).eq("entry_id", foundentry_id).execute()

            lost_item = ItemSchemas.ItemResponse(**supabase.table("items").select("*").eq("entry_id", lostentry_id).execute().data[0])
            found_item = ItemSchemas.ItemResponse(**supabase.table("items").select("*").eq("entry_id", foundentry_id).execute().data[0])

            log_action(lostentry_id, "SET_MATCH", 200, "Match created successfully", "matches_table")

            return MatchSchemas.MatchResponse(
                match_id=res.data[0]["match_id"],
                similarity=res.data[0]["similarity"],
                is_claimed=res.data[0]["is_claimed"],
                lost_item=lost_item,
                found_item=found_item
            )

        except Exception as e:
            log_action(lostentry_id, "SET_MATCH", 500, str(e), "matches_table")
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    def get_match(entry_id: str):
        entry_id = str(entry_id)

        a = supabase.table("matches_table").select("found_entry_id, similarity").eq("lost_entry_id", entry_id).execute()
        if a.data:
            return a.data[0]

        b = supabase.table("matches_table").select("lost_entry_id, similarity").eq("found_entry_id", entry_id).execute()
        if b.data:
            return b.data[0]

        return None

    @staticmethod
    def cancel_claim(lostentry_id: str):
        try:
            lostentry_id = str(lostentry_id)

            res = supabase.table("matches_table").select("found_entry_id").eq("lost_entry_id", lostentry_id).execute()
            if not res.data:
                raise HTTPException(status_code=404, detail="Match not found")

            foundentry_id = res.data[0]["found_entry_id"]

            del_res = supabase.table("matches_table").delete().eq("lost_entry_id", lostentry_id).execute()
            if not del_res.data:
                raise Exception("Failed to cancel claim")

            supabase.table("items").update({"status": "Approved"}).eq("entry_id", lostentry_id).execute()
            supabase.table("items").update({"status": "Approved"}).eq("entry_id", foundentry_id).execute()

            log_action(lostentry_id, "CANCEL_CLAIM", 200, "Claim cancelled successfully", "matches_table")
            return {"message": "Claim Canceled Successfully"}

        except Exception as e:
            log_action(lostentry_id, "CANCEL_CLAIM", 500, str(e), "matches_table")
            raise HTTPException(status_code=500, detail=str(e))
