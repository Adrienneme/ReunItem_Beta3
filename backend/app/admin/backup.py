from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from app.core.db import supabase
from app.models.user import UserModels
from datetime import datetime
from io import BytesIO
import pytz
import json
import math

router = APIRouter(prefix="/admin", tags=["Admin Backup Restore"])

# ============================================================
# ADMIN CHECK
# ============================================================
def get_current_admin(current_user=Depends(UserModels.get_current_active_user)):
    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

# ============================================================
# TABLE LIST
# ============================================================
def get_all_backup_tables():
    """Auto-detect tables ending with _backup"""
    try:
        res = supabase.table("pg_catalog.pg_tables").select("tablename").execute()
        return [t["tablename"] for t in res.data if t["tablename"].endswith("_backup")]
    except:
        # fallback
        return [
            "user_backup",
            "items_backup",
            "matches_table_backup",
            "activity_logs_backup",
            "audit_logs_backup",
        ]

# ============================================================
# GET TABLE COLUMNS
# ============================================================
def get_table_columns(table):
    """Return list of column names"""
    try:
        res = supabase.rpc("get_columns", {"tbl": table}).execute()
        if not res.data:
            return []
        columns = []
        for c in res.data:
            if isinstance(c, dict) and "column_name" in c:
                columns.append(c["column_name"])
            elif isinstance(c, str):
                columns.append(c)
        return columns
    except:
        return []

# ============================================================
# BACKUP (CHUNKED)
# ============================================================
# ------------------- BACKUP -------------------
@router.get("/backup_all")
async def backup_all_tables(admin=Depends(get_current_admin)):
    try:
        # Get all backup tables
        tables = get_all_backup_tables()
        backup_data = {}

        for table in tables:
            # Fetch all rows at once
            res = supabase.table(table).select("*").execute()
            backup_data[table] = res.data or []
            print(f"[BACKUP] Table {table}: {len(backup_data[table])} rows")

        # Add timestamp
        backup_data["backup_generated_at"] = datetime.now(pytz.UTC).isoformat()

        # Convert to JSON and send as file
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

# ============================================================
# RESTORE (CHUNKED + SAFE UPSERT)
# ============================================================
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
    print(f"[RESTORE] Tables to restore: {tables}")

    CHUNK_SIZE = 500  # stable chunk size

    # ----- PK mapping -----
    PRIMARY_KEYS = {
        "audit_logs_backup": "audit_id",
        "items_backup": "entry_id",
        "matches_table_backup": "match_id",
        "user_backup": "user_id",
    }

    for table in tables:
        records = data.get(table, [])
        print(f"\n[RESTORE] Table {table}: {len(records)} records")

        if not records:
            print("  ↳ No records, skipping")
            continue

        columns = get_table_columns(table)
        if not columns:
            print("  ↳ No columns detected, skipping")
            continue

        # ---------------- CLEAN DATA ----------------
        cleaned_records = []
        for record in records:
            cleaned = {
                k: (None if isinstance(v, str) and v.upper() in ["NULL", "NONE"] else v)
                for k, v in record.items()
                if k in columns
            }
            if cleaned:
                cleaned_records.append(cleaned)

        print(f"  ↳ Cleaned: {len(cleaned_records)}")
        if not cleaned_records:
            continue

        # ---------------- USE CORRECT PRIMARY KEY ----------------
        pk = PRIMARY_KEYS.get(table)
        print(f"  ↳ PK used for upsert: {pk}")

        # ---------------- PROCESS IN CHUNKS ----------------
        total = len(cleaned_records)
        chunks = math.ceil(total / CHUNK_SIZE)

        for i in range(chunks):
            batch = cleaned_records[i * CHUNK_SIZE:(i + 1) * CHUNK_SIZE]
            print(f"  ↳ Restoring chunk {i+1}/{chunks} ({len(batch)} rows)")

            # ---------------- SAFE UPSERT → INSERT FALLBACK ----------------
            try:
                if pk:
                    supabase.table(table).upsert(batch, on_conflict=pk).execute()
                    print("    ✓ Upsert success")
                else:
                    supabase.table(table).insert(batch).execute()
                    print("    ✓ Insert success (no PK)")
            except Exception as e:
                print(f"    ⚠ Failed to restore chunk for {table}: {e}")
                supabase.table(table).insert(batch).execute()
                print("    ✓ Insert fallback success")

    print("\n[RESTORE] Restore completed.")
    return {"message": "Restore completed successfully!"}
