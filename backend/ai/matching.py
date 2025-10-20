from backend.app.db import supabase
from difflib import SequenceMatcher
from ..app.db import supabase

def similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def get_items_from_supabase(table_name: str):
    """Fetch all items from Supabase lost/found table."""
    res = supabase.table(table_name).select("id, caption").execute()
    return res.data if res.data else []

def find_best_match(new_caption: str, table_name: str = "found_items"):
    """Find the most similar caption in Supabase."""
    database_items = get_items_from_supabase(table_name)
    if not database_items:
        return {"match": None, "score": 0}

    best_item = None
    best_score = 0

    for item in database_items:
        score = similarity(new_caption, item["caption"])
        if score > best_score:
            best_score = score
            best_item = item

    return {"match": best_item, "score": best_score}

