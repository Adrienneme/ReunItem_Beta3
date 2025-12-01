from fastapi import APIRouter, Depends, HTTPException, status
from app.core.db import supabase
from app.models.user import UserModels
from app.models.audit_logs import get_logs
from app.models.audit_logs import log_action

admin_claims_router = APIRouter(
    prefix="/admin",
    tags=["Admin Claims & Items"]
)


def get_current_admin(current_user=Depends(UserModels.get_current_active_user)):
    if current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required."
        )
    return current_user


@admin_claims_router.get("/matches")
async def get_all_matches(_=Depends(get_current_admin)):
    try:
        matches = (
            supabase.table("matches_table")
            .select("*")
            .eq("is_claimed", False)
            .execute()
            .data or []
        )

        for m in matches:
            lost_item = (
                supabase.table("items")
                .select("*")
                .eq("entry_id", m["lost_entry_id"])
                .single()
                .execute()
                .data
            )

            found_item = (
                supabase.table("items")
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

            lost_user = (
                supabase.table("user")
                .select("first_name, last_name")
                .eq("user_id", lost_user_id)
                .single()
                .execute()
                .data
                if lost_user_id else None
            )

            found_user = (
                supabase.table("user")
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


@admin_claims_router.post("/approve_claim/{match_id}")
async def approve_claim(match_id: str, admin=Depends(get_current_admin)):
    try:
        match = (
            supabase.table("matches_table")
            .select("*")
            .eq("match_id", match_id)
            .single()
            .execute()
            .data
        )

        if not match:
            raise HTTPException(status_code=404, detail="Match not found")

        supabase.table("matches_table").update({"is_claimed": True}).eq("match_id", match_id).execute()

        for entry_id in [match["lost_entry_id"], match["found_entry_id"]]:
            supabase.table("items").update({"status": "Claimed"}).eq("entry_id", entry_id).execute()

        log_action(admin.user_id, "APPROVE_CLAIM", "OK", f"Approved match {match_id}", "matches_table")
        return {"message": f"Match {match_id} approved successfully."}

    except Exception as e:
        log_action(admin.user_id, "APPROVE_CLAIM", "ERR", str(e), "matches_table")
        raise HTTPException(status_code=500, detail=str(e))


@admin_claims_router.post("/reject_claim/{match_id}")
async def reject_claim(match_id: str, admin=Depends(get_current_admin)):
    try:
        match = (
            supabase.table("matches_table")
            .select("*")
            .eq("match_id", match_id)
            .single()
            .execute()
            .data
        )

        if not match:
            raise HTTPException(status_code=404, detail="Match not found")

        supabase.table("matches_table").delete().eq("match_id", match_id).execute()

        for entry_id in [match["lost_entry_id"], match["found_entry_id"]]:
            supabase.table("items").update({"status": "Approved"}).eq("entry_id", entry_id).execute()

        log_action(admin.user_id, "REJECT_CLAIM", "OK", f"Rejected match {match_id}", "matches_table")
        return {"message": f"Match {match_id} rejected successfully."}

    except Exception as e:
        log_action(admin.user_id, "REJECT_CLAIM", "ERR", str(e), "matches_table")
        raise HTTPException(status_code=500, detail=str(e))


@admin_claims_router.get("/archived_items")
async def archived_items(_=Depends(get_current_admin)):
    try:
        valid_statuses = ["Claimed", "Rejected"]

        lost_items = (
            supabase.table("items")
            .select("*")
            .eq("type", "lost")
            .in_("status", valid_statuses)
            .execute()
            .data or []
        )

        found_items = (
            supabase.table("items")
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


@admin_claims_router.get("/items")
async def admin_items(_=Depends(get_current_admin)):
    try:
        valid_statuses = ["Approved", "Matched"]

        lost_items = (
            supabase.table("items")
            .select("*")
            .eq("type", "lost")
            .in_("status", valid_statuses)
            .execute()
            .data or []
        )

        found_items = (
            supabase.table("items")
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


@admin_claims_router.post("/approve_item/{entry_id}")
async def approve_item(entry_id: str, admin=Depends(get_current_admin)):
    try:
        item = (
            supabase.table("items")
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

        supabase.table("items").update({"status": "Claimed"}).eq("entry_id", entry_id).execute()

        log_action(admin.user_id, "APPROVE_ITEM", "OK", f"Approved item {entry_id}", "items")
        return {"message": f"{item['type'].capitalize()} item {entry_id} status updated to 'Claimed'."}

    except Exception as e:
        log_action(admin.user_id, "APPROVE_ITEM", "ERR", str(e), "items")
        raise HTTPException(status_code=500, detail=str(e))


@admin_claims_router.get("/get-logs")
async def get_logs_route(admin=Depends(get_current_admin)):
    return get_logs()