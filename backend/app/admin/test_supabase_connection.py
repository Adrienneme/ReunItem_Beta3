import os
import httpx
from dotenv import load_dotenv

# Load .env file
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  # service_role key

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Missing SUPABASE_URL or SUPABASE_KEY in .env")
    exit()

# Target table to test
TABLE_NAME = "user(Original_Unchanged)"  # <-- change this if needed

endpoint = f"{SUPABASE_URL}/rest/v1/{TABLE_NAME}"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
}

print("🔍 Testing connection to:", endpoint)

try:
    r = httpx.get(endpoint, headers=headers, timeout=30)
    print("\n=== RESPONSE STATUS ===")
    print(r.status_code)

    print("\n=== RESPONSE BODY ===")
    print(r.text[:500] + "..." if len(r.text) > 500 else r.text)

except httpx.ReadTimeout:
    print("❌ Timeout: Supabase did not respond in time.")
except httpx.ConnectTimeout:
    print("❌ Cannot connect: connection timeout.")
except httpx.RequestError as e:
    print("❌ Request failed:", e)
