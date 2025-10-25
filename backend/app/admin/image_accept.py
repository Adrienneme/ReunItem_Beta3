from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.responses import JSONResponse
from app.core.db import supabase

router = APIRouter(prefix="/admin", tags=["Admin Image Approvals"])

#Header to specify which user is making the request
def get_current_admin(user_id: str = Header(...)):

    user = supabase.table("user").select("*").eq("id", user_id).execute().data
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    if user[0]["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized.")
    return user[0]


# View Pending Uploads
@router.get("/uploads/pending")
async def admin_pending_uploads(admin=Depends(get_current_admin)):
    pending_uploads = (
        supabase.table("items")
        .select("*")
        .eq("status", "pending approval")
        .execute()
        .data
    )

    if not pending_uploads:
        return JSONResponse(
            content={"message": "No pending uploads found."},
            status_code=status.HTTP_404_NOT_FOUND
        )

    return {"pending_uploads": pending_uploads}


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
