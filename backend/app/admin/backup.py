import json
import math
import time
import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from app.core.db import supabase
from app.models.user import UserModels
import pytz

router = APIRouter(prefix="/admin", tags=["Admin Backup Restore"])

logging.basicConfig(level=logging.DEBUG)

BUCKET_NAME = "backups"
CHUNK_SIZE = 2 * 1024 * 1024  # 2MB
MAX_RETRIES = 5
RETRY_BACKOFF = 1  # seconds

# ---------------- Admin check ----------------
def get_current_admin(current_user=Depends(UserModels.get_current_active_user)):
    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

# ---------------- Table helpers ----------------
def get_all_backup_tables():
    try:
        res = supabase.table("pg_catalog.pg_tables").select("tablename").execute()
        return [t["tablename"] for t in res.data if t["tablename"].endswith("_backup")]
    except Exception as e:
        logging.debug(f"[DEBUG] Fallback table list used: {e}")
        return [
            "user_backup",
            "items_backup",
            "matches_table_backup",
            "activity_logs_backup",
            "audit_logs_backup",
        ]

def get_table_columns(table):
    try:
        res = supabase.rpc("get_columns", {"tbl": table}).execute()
        if not res.data:
            return []
        return [c["column_name"] if isinstance(c, dict) else c for c in res.data]
    except Exception as e:
        logging.debug(f"[DEBUG] Failed to fetch columns for {table}: {e}")
        return []

# ---------------- Supabase helpers ----------------
def supabase_upload_chunk(bucket, path, data: bytes):
    for attempt in range(MAX_RETRIES):
        try:
            bucket.upload(path, data)
            logging.debug(f"[UPLOAD] {path} uploaded successfully")
            return
        except Exception as e:
            logging.debug(f"[UPLOAD RETRY] Attempt {attempt+1}/{MAX_RETRIES} for {path}: {e}")
            if attempt == MAX_RETRIES - 1:
                raise
            time.sleep(RETRY_BACKOFF * (2 ** attempt))

def supabase_download_with_retry(bucket, path):
    for attempt in range(MAX_RETRIES):
        try:
            content = bucket.download(path)
            logging.debug(f"[DOWNLOAD] {path} downloaded successfully")
            return content
        except Exception as e:
            logging.debug(f"[DOWNLOAD RETRY] Attempt {attempt+1}/{MAX_RETRIES} for {path}: {e}")
            if attempt == MAX_RETRIES - 1:
                raise
            time.sleep(RETRY_BACKOFF * (2 ** attempt))

# ---------------- Backup ----------------
@router.get("/backup_all")
async def backup_all_tables(admin=Depends(get_current_admin)):
    try:
        tables = get_all_backup_tables()
        backup_data = {}

        for table in tables:
            res = supabase.table(table).select("*").execute()
            backup_data[table] = res.data or []
            logging.info(f"[BACKUP] Table {table}: {len(backup_data[table])} rows")

        backup_data["backup_generated_at"] = datetime.now(pytz.UTC).isoformat()
        backup_bytes = json.dumps(backup_data, indent=4).encode("utf-8")
        total_size = len(backup_bytes)
        num_chunks = math.ceil(total_size / CHUNK_SIZE)

        # Ensure bucket exists
        try:
            buckets = supabase.storage.list_buckets()
            if BUCKET_NAME not in [b.name for b in buckets]:
                supabase.storage.create_bucket(BUCKET_NAME)
                logging.info(f"[BACKUP] Bucket '{BUCKET_NAME}' created.")
        except Exception as e:
            logging.debug(f"[DEBUG] Failed checking/creating bucket: {e}")
            raise HTTPException(status_code=500, detail="Backup failed due to bucket error.")

        bucket = supabase.storage.from_(BUCKET_NAME)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        chunk_files = []

        for i in range(num_chunks):
            start = i * CHUNK_SIZE
            end = start + CHUNK_SIZE
            chunk_data = backup_bytes[start:end]
            filename = f"full_backup_{timestamp}_part{i+1}.json"
            supabase_upload_chunk(bucket, filename, chunk_data)
            chunk_files.append(filename)

        metadata = {"chunks": chunk_files, "generated_at": timestamp}
        supabase_upload_chunk(bucket, f"full_backup_{timestamp}_metadata.json", json.dumps(metadata).encode("utf-8"))

        logging.info(f"[BACKUP] Backup completed successfully with {num_chunks} chunk(s)")
        return {"message": "Backup uploaded successfully", "chunks": num_chunks, "metadata": f"full_backup_{timestamp}_metadata.json"}

    except Exception as e:
        logging.error(f"[DEBUG] Backup error: {e}")
        raise HTTPException(status_code=500, detail="Backup failed.")

# ---------------- Restore ----------------
@router.post("/restore_all")
async def restore_all_tables(admin=Depends(get_current_admin)):
    try:
        bucket = supabase.storage.from_(BUCKET_NAME)

        files = bucket.list()
        metadata_files = [f for f in files if f["name"].endswith("_metadata.json")]
        if not metadata_files:
            raise HTTPException(status_code=404, detail="No backup metadata found")

        latest_metadata = sorted(metadata_files, key=lambda x: x.get("updated_at", ""), reverse=True)[0]["name"]
        metadata_bytes = supabase_download_with_retry(bucket, latest_metadata)
        metadata = json.loads(metadata_bytes.decode("utf-8"))
        chunk_files = metadata.get("chunks", [])

        content_bytes = b""
        for cf in chunk_files:
            content_bytes += supabase_download_with_retry(bucket, cf)
        data = json.loads(content_bytes.decode("utf-8"))

        tables = get_all_backup_tables()
        CHUNK_SIZE_INSERT = 500

        # ---------------- Clear tables safely ----------------
        for table in tables:
            try:
                # Safe delete for all rows, avoids DELETE without WHERE error
                sql = f"DELETE FROM {table} WHERE true;"
                supabase.rpc("run_sql", {"sql": sql}).execute()
                logging.info(f"[RESTORE] Cleared table {table}")
            except Exception as e:
                logging.error(f"[RESTORE] Failed to clear table {table}: {e}")
                raise HTTPException(status_code=500, detail=f"Failed to clear table {table}")

        # ---------------- Insert backup data ----------------
        for table in tables:
            records = data.get(table, [])
            if not records:
                continue
            columns = get_table_columns(table)
            if not columns:
                continue

            cleaned_records = [
                {k: (None if isinstance(v, str) and v.upper() in ["NULL", "NONE"] else v)
                 for k, v in record.items() if k in columns}
                for record in records
            ]

            total = len(cleaned_records)
            chunks = math.ceil(total / CHUNK_SIZE_INSERT)

            for i in range(chunks):
                batch = cleaned_records[i*CHUNK_SIZE_INSERT:(i+1)*CHUNK_SIZE_INSERT]
                supabase.table(table).insert(batch).execute()
                logging.info(f"[RESTORE] Inserted {len(batch)} rows into {table}")

        logging.info("[RESTORE] Restore completed successfully")
        return {"message": "Restore completed successfully!"}

    except Exception as e:
        logging.error(f"[DEBUG] Restore error: {e}")
        raise HTTPException(status_code=500, detail="Restore failed.")
