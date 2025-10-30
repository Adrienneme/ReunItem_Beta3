from fastapi import APIRouter, Depends, Header, HTTPException, status
from app.core.db import supabase

from fastapi.responses import JSONResponse
from app.models.user import UserModels


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

#==================Pending Claim Submission =========
#View Pending Claims is working
@admin_claims_router.get("/matches")
async def get_all_matches(admin=Depends(get_current_admin)):
    matches = supabase.table("matches_table").select("*").execute().data or []
    return {"matches": matches}

# Approve Claim
@admin_claims_router.post("/approve_claim/{match_id}")
async def approve_claim(match_id: str, admin=Depends(get_current_admin)):
    supabase.table("matches_table").update({"is_claimed": "TRUE"}).eq("match_id", match_id).execute()
    return {"message": f"Match {match_id} approved successfully!"}

# Reject Claim
@admin_claims_router.post("/reject_claim/{match_id}")
async def reject_claim(match_id: str, admin=Depends(get_current_admin)):
    supabase.table("matches_table").update({"is_claimed": "FALSE"}).eq("match_id", match_id).execute()
    return {"message": f"Match {match_id} rejected successfully!"}

#==================Archived=========
# Claim Archive not tested, not adjusted
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

#==========Lost/Found Entries ======
#  Lost and Found Dashboard is working
# Only show items approved by the admin, excluding "Pending Approval" and "Rejected"
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

