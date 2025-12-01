from app.core import supabase
from fastapi import HTTPException

def get_logs():
  response = supabase.table("audit_logs").select("*").order("created_at", desc=True).execute()
  if not response.data:
      raise HTTPException(status_code=404, detail="No Logs Found")

  return response.data


def log_action(actor_id: str | None, action: str, status: str, details: str, entity: str):
    try:
        if not actor_id or actor_id == "00000000-0000-0000-0000-000000000000":
            actor_id = actor_id
            full_name = "SYSTEM"
            user_role = "system"
        else:
            user_res = supabase.table("user").select(
                "first_name, last_name, role"
            ).eq("user_id", actor_id).execute()

            if user_res.data:
                u = user_res.data[0]
                full_name = f"{u.get('first_name', '')} {u.get('last_name', '')}".strip()
                user_role = u.get("role")
            else:
                full_name = None
                user_role = None

        supabase.table("audit_logs").insert({
            "actor_id": actor_id,
            "user": full_name,
            "role": user_role,
            "action": action,
            "status": status,
            "details": details,
            "entity": entity
        }).execute()

    except Exception as e:
        print("AUDIT LOGGING ERROR:", str(e))

