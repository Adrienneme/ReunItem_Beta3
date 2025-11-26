from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from app.core.db import supabase
from app.models.user import UserModels
from datetime import datetime
from io import BytesIO
import pytz, json

router = APIRouter(prefix="/admin", tags=["Admin Backup Restore"])

# ------------------- ADMIN CHECK -------------------
def get_current_admin(current_user=Depends(UserModels.get_current_active_user)):
    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user


# ------------------- AUTO-DETECT TABLES ----------------
def get_all_backup_tables():
    """Fetch all tables ending with '_backup' automatically"""
    try:
        res = supabase.table("pg_catalog.pg_tables").select("tablename").execute()
        tables = [t["tablename"] for t in res.data if t["tablename"].endswith("_backup")]
        return tables
    except Exception as e:
        print("Error fetching tables:", e)
        # fallback to manual list
        return ["user_backup", "items_backup", "matches_table_backup", "activity_logs_backup", "audit_logs_backup"]

def get_table_columns(table_name: str):
    """Fetch column names for a table"""
    try:
        res = supabase.table("information_schema.columns")\
            .select("column_name")\
            .eq("table_name", table_name).execute()
        return [c["column_name"] for c in res.data] if res.data else []
    except Exception as e:
        print(f"Error fetching columns for {table_name}:", e)
        return []
# ------------------- BACKUP -------------------
@router.get("/backup_all")
async def backup_all_tables(admin=Depends(get_current_admin)):
    try:
        tables = get_all_backup_tables()
        backup_data = {}

        for table in tables:
            res = supabase.table(table).select("*").execute()
            backup_data[table] = res.data or []

        backup_data["backup_generated_at"] = datetime.now(pytz.UTC).isoformat()

        buffer = BytesIO()
        buffer.write(json.dumps(backup_data, indent=4).encode("utf-8"))
        buffer.seek(0)

        filename = f"full_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

        return StreamingResponse(
            buffer,
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    except Exception as e:
        print("Backup error:", e)
        raise HTTPException(status_code=500, detail="Backup failed.")

# ------------------- RESTORE ----------------
@router.post("/restore_all")
async def restore_all_tables(
    backup_file: UploadFile = File(...),
    admin=Depends(get_current_admin)
):
    if not backup_file.filename.endswith(".json"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    contents = await backup_file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty backup file")

    try:
        data = json.loads(contents)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file")

    tables = get_all_backup_tables()
    print("Received file:", backup_file.filename, "size:", len(contents))

    for table in tables:
        if table not in data:
            print(f"Skipping table {table}, not in backup file")
            continue

        records = data[table]
        if not records:
            print(f"No records for table {table}, skipping")
            continue

        # Fetch actual columns from table
        columns = get_table_columns(table)
        if not columns:
            print(f"No columns detected for {table}, skipping")
            continue

        # Clean records
        cleaned_records = []
        for record in records:
            cleaned = {}
            for k, v in record.items():
                if k not in columns:
                    continue  # skip unknown columns
                if isinstance(v, str) and v.upper() in ["NONE", "NULL"]:
                    cleaned[k] = None
                else:
                    cleaned[k] = v
            if cleaned:
                cleaned_records.append(cleaned)

        # Delete existing rows if table has a primary key
        if "id" in columns:
            supabase.table(table).delete().neq("id", None).execute()
        else:
            print(f"Skipping delete for {table}, no primary key found")

        # Insert cleaned records
        if cleaned_records:
            supabase.table(table).insert(cleaned_records).execute()
            print(f"Inserted {len(cleaned_records)} rows into {table}")

    return {"message": "Restore completed successfully!"}