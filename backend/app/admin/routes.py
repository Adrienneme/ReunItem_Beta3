from fastapi import APIRouter, Depends, HTTPException, status
from app.core.db import supabase
from app.models.user import UserModels
from app.models.entries import log_action

admin_claims_router = APIRouter(
    prefix="/admin",
    tags=["Admin Claims & Items"]
)

# ---------------- Admin check ----------------
def get_current_admin(current_user=Depends(UserModels.get_current_active_user)):
    if current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required."
        )
    return current_user

# ========================= MATCHES =========================
@admin_claims_router.get("/matches")
async def get_all_matches(_=Depends(get_current_admin)):
    try:
        matches = (
            supabase.table("matches_table_backup")
            .select("*")
            .eq("is_claimed", False)
            .execute()
            .data or []
        )

        for m in matches:
            # LOST item
            lost_item = (
                supabase.table("items_backup")
                .select("*")
                .eq("entry_id", m["lost_entry_id"])
                .single()
                .execute()
                .data
            )

            # FOUND item
            found_item = (
                supabase.table("items_backup")
                .select("*")
                .eq("entry_id", m["found_entry_id"])
                .single()
                .execute()
                .data
            )

            m["lost_item"] = lost_item
            m["found_item"] = found_item

            lost_user_id = lost_item.get("user_id") if lost_item else None
            found_user_id = found_item.get("user_id") if found_item else None

            # LOST user
            lost_user = (
                supabase.table("user_backup")
                .select("first_name, last_name")
                .eq("user_id", lost_user_id)
                .single()
                .execute()
                .data
                if lost_user_id else None
            )

            # FOUND user
            found_user = (
                supabase.table("user_backup")
                .select("first_name, last_name")
                .eq("user_id", found_user_id)
                .single()
                .execute()
                .data
                if found_user_id else None
            )

            m["lost_user"] = lost_user
            m["found_user"] = found_user

        return {"matches": matches}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========================= APPROVE CLAIM =========================
@admin_claims_router.post("/approve_claim/{match_id}")
async def approve_claim(match_id: str, admin=Depends(get_current_admin)):
    try:
        match = (
            supabase.table("matches_table_backup")
            .select("*")
            .eq("match_id", match_id)
            .single()
            .execute()
            .data
        )

        if not match:
            raise HTTPException(status_code=404, detail="Match not found")

        # Update match as claimed
        supabase.table("matches_table_backup") \
            .update({"is_claimed": True}) \
            .eq("match_id", match_id) \
            .execute()

        # Update both linked items to Claimed
        for entry_id in [match["lost_entry_id"], match["found_entry_id"]]:
            supabase.table("items_backup") \
                .update({"status": "Claimed"}) \
                .eq("entry_id", entry_id) \
                .execute()

        log_action(
            admin.user_id,
            "APPROVE_CLAIM",
            200,
            f"Approved match {match_id}",
            "matches_table_backup"
        )

        return {"message": f"Match {match_id} approved successfully."}

    except Exception as e:
        log_action(
            admin.user_id,
            "APPROVE_CLAIM",
            500,
            str(e),
            "matches_table_backup"
        )
        raise HTTPException(status_code=500, detail=str(e))

# ========================= REJECT CLAIM =========================
@admin_claims_router.post("/reject_claim/{match_id}")
async def reject_claim(match_id: str, admin=Depends(get_current_admin)):
    try:
        match = (
            supabase.table("matches_table_backup")
            .select("*")
            .eq("match_id", match_id)
            .single()
            .execute()
            .data
        )

        if not match:
            raise HTTPException(status_code=404, detail="Match not found")

        # Remove match record
        supabase.table("matches_table_backup") \
            .delete() \
            .eq("match_id", match_id) \
            .execute()

        # Revert item statuses back to Approved
        for entry_id in [match["lost_entry_id"], match["found_entry_id"]]:
            supabase.table("items_backup") \
                .update({"status": "Approved"}) \
                .eq("entry_id", entry_id) \
                .execute()

        log_action(
            admin.user_id,
            "REJECT_CLAIM",
            200,
            f"Rejected match {match_id}",
            "matches_table_backup"
        )

        return {"message": f"Match {match_id} rejected successfully."}

    except Exception as e:
        log_action(
            admin.user_id,
            "REJECT_CLAIM",
            500,
            str(e),
            "matches_table_backup"
        )
        raise HTTPException(status_code=500, detail=str(e))

# ========================= ARCHIVED ITEMS =========================
@admin_claims_router.get("/archived_items")
async def archived_items(_=Depends(get_current_admin)):
    try:
        valid_statuses = ["Claimed", "Rejected"]

        lost_items = (
            supabase.table("items_backup")
            .select("*")
            .eq("type", "lost")
            .in_("status", valid_statuses)
            .execute()
            .data or []
        )

        found_items = (
            supabase.table("items_backup")
            .select("*")
            .eq("type", "found")
            .in_("status", valid_statuses)
            .execute()
            .data or []
        )

        def group(items):
            grouped = {}
            for i in items:
                grouped.setdefault(i.get("status", "unknown"), []).append(i)
            return grouped

        return {
            "lost_grouped": group(lost_items),
            "found_grouped": group(found_items),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========================= ALL ADMIN ITEMS =========================
@admin_claims_router.get("/items")
async def admin_items(_=Depends(get_current_admin)):
    try:
        valid_statuses = ["Approved", "Matched"]

        lost_items = (
            supabase.table("items_backup")
            .select("*")
            .eq("type", "lost")
            .in_("status", valid_statuses)
            .execute()
            .data or []
        )

        found_items = (
            supabase.table("items_backup")
            .select("*")
            .eq("type", "found")
            .in_("status", valid_statuses)
            .execute()
            .data or []
        )

        def group(items):
            grouped = {}
            for i in items:
                grouped.setdefault(i.get("status", "unknown"), []).append(i)
            return grouped

        return {
            "lost_grouped": group(lost_items),
            "found_grouped": group(found_items),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========================= APPROVE INDIVIDUAL ITEM =========================
@admin_claims_router.post("/approve_item/{entry_id}")
async def approve_item(entry_id: str, admin=Depends(get_current_admin)):
    try:
        item = (
            supabase.table("items_backup")
            .select("*")
            .eq("entry_id", entry_id)
            .single()
            .execute()
            .data
        )

        if not item:
            raise HTTPException(status_code=404, detail="Item not found")

        if item["type"] not in ["lost", "found"]:
            raise HTTPException(status_code=400, detail="Invalid item type")

        # Update item status to Claimed
        supabase.table("items_backup") \
            .update({"status": "Claimed"}) \
            .eq("entry_id", entry_id) \
            .execute()

        log_action(
            admin.user_id,
            "APPROVE_ITEM",
            200,
            f"Approved item {entry_id}",
            "items_backup"
        )

        return {"message": f"{item['type'].capitalize()} item {entry_id} status updated to 'Claimed'."}

    except Exception as e:
        log_action(
            admin.user_id,
            "APPROVE_ITEM",
            500,
            str(e),
            "items_backup"
        )
        raise HTTPException(status_code=500, detail=str(e))
