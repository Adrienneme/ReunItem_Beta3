from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from app.core.db import supabase
from app.models.user import UserModels
from app.schemas import ItemSchemas

router = APIRouter(
    prefix="/admin",
    tags=["Admin Image Approvals"]
)


# Reuse existing JWT system
def get_current_admin(current_user=Depends(UserModels.get_current_active_user)):
    if current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required."
        )
    return current_user

# View Pending Uploads/Pending Submission
@router.get("/uploads/pending")
async def admin_pending_uploads(
    admin=Depends(get_current_admin),
    item_type: str = "All"
):
    query = supabase.table("items").select("*").eq("status", "Pending Approval")

    if item_type.lower() == "lost":
        query = query.eq("type", "lost")   
    elif item_type.lower() == "found":
        query = query.eq("type", "found")  

    pending_uploads = query.execute().data or []

    print(f"Filter: {item_type}, Results: {len(pending_uploads)} items")
    return pending_uploads



# Approve Entry
@router.post("/approve_entry/{entry_id}")
async def approve_entry(entry_id: str, admin=Depends(get_current_admin)):
    entry = supabase.table("items").select("*").eq("entry_id", entry_id).execute().data

    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found.")

    supabase.table("items").update({"status": "Approved"}).eq("entry_id", entry_id).execute()

    return {"message": f"Entry {entry_id} approved successfully!", "entry_id": entry_id}