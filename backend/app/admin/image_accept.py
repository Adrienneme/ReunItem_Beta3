from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from app.core.db import supabase
from app.models.user import UserModels
from app.models.entries import log_action

router = APIRouter(
    prefix="/admin",
    tags=["Admin Image Approvals"]
)

# ---------------- Admin check ----------------
def get_current_admin(current_user=Depends(UserModels.get_current_active_user)):
    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required.")
    return current_user

# ---------------- Pending Uploads ----------------
@router.get("/uploads/pending")
async def admin_pending_uploads(_=Depends(get_current_admin), item_type: str = "All"):
    try:
        query = supabase.table("items_backup").select("*").eq("status", "Pending Approval")

        if item_type.lower() == "lost":
            query = query.eq("type", "lost")
        elif item_type.lower() == "found":
            query = query.eq("type", "found")

        pending_uploads = query.execute().data or []
        return pending_uploads

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------- Approve Entry ----------------
@router.post("/approve_entry/{entry_id}")
async def approve_entry(entry_id: str, admin=Depends(get_current_admin)):
    try:
        entry = supabase.table("items_backup").select("*").eq("entry_id", entry_id).execute().data

        if not entry:
            raise HTTPException(status_code=404, detail="Entry not found")

        supabase.table("items_backup").update({"status": "Approved"}).eq("entry_id", entry_id).execute()

        log_action(admin.user_id, "APPROVE_ENTRY", 200, f"Approved entry {entry_id}", "items_backup")
        return {"message": f"Entry {entry_id} approved successfully!", "entry_id": entry_id}

    except Exception as e:
        log_action(admin.user_id, "APPROVE_ENTRY", 500, str(e), "items_backup")
        raise HTTPException(status_code=500, detail=str(e))

# ---------------- Reject Entry ----------------
@router.post("/reject_entry/{entry_id}")
async def reject_entry(entry_id: str, admin=Depends(get_current_admin)):
    try:
        entry = supabase.table("items_backup").select("*").eq("entry_id", entry_id).execute().data

        if not entry:
            raise HTTPException(status_code=404, detail="Entry not found")

        supabase.table("items_backup").update({"status": "Rejected"}).eq("entry_id", entry_id).execute()

        log_action(admin.user_id, "REJECT_ENTRY", 200, f"Rejected entry {entry_id}", "items_backup")

        return {"message": f"Entry {entry_id} rejected successfully!", "entry_id": entry_id}

    except Exception as e:
        log_action(admin.user_id, "REJECT_ENTRY", 500, str(e), "items_backup")
        raise HTTPException(status_code=500, detail=str(e))
