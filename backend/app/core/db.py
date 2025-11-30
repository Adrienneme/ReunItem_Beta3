import os
import time
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# -----------------------------
# Create Supabase Client
# -----------------------------
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# -----------------------------
# Manual retry wrapper for Supabase calls
# -----------------------------
def supabase_with_retry(func, *args, max_retries=5, backoff=0.5, **kwargs):
    """
    Wraps a Supabase function call with retry logic.
    
    Example:
        supabase_with_retry(supabase.table("users").select, "*")
    """
    for attempt in range(max_retries):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            time.sleep(backoff * (attempt + 1))  # simple linear backoff

# -----------------------------
# Example Usage
# -----------------------------
# data = supabase_with_retry(supabase.table("users").select, "*")
