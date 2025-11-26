from app.core import supabase
from fastapi import HTTPException

def get_logs():
  response = supabase.table("audit_logs").select("*").order("created_at", desc=True).execute()
  if not response.data:
      raise HTTPException(status_code=404, detail="No Logs Found")

  return response.data

