from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from fastapi.responses import StreamingResponse
from app.core.db import supabase
from app.models.user import UserModels
import json
from io import BytesIO
from datetime import datetime
import pytz

router = APIRouter(
    prefix="/admin",
    tags=["Admin Backup Restore"]
)

# ------------------- ADMIN CHECK -------------------
def get_current_admin(current_user=Depends(UserModels.get_current_active_user)):
    if current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required."
        )
    return current_user


# =================== BACKUP ALL TABLES =====================
@router.get("/backup_all")
async def backup_all_tables(admin=Depends(get_current_admin)):
    try:
        tables = ["items", "matches_table"]

        backup_data = {}

        for table in tables:
            res = supabase.table(table).select("*").execute()
            backup_data[table] = res.data or []

        backup_data["backup_generated_at"] = datetime.now(pytz.UTC).isoformat()

        # Convert to JSON file in memory
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


# =================== RESTORE ALL TABLES =====================
@router.post("/restore_all")
async def restore_all_tables(
    admin=Depends(get_current_admin),
    backup_file: UploadFile = File(...)
):
    try:
        # Load backup JSON
        data = json.loads((await backup_file.read()).decode("utf-8"))

        tables = ["items", "matches_table"]

        for table in tables:
            if table in data:

                rows = []

                # Clean IDs before re-inserting
                for row in data[table]:
                    row.pop("id", None)
                    rows.append(row)

                # Delete old data
                supabase.table(table).delete().neq("id", 0).execute()

                # Insert rows
                for row in rows:
                    supabase.table(table).insert(row).execute()

        return {"message": "Database restored successfully."}

    except Exception as e:
        print("Restore error:", e)
        raise HTTPException(status_code=500, detail="Restore failed.")  
