#only "approve" on lost/found entries

from fastapi import APIRouter, Depends, Header, HTTPException, status
from app.core.db import supabase

from fastapi.responses import JSONResponse
from app.models.user import UserModels

from typing import List

admin_claims_router = APIRouter(
    prefix="/admin",
    tags=["Admin Claims & Items"]
)

#Update jwt reuse later
def get_current_admin(current_user = Depends(UserModels.get_current_active_user)):
    if current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required."
        )
    return current_user


# ================== Pending Claim Submission =========
@admin_claims_router.get("/matches")
async def get_all_matches():

    matches = (
        supabase.table("matches_table")
        .select("*")
        .eq("is_claimed", False)
        .execute()
        .data or []
    )

    if not matches:
        return {"matches": []}

    for m in matches:

        #  Fetch Lost Item 
        lost_item = (
            supabase.table("items")
            .select("*")
            .eq("entry_id", m["lost_entry_id"])
            .single()
            .execute()
            .data
        )

        # Fetch Found Item 
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

        #  Get User IDs
        lost_user_id = lost_item.get("user_id") if lost_item else None
        found_user_id = found_item.get("user_id") if found_item else None

        # Fetch Lost User 
        lost_user = (
            supabase.table("user")
            .select("first_name, last_name")
            .eq("user_id", lost_user_id)
            .single()
            .execute()
            .data
            if lost_user_id else None
        )

        #  Fetch Found User
        found_user = (
            supabase.table("user")
            .select("first_name, last_name")
            .eq("user_id", found_user_id)
            .single()
            .execute()
            .data
            if found_user_id else None
        )

        #Attach 
        m["lost_user"] = lost_user
        m["found_user"] = found_user

    return {"matches": matches}

# ================== Approve Claim =====================
@admin_claims_router.post("/approve_claim/{match_id}")
async def approve_claim(match_id: str):
    
   # Approve a claim — mark match as claimed and both items as 'Claimed'
   
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

    #  Update match as claimed
    supabase.table("matches_table").update({"is_claimed": True}).eq("match_id", match_id).execute()

    #  Update both items’ status
    for entry_id in [match["lost_entry_id"], match["found_entry_id"]]:
        supabase.table("items").update({"status": "Claimed"}).eq("entry_id", entry_id).execute()

    return {"message": f" Match {match_id} approved successfully."}


# ================== Reject Claim ======================
@admin_claims_router.post("/reject_claim/{match_id}")
async def reject_claim(match_id: str):
   
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
    
    # Set is_claimed back to False (not a string)
    supabase.table("matches_table").update({"is_claimed": True}).eq("match_id", match_id).execute()
#Delete Match
    supabase.table("matches_table").delete().eq("match_id", match_id).execute()

    #  Update both related items
    for entry_id in [match["lost_entry_id"], match["found_entry_id"]]:
        supabase.table("items").update({"status": "Approved"}).eq("entry_id", entry_id).execute()

    return {"message": f" Match {match_id} rejected successfully."}



# ================== Archived Items ===========
@admin_claims_router.get("/archived_items")
async def archived_items(admin=Depends(get_current_admin)):

    valid_statuses = ["Claimed", "Rejected"]

    lost_items = (
        supabase.table("items")
        .select("*")
        .eq("type", "lost")
        .in_("status", valid_statuses)  
        .execute()
        .data
    ) or []

    found_items = (
        supabase.table("items")
        .select("*")
        .eq("type", "found")
        .in_("status", valid_statuses)  
        .execute()
        .data
    ) or []

    def group_by_status(items):
        grouped = {}
        for item in items:
            grouped.setdefault(item.get("status", "unknown"), []).append(item)
        return grouped

    print(f"Lost items: {len(lost_items)}, Found items: {len(found_items)}") 

    return {
        "lost_grouped": group_by_status(lost_items),
        "found_grouped": group_by_status(found_items),
    }


#==========Lost/Found Entries ======
#  Lost and Found Dashboard is working
# Only show items approved by the admin
@admin_claims_router.get("/items")
async def admin_items(admin=Depends(get_current_admin)):
    # Fetch only APPROVED or MATCHED items
    valid_statuses = ["Approved", "Matched"]

    lost_items = (
        supabase.table("items")
        .select("*")
        .eq("type", "lost")
        .in_("status", valid_statuses)  
        .execute()
        .data
    )

    found_items = (
        supabase.table("items")
        .select("*")
        .eq("type", "found")
        .in_("status", valid_statuses)  
        .execute()
        .data
    )

    def group_by_status(items):
        grouped = {}
        for item in items:
            grouped.setdefault(item.get("status", "unknown"), []).append(item)
        return grouped

    print(f"Lost items: {len(lost_items)}, Found items: {len(found_items)}") 

    return {
        "lost_grouped": group_by_status(lost_items),
        "found_grouped": group_by_status(found_items),
    }

# =====Handle Claim in Lost and FOund
#NEW ROUTE
@admin_claims_router.post("/approve_item/{entry_id}")
async def approve_item(entry_id: str, admin=Depends(get_current_admin)):

    # Fetch the item and include type for reference
    item = (
        supabase.table("items")
        .select("*")
        .eq("entry_id", entry_id)
        .single()
        .execute()
        .data
    )

    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")

    # Check item type
    if item["type"] not in ["lost", "found"]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot approve item with type '{item['type']}'"
        )

    # Update status to 'Claimed'
    supabase.table("items").update({"status": "Claimed"}).eq("entry_id", entry_id).execute()

    return {
        "message": f"{item['type'].capitalize()} item {entry_id} status updated to 'Claimed'."
    }

