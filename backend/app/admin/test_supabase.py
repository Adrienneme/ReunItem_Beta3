import os
import httpx
from dotenv import load_dotenv

# Load .env
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  # service role key

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
}

try:
    r = httpx.get(f"{SUPABASE_URL}/rest/v1/", headers=headers, timeout=30)
    print("Status code:", r.status_code)
    print("Response:", r.text)
except httpx.RequestError as e:
    print("Request failed:", e)
