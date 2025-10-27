from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from app.core.db import supabase
from app.models.user import UserModels
from app.schemas import ItemSchemas

router = APIRouter(
    prefix="/admin",
    tags=["Admin Image Approvals"]
)


#Reuse existing JWT system
def get_current_admin(current_user = Depends(UserModels.get_current_active_user)):
   
    if current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admnin access required."
        )
    return current_user



# View Pending Uploads

@router.get("/uploads/pending")
async def admin_pending_uploads(admin=Depends(get_current_admin)):
    pending_uploads = (
        supabase.table("items")
        .select("*")
        .eq("status", "Pending Approval")
        .execute()
        .data
    )

    if not pending_uploads:
        return JSONResponse(
            content={"message": "No pending uploads found."},
            status_code=status.HTTP_404_NOT_FOUND
        )

    return pending_uploads



# Approve Entry

@router.post("/approve_entry/{entry_id}")
async def approve_entry(entry_id: str, admin=Depends(get_current_admin)):
    entry = supabase.table("items").select("*").eq("entry_id", entry_id).execute().data

    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found.")

    supabase.table("items").update({"status": "Approved"}).eq("entry_id", entry_id).execute()

    return {"message": f"Entry {entry_id} approved successfully!", "entry_id": entry_id}
