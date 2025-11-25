from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from fastapi.responses import StreamingResponse
from app.core.db import supabase
from app.models.user import UserModels
import json
from io import BytesIO
from datetime import datetime
import pytz
import os

router = APIRouter(
    prefix="/admin",
    tags=["Admin Backup Restore"]
)

# -------------- ADMIN CHECK ----
def get_current_admin(current_user=Depends(UserModels.get_current_active_user)):
    if current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required."
        )
    return current_user

# ------------- Helper for chunked inserts ------
def chunk_list(lst, chunk_size):
    """Yield successive chunk_size-sized chunks from lst."""
    for i in range(0, len(lst), chunk_size):
        yield lst[i:i + chunk_size]

# ============== BackUp all tables =============
@router.get("/backup_all")
async def backup_all_tables(admin=Depends(get_current_admin)):
    try:
        tables = ["activity_logs", "audit_logs", "items", "matches_table", "user"]
        backup_data = {}

        for table in tables:
            res = supabase.table(table).select("*").execute()
            backup_data[table] = res.data or []

        backup_data["backup_generated_at"] = datetime.now(pytz.UTC).isoformat()

        buffer = BytesIO()
        buffer.write(json.dumps(backup_data, indent=4).encode("utf-8"))
        buffer.seek(0)

        return StreamingResponse(
            buffer,
            media_type="application/json",
            headers={
                "Content-Disposition":
                f"attachment; filename=full_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            }
        )
    except Exception as e:
        print("Backup error:", e)
        raise HTTPException(status_code=500, detail="Backup failed.")

# ================ RESTORE ALL TABLES (With batch insert) ===============
@router.post("/restore_all")
async def restore_all_tables(
    admin=Depends(get_current_admin),
    backup_file: UploadFile = File(...)
):
    ENV = os.getenv("ENV", "production")
    if ENV == "production":
        raise HTTPException(403, "Restore is disabled in production environment.")

    allowed_tables = ["activity_logs", "audit_logs", "items", "matches_table", "user"]
    BATCH_SIZE = 5000  # Insert 5000 rows per batch

    try:
        data = json.loads((await backup_file.read()).decode("utf-8"))

        for table_name, rows in data.items():
            if table_name == "backup_generated_at":
                continue

            if table_name not in allowed_tables:
                raise HTTPException(400, f"Invalid table in backup: {table_name}")

            # Clean IDs
            cleaned_rows = []
            for row in rows:
                row.pop("id", None)
                cleaned_rows.append(row)

            # Delete old data
            supabase.table(table_name).delete().neq("id", 0).execute()

            # Batch insert
            for batch in chunk_list(cleaned_rows, BATCH_SIZE):
                if batch:
                    supabase.table(table_name).insert(batch).execute()

            print(f"[INFO] Restored {len(cleaned_rows)} rows into {table_name}")

        return {"message": "Database restored successfully (batch insert)."}
    except Exception as e:
        print("Restore error:", e)
        raise HTTPException(status_code=500, detail=f"Restore failed: {str(e)}")
