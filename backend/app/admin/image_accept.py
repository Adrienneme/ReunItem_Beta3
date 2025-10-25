from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.responses import JSONResponse
from app.core.db import supabase
from app.schemas import ItemSchemas

router = APIRouter(prefix="/admin", tags=["Admin Image Approvals"])




#Header to specify which user is making the request
def get_current_admin(role: str = Header(...)):
    if role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return {"role": "admin"}


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
    # Fetch the entry by ID
    entry = supabase.table("items").select("*").eq("entry_id", entry_id).execute().data

    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found.")

    # Update status to approved
    supabase.table("items").update({"status": "approved"}).eq("entry_id", entry_id).execute()

    return {"message": "Entry approved successfully!", "entry_id": entry_id}
