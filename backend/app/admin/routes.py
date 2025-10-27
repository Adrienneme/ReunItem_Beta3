from fastapi import APIRouter, Depends, Header, HTTPException, status
from app.core.db import supabase

admin_claims_router = APIRouter(prefix="/admin", tags=["Admin Claims & Items"])


#Update jwt reuse later
#Header to specify which user is making the request
def get_current_admin(role: str = Header(...)):
    if role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return {"role": "admin"}

#View Pending Claims 

@admin_claims_router.get("/claims/pending")
async def admin_claims_pending(admin=Depends(get_current_admin)):

    pending_items = (
        supabase.table("items")
        .select("*")
        .eq("status", "Pending Claim")
        .execute()
        .data
    )

    claims = []
    for item in pending_items:
        user_lost_items = (
            supabase.table("items")
            .select("*")
            .eq("user_id", item["user_id"])
            .eq("type", "lost")
            .execute()
            .data
        )
        claims.append({
            "pending_item": item,
            "user_lost_items": user_lost_items or []
        })

    return {"claims": claims}


# Approve Claim 
@admin_claims_router.post("/approve_claim/{entry_id}")
async def approve_claim(entry_id: str, admin=Depends(get_current_admin)):

    updated = supabase.table("items").update({"status": "Matched"}).eq("entry_id", entry_id).execute()
    if updated.status_code != 200:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to approve claim")

    return {"message": "Claim approved", "entry_id": entry_id}


# Reject Claim 
@admin_claims_router.post("/reject_claim/{entry_id}")
async def reject_claim(entry_id: str, admin=Depends(get_current_admin)):
   
    updated = supabase.table("items").update({"status": "Rejected"}).eq("entry_id", entry_id).execute()
    if updated.status_code != 200:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to reject claim")

    return {"message": "Claim rejected", "entry_id": entry_id}


# Claim Archive
@admin_claims_router.get("/claims/archive")
async def admin_claims_archive(admin=Depends(get_current_admin)):
   
    archived_claims = supabase.table("items").select("*").eq("status", "Archived").execute().data
    rejected_claims = supabase.table("items").select("*").eq("status", "Rejected").execute().data
    matched_claims = supabase.table("items").select("*").eq("status", "Matched").execute().data

    return {
        "archived_claims": archived_claims,
        "rejected_claims": rejected_claims,
        "matched_claims": matched_claims
    }


#  Lost and Found Dashboard
@admin_claims_router.get("/items")
async def admin_items(admin=Depends(get_current_admin)):
    
    lost_items = supabase.table("items").select("*").eq("type", "lost").execute().data
    found_items = supabase.table("items").select("*").eq("type", "found").execute().data

    def group_by_status(items):
        grouped = {}
        for item in items:
            grouped.setdefault(item.get("status", "unknown"), []).append(item)
        return grouped

    return {
        "lost_grouped": group_by_status(lost_items),
        "found_grouped": group_by_status(found_items)
    }
