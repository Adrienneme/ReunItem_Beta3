import json
import math
import time
import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from app.core.db import supabase
from app.models.user import UserModels
import pytz #Python lib timezone

router = APIRouter(prefix="/admin", tags=["Admin Backup Restore"])

logging.basicConfig(level=logging.DEBUG)

BUCKET_NAME = "backups" # call function whenever "backups" is needed, for easier bucket change also
CHUNK_SIZE = 2 * 1024 * 1024  # 2MB for chunk download, size limit to avoid timeout
MAX_RETRIES = 5 #to handle upload error due to slow internet/connection timeout
RETRY_BACKOFF = 1  # seconds, to prevent immediate retry avoiding overload and repeated failure

# ---------------- Admin check ----------------
def get_current_admin(current_user=Depends(UserModels.get_current_active_user)):
    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

# ---------------- Table helpers ----------------
def get_all_backup_tables():
    # specify all tables to backup/restore 
    return [
        "user",
        "items",
        "matches_table",
        "activity_logs",
        "audit_logs",
    ]

def get_table_columns(table):
    try:
        res = supabase.rpc("get_columns", {"tbl": table}).execute() 
        # calls PostgresSql get_column function then send parameter "tbl":table into RPC function
        # (create or replace function get_table_schema(tbl text))
        # Function created from supabase SQL editor "get_table_schema"
        # in "get_table_schema" "table" returns list of rows with these fields
        # "tbl" specifies the table that "language sql" will filter(column_name, data_type, is_nullable, column_name,is_identity)
        # in pks As( : it find the primary key(index, column definition, column name)
        # return column_name from pks(primary key set)
        if not res.data:
            return []
        return [c["column_name"] if isinstance(c, dict) else c for c in res.data]
    except Exception as e:
        logging.debug(f"[DEBUG] Failed to fetch columns for {table}: {e}")
        return []

# ---------------- Supabase helpers ----------------
def supabase_upload_chunk(bucket, path, data: bytes): #where to upload, path of file, data in bytes(actual file)
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

        # Fetch table data
        for table in tables:
            res = supabase.table(table).select("*").execute()
            backup_data[table] = res.data or []
            logging.info(f"[BACKUP] Table {table}: {len(backup_data[table])} rows")

        backup_data["backup_generated_at"] = datetime.now(pytz.UTC).isoformat()
        backup_bytes = json.dumps(backup_data, indent=4).encode("utf-8")
        total_size = len(backup_bytes)
        num_chunks = math.ceil(total_size / CHUNK_SIZE)  # split into chunks

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
        now = datetime.now()
        timestamp = now.strftime("%b_%d_%Y_Time_%I_%M_%S%p")  # e.g., Dec_06_2025_Time_11_30_45AM
        chunk_files = []

        # Upload chunks
        for i in range(num_chunks):
            start = i * CHUNK_SIZE
            end = start + CHUNK_SIZE
            chunk_data = backup_bytes[start:end]
            chunk_mb = math.ceil(len(chunk_data) / (1024*1024))
            filename = f"full_backup_{timestamp}_part{i+1}.json"  # removed _XMB from filename
            supabase_upload_chunk(bucket, filename, chunk_data)
            chunk_files.append(filename)

        # Create metadata referencing all chunks
        metadata = {"chunks": chunk_files, "generated_at": timestamp}
        metadata_filename = f"full_backup_{timestamp}_metadata.json"  # removed total size from metadata filename
        supabase_upload_chunk(bucket, metadata_filename, json.dumps(metadata).encode("utf-8"))

        logging.info(f"[BACKUP] Backup completed successfully with {num_chunks} chunk(s)")
        return {"message": "Backup uploaded successfully", "chunks": num_chunks, "metadata": metadata_filename}

    except Exception as e:
        logging.error(f"[DEBUG] Backup error: {e}")
        raise HTTPException(status_code=500, detail="Backup failed.")





# ---------------- Restore ----------------
@router.post("/restore_all")
async def restore_all_tables(admin=Depends(get_current_admin)):
    try:
        bucket = supabase.storage.from_(BUCKET_NAME)
        # Get supabase bucket

        # Get latest backup metadata
        files = bucket.list()  # check all bucket in list
        metadata_files = [f for f in files if f["name"].endswith("_metadata.json")]
        # will use the metadata file
        if not metadata_files:
            raise HTTPException(status_code=404, detail="No backup metadata found")

        latest_metadata = sorted(
            metadata_files, key=lambda x: x.get("updated_at", ""), reverse=True
        )[0]["name"]
        # will check the metadata in row 0 , since everything in row 0 is the latest one
        metadata_bytes = supabase_download_with_retry(bucket, latest_metadata)
        # download the metadata file, retry logic specified in the helper function
        metadata = json.loads(metadata_bytes.decode("utf-8"))
        # bytes to json dictionary
        chunk_files = metadata.get("chunks", [])
        # contains list of backup chunk from metadata

        # Download all chunk data
        content_bytes = b""
        for cf in chunk_files:
            content_bytes += supabase_download_with_retry(bucket, cf)  # download
        data = json.loads(content_bytes.decode("utf-8"))

        tables = get_all_backup_tables()  # list of tables to restore
        CHUNK_SIZE_INSERT = 500

        # ---------------- Clear tables safely ----------------
        for table in tables:
            safe_table = f'"{table}"'  # wrap table names in double quotes

            try:
                # Attempt to delete all rows
                sql = f"DELETE FROM {safe_table} WHERE true;"
                result = supabase.rpc("run_sql", {"sql": sql}).execute()
                logging.info(f"[RESTORE] Cleared table {table}")

                if result is None or not hasattr(result, "data") or not result.data:
                    logging.debug(
                        f"[RESTORE] Table {table} empty or delete had no effect, proceeding..."
                    )

            except Exception as e:
                logging.warning(f"[RESTORE] Standard DELETE failed for {table}: {e}")
                # fallback using truncate
                try:
                    sql = f"TRUNCATE TABLE {safe_table} CASCADE;"
                    supabase.rpc("run_sql", {"sql": sql}).execute()
                    logging.info(f"[RESTORE] Fallback TRUNCATE applied to {table}")
                except Exception as ex:
                    logging.error(f"[RESTORE] Failed to force-clear table {table}: {ex}")
                    raise HTTPException(
                        status_code=500, detail=f"Failed to clear table {table}"
                    )

        # ---------------- Insert backup data ----------------
        for table in tables:  # list of all tables to restore
            records = data.get(table, [])
            # retrieves the rows for each table from downloaded backup
            if not records:  # if table has no record, then skip
                continue
            columns = get_table_columns(table)
            # fetches the current column from database, to ensure restoring only what is in database
            if not columns:
                continue

            cleaned_records = [
                {
                    k: (None if isinstance(v, str) and v.upper() in ["NULL", "NONE"] else v)
                    # if "NONE" in python, supabase will store as 'NULL'
                    for k, v in record.items() if k in columns
                }
                # k is column name, v is data value
                # ensure inserting only columns that exist in current database schema
                # Extra columns in the backup that no longer exist in database are ignored
                for record in records
                # record is a dictionary of row values(keys are column names, values are the data)
            ]

            # calculate total rows and chunks needed for insertion
            total = len(cleaned_records)
            chunks = math.ceil(total / CHUNK_SIZE_INSERT)

            for i in range(chunks):
                batch = cleaned_records[i * CHUNK_SIZE_INSERT : (i + 1) * CHUNK_SIZE_INSERT]
                supabase.table(table).insert(batch).execute()
                # insert multiple rows at once
                logging.info(f"[RESTORE] Inserted {len(batch)} rows into {table}")

        logging.info("[RESTORE] Restore completed successfully")
        return {"message": "Restore completed successfully!"}

    except Exception as e:
        logging.error(f"[DEBUG] Restore error: {e}")
        raise HTTPException(status_code=500, detail="Restore failed.")
    
    
# ================= Display metadata list of backups available =================
@router.get("/backup_list")
async def list_backup_metadata(admin=Depends(get_current_admin)):
    try:
        bucket = supabase.storage.from_(BUCKET_NAME)
        files = bucket.list()

        # Only return metadata files
        metadata_files = [f["name"] for f in files if f["name"].endswith("_metadata.json")]

        # Sort by timestamp in filename (newest first)
        def extract_timestamp(name):
            # e.g., full_backup_Dec_06_2025_Time_11_30_45AM_metadata.json
            parts = name.split("_")
            try:
                if "Time" in parts:
                    time_index = parts.index("Time")
                    date_part = "_".join(parts[2:time_index])  # Dec_06_2025
                    time_part = "_".join(parts[time_index + 1:time_index + 4])  # 11_30_45AM
                    dt = datetime.strptime(f"{date_part}_{time_part}", "%b_%d_%Y_%I_%M_%S%p")
                    return dt.timestamp()
                else:
                    return 0
            except Exception as e:
                logging.debug(f"[DEBUG] Failed to parse timestamp from {name}: {e}")
                return 0

        # Newest backups first
        metadata_files.sort(key=extract_timestamp, reverse=True)

        return {"backups": metadata_files}

    except Exception as e:
        logging.error(f"[DEBUG] List backup error: {e}")
        raise HTTPException(status_code=500, detail="Failed to list backups")

# notes
# "tables" is the list of all tables to backup/restore
# table is handling these restore table 1 by 1

# issues encountered during testing
# 1. during restore, some table failed to clear using DELETE FROM, so added a fallback using TRUNCATE TABLE CASCADE
# 2. during backup, supabase bucket creation sometimes failed due to network issues, added retry logic for upload/download functions
# 3. During cleaning, error failed rows does not exist, so added the "continue" statement
# 4. during insert, some column in backup data no longer exists in current database schema, so added column filtering based on current schema (Avoid postgres error)
# 5. during upload/download of large backup files, connection timeout errors occurred, so added chunking and retry logic
