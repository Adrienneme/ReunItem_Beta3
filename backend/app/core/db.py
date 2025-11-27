import os
from dotenv import load_dotenv
from supabase import create_client, Client
from httpx import Client as HTTPXClient, Timeout, Retry, Limits

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# -----------------------------
# FIX #1 — Stable HTTP Client

timeout = Timeout(
    connect=30.0,
    read=60.0,
    write=60.0,
    pool=30.0,
)

retry = Retry(
    max_retries=5,
    backoff_factor=0.5,
    max_backoff=8,
)

limits = Limits(
    max_connections=20,
    max_keepalive_connections=10,
)

http_client = HTTPXClient(
    timeout=timeout,
    limits=limits,
    transport=None,  # let httpx manage based on platform
)

# -----------------------------
# Create Supabase Client

supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY,
    http_client=http_client,
)
