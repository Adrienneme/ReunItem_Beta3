from app.core import supabase
from app.schemas import ItemSchemas, MatchSchemas
from fastapi import HTTPException, UploadFile
import json
import uuid
import re
from urllib.parse import unquote
from ai.generator import description_generator
from ai.matching import match
from app.models.audit_logs import log_action


def clean_filename(name: str) -> str:
    return re.sub(r'[^A-Za-z0-9._-]', '_', name)

class ItemModels:

    @staticmethod
    def create_item(item: ItemSchemas.ItemCreate, user_id: str, photo: UploadFile = None):

        item_data = item.model_dump()
        item_data["user_id"] = user_id

        try:
            if photo:
                content = photo.file.read()
                safe_name = clean_filename(photo.filename)
                photo_path = f"items/{uuid.uuid4()}_{safe_name}"

                supabase.storage.from_("item_photos").upload(
                    photo_path, content, {"content-type": photo.content_type}
                )
                item_data["photo_url"] = supabase.storage.from_("item_photos") \
                    .get_public_url(photo_path)

            res = supabase.table("items").insert(item_data).execute()
            if not res.data:
                log_action(user_id, "CREATE_ITEM", "ERR", "Failed to insert item", "items")
                raise Exception("Failed to insert item")

            full = supabase.table("items").select("*") \
                .eq("entry_id", res.data[0]["entry_id"]) \
                .single().execute()

            log_action(user_id, "CREATE_ITEM", "OK", "Item created", "items")
            return ItemSchemas.ItemResponse(**full.data)

        except Exception as e:
            log_action(user_id, "CREATE_ITEM", "ERR", str(e), "items")
            print(f"what error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))


    @staticmethod
    async def gen_desc(photo: UploadFile):
        allowed = ["image/jpeg", "image/png", "image/jpg"]
        if photo.content_type not in allowed:
            raise HTTPException(status_code=400, detail="Only image files allowed")

        try:
            contents = await photo.read()
            return description_generator(contents)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


    @staticmethod
    def get_items(user_id: str):
        res = supabase.table("items").select("*").eq("user_id", user_id).execute()
        return [ItemSchemas.ItemResponse(**i) for i in res.data] if res.data else []


    @staticmethod
    def get_specific_item(entry_id: str):
        res = supabase.table("items").select("*").eq("entry_id", entry_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Item not found")

        return ItemSchemas.ItemResponse(**res.data[0])


    @staticmethod
    def update_item(entry_id: str, updates: dict, photo: UploadFile = None):
        existing = supabase.table("items").select("*").eq("entry_id", entry_id).execute()

        if not existing.data:
            raise HTTPException(status_code=403, detail="You cannot edit this item")

        user_id = existing.data[0]["user_id"]

        try:
            if photo:
                old_url = existing.data[0].get("photo_url")
                if old_url and "/object/public/item_photos/" in old_url:
                    old_path = unquote(old_url.split("/object/public/item_photos/")[1])
                    supabase.storage.from_("item_photos").remove([old_path])

                content = photo.file.read()
                safe_name = clean_filename(photo.filename)
                new_path = f"items/{uuid.uuid4()}_{safe_name}"

                supabase.storage.from_("item_photos").upload(
                    new_path, content, {"content-type": photo.content_type}
                )

                updates["photo_url"] = supabase.storage.from_("item_photos") \
                    .get_public_url(new_path)

            supabase.table("items").update(updates).eq("entry_id", entry_id).execute()

            updated = supabase.table("items").select("*").eq("entry_id", entry_id).single().execute()

            log_action(user_id, "UPDATE_ITEM", "OK", f"Updated {entry_id}", "items")
            return ItemSchemas.ItemResponse(**updated.data)

        except Exception as e:
            log_action(user_id, "UPDATE_ITEM", "ERR", str(e), "items")
            raise HTTPException(status_code=500, detail=str(e))


    @staticmethod
    def delete_item(entry_id: str):
        existing = supabase.table("items").select("*").eq("entry_id", entry_id).execute()

        if not existing.data:
            raise HTTPException(status_code=403, detail="You cannot delete this item")

        user_id = existing.data[0]["user_id"]

        try:
            photo_url = existing.data[0].get("photo_url")
            if photo_url and "/object/public/item_photos/" in photo_url:
                old_path = unquote(photo_url.split("/object/public/item_photos/")[1])
                supabase.storage.from_("item_photos").remove([old_path])

            supabase.table("items").delete().eq("entry_id", entry_id).execute()

            log_action(user_id, "DELETE_ITEM", "OK", f"Deleted {entry_id}", "items")
            return {"message": "Item deleted successfully"}

        except Exception as e:
            log_action(user_id, "DELETE_ITEM", "ERR", str(e), "items")
            raise HTTPException(status_code=500, detail=str(e))


    @staticmethod
    def find_match(entry_id: str, user_id: str):
        lost = supabase.table("items").select("*").eq("entry_id", entry_id).execute()
        if not lost.data:
            raise HTTPException(status_code=404, detail="Item not found")

        lost_desc = lost.data[0].get("description", "")

        found = supabase.table("items") \
            .select("*") \
            .eq("type", "found") \
            .eq("status", "Approved") \
            .neq("user_id", user_id) \
            .execute()

        matches = []
        for item in found.data:
            similarity = match(lost_desc, item.get("description", ""))
            if similarity:
                matches.append(MatchSchemas.FoundMatchResponse(**item, similarity=similarity))

        return matches


    @staticmethod
    def set_match(user_id: str, lostentry_id: str, foundentry_id: str, similarity: int):

        try:
            match_row = MatchSchemas.MatchedItems(
                lost_entry_id=str(lostentry_id),
                found_entry_id=str(foundentry_id),
                similarity=int(similarity)
            )

            res = supabase.table("matches_table") \
                .insert(json.loads(match_row.json(exclude_none=True))).execute()

            if not res.data:
                raise Exception("Failed to insert match")

            supabase.table("items").update({"status": "Pending Claim"}).eq("entry_id", lostentry_id).execute()
            supabase.table("items").update({"status": "Pending Claim"}).eq("entry_id", foundentry_id).execute()

            lost_item = supabase.table("items").select("*").eq("entry_id", lostentry_id).single().execute().data
            found_item = supabase.table("items").select("*").eq("entry_id", foundentry_id).single().execute().data

            log_action(user_id, "SET_MATCH", "OK", "Match created", "matches_table")

            return MatchSchemas.MatchResponse(
                match_id=res.data[0]["match_id"],
                similarity=res.data[0]["similarity"],
                is_claimed=res.data[0]["is_claimed"],
                lost_item=ItemSchemas.ItemResponse(**lost_item),
                found_item=ItemSchemas.ItemResponse(**found_item),
            )

        except Exception as e:
            log_action(user_id, "SET_MATCH", "ERR", str(e), "matches_table")
            raise HTTPException(status_code=500, detail=str(e))


    @staticmethod
    def get_match(entry_id: str):
        res = supabase.table("matches_table") \
            .select("found_entry_id, similarity") \
            .eq("lost_entry_id", entry_id).execute()

        if res.data:
            return res.data[0]

        res2 = supabase.table("matches_table") \
            .select("lost_entry_id, similarity") \
            .eq("found_entry_id", entry_id).execute()

        if res2.data:
            return res2.data[0]

        return None


    @staticmethod
    def cancel_claim(user_id: str, lostentry_id: str):

        try:
            res = supabase.table("matches_table") \
                .select("found_entry_id") \
                .eq("lost_entry_id", lostentry_id).execute()

            if not res.data:
                raise HTTPException(status_code=404, detail="Match not found")

            foundentry_id = res.data[0]["found_entry_id"]

            supabase.table("matches_table").delete().eq("lost_entry_id", lostentry_id).execute()

            supabase.table("items").update({"status": "Approved"}).eq("entry_id", lostentry_id).execute()
            supabase.table("items").update({"status": "Approved"}).eq("entry_id", foundentry_id).execute()

            log_action(user_id, "CANCEL_CLAIM", "OK", "Claim cancelled", "matches_table")
            return {"message": "Claim canceled successfully"}

        except Exception as e:
            log_action(user_id, "CANCEL_CLAIM", "ERR", str(e), "matches_table")
            raise HTTPException(status_code=500, detail=str(e))
