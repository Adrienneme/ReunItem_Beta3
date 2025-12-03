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
CHUNK_SIZE = 2 * 1024 * 1024  # 2MB for chunk download, size limit to avoid timeeout
MAX_RETRIES = 5 #to handle upload error due to slow internet/connection timeout
RETRY_BACKOFF = 1  # seconds, to prevent immediate retry avoiding overload and repeated failure

# ---------------- Admin check ----------------
def get_current_admin(current_user=Depends(UserModels.get_current_active_user)):
    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

# ---------------- Table helpers ----------------
def get_all_backup_tables():
   #specify all tables to backup/restore 
        
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
        #calls PostgresSql get_column function then send paarameter "tbl":table into RPC function
        #(create or replace function get_table_schema(tbl text))
        #Function created from supabase SQL editor "get_table_schema"
        #in "get_table_schema" "table" returns list of rows with these feilds
        #"tbl" specifies the table that "language sql" will filter(column_name, data_type, is_nullable, column_name,is_identity)
        #in pks As( : it find the primary key(index, column definition, column nam)e
        #return column_name from pks(primary key set)
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
        #using the max_retries and retsy_backof earlier
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
        tables = get_all_backup_tables() #return list of tables to backup from helper function
        backup_data = {} #is a disctionary which will hold table name

        for table in tables: #loops trhough all tables specified by the helper function
            res = supabase.table(table).select("*").execute()
            backup_data[table] = res.data or []
            logging.info(f"[BACKUP] Table {table}: {len(backup_data[table])} rows")

        backup_data["backup_generated_at"] = datetime.now(pytz.UTC).isoformat() #utc tiimestamp for backup generation time
         # Convert to JSON and split into chunks
        backup_bytes = json.dumps(backup_data, indent=4).encode("utf-8")
        total_size = len(backup_bytes) #identify total chunck
        num_chunks = math.ceil(total_size / CHUNK_SIZE) #How many chunks needed(files to be generated)

        # Ensure bucket exists
        try:
            buckets = supabase.storage.list_buckets()#list all buckets in supabase to check
            if BUCKET_NAME not in [b.name for b in buckets]:
                #creates a new bucket if not exists 
                #"buckets" specified at the top
                supabase.storage.create_bucket(BUCKET_NAME)
                logging.info(f"[BACKUP] Bucket '{BUCKET_NAME}' created.")
        except Exception as e:
            logging.debug(f"[DEBUG] Failed checking/creating bucket: {e}")
            raise HTTPException(status_code=500, detail="Backup failed due to bucket error.")

        bucket = supabase.storage.from_(BUCKET_NAME) #returns a supabase storage object
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        chunk_files = [] #store all backupchunck name for metadata

        for i in range(num_chunks):
            start = i * CHUNK_SIZE #starting byte of chunk
            end = start + CHUNK_SIZE    #ending byte of chunk
            chunk_data = backup_bytes[start:end]
            filename = f"full_backup_{timestamp}_part{i+1}.json"
            supabase_upload_chunk(bucket, filename, chunk_data) #upload all chunks
            chunk_files.append(filename)
#create metadata file
        metadata = {"chunks": chunk_files, "generated_at": timestamp}
        #chunks - list of all chunk files
        
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
        #Get supabase bucket

        # Get latest backup metadata
        files = bucket.list() #check all bucket in list
        metadata_files = [f for f in files if f["name"].endswith("_metadata.json")]
        #will use the metadata file
        if not metadata_files:
            raise HTTPException(status_code=404, detail="No backup metadata found")

        latest_metadata = sorted(metadata_files, key=lambda x: x.get("updated_at", ""), reverse=True)[0]["name"]
        #will check the metadata in row 0 , since everything in row 0 is the latest one
        metadata_bytes = supabase_download_with_retry(bucket, latest_metadata)
        #download the metadata file, retry logic specifieds in the helper function
        metadata = json.loads(metadata_bytes.decode("utf-8"))
        #bytes to jason dictionary
        chunk_files = metadata.get("chunks", [])
        #contains list of backup chunk from metadatada

        # Download all chunk data
        content_bytes = b""
        for cf in chunk_files:
            content_bytes += supabase_download_with_retry(bucket, cf) #download
        data = json.loads(content_bytes.decode("utf-8"))

        tables = get_all_backup_tables() #list of tables to restore, "tables" calling from helper function
        CHUNK_SIZE_INSERT = 500

        # ---------------- Clear tables safely ----------------
        #
        for table in tables:
            try:
                # Attempt to delete all rows
                sql = f"DELETE FROM {table} WHERE true;" 
                #Builds an sql query taht will delete all rows specified from tables
                result = supabase.rpc("run_sql", {"sql": sql}).execute()
                #the one which will run the sql quesry 
                logging.info(f"[RESTORE] Cleared table {table}") #debugg

                # If table was empty, just proceed 
                if result is None or not hasattr(result, "data") or not result.data:
                    logging.debug(f"[RESTORE] Table {table} empty or delete had no effect, proceeding...")

            except Exception as e:#if try failed
                logging.warning(f"[RESTORE] Standard DELETE failed for {table}: {e}")
                #  truncate with cascade to ensure table is empty
                try:
                    sql = f"TRUNCATE TABLE {table} CASCADE;"
                    #force remove rows from specified table and all dependent rows
                    supabase.rpc("run_sql", {"sql": sql}).execute()
                    logging.info(f"[RESTORE] Fallback TRUNCATE applied to {table}")
                except Exception as ex:
                    logging.error(f"[RESTORE] Failed to force-clear table {table}: {ex}")
                    raise HTTPException(status_code=500, detail=f"Failed to clear table {table}")

        # ---------------- Insert backup data ----------------
        for table in tables: #list of all tables to restore
            records = data.get(table, []) 
            #retrives the rows for each table from downlaoded bakcup
            #"data" reference line 165
            if not records: #if table has no record, then skip
                continue
            columns = get_table_columns(table) 
            #fetches the current column from database, to ensure restoring only what is in databse
            if not columns:
                continue

            cleaned_records = [
                {k: (None if isinstance(v, str) and v.upper() in ["NULL", "NONE"] else v)
                 #if "NONE" in python, supabase will store as 'NULL'
                 for k, v in record.items() if k in columns}
                #k is column name, v is data value
                #ensure inserting only columns that exist in current database schema
                #Extra columns in the backup that no longer exist in database are ignored
                for record in records
                #record is a dictionary of row values(keys are column names, values are the data)
            ]
            #calculate total rows and chunks needed for insertion
            total = len(cleaned_records)
            chunks = math.ceil(total / CHUNK_SIZE_INSERT)

            for i in range(chunks):
                batch = cleaned_records[i*CHUNK_SIZE_INSERT:(i+1)*CHUNK_SIZE_INSERT]
                supabase.table(table).insert(batch).execute()
                #insert multiple rows at once
                logging.info(f"[RESTORE] Inserted {len(batch)} rows into {table}")

        logging.info("[RESTORE] Restore completed successfully")
        return {"message": "Restore completed successfully!"}

    except Exception as e:
        logging.error(f"[DEBUG] Restore error: {e}")
        raise HTTPException(status_code=500, detail="Restore failed.")
    
    #notes
    #"tables" is the list of all tables to backup/restore
    #table is handling these restore table 1 by 1

    #issues encountereq during testing
    #1. during restore, some table failed to clear using DELETE FROM , so added a fallback using TRUNCATE TABLE CASCADE
    #2. during backup, supabase bucket creation sometimes failed due to network issues, added retry logic for upload/download functions
    #3. During cleaning , error failed rows does not exist, so added the "continue" statement
    #4. during insert, some column in backup data no longer exists in current database schema, so added column filtering based on current schema (Avoid  postgress error)
    #5. during upload/download of large backup files, connection timeout errors occurred, so added chunking and retry logic
    
    
    