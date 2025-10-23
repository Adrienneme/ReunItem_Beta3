from ..app.db import supabase
from difflib import SequenceMatcher
from backend.app.db import supabase  

def similarity(a: str, b: str) -> float:
    ##Return similarity score between two strings
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def get_items_from_supabase(table_name: str, user_id: str = None):
    #Fetch all items from a Supabase table, optionally filtered by user_id
    query = supabase.table(table_name).select("id, caption")

    if user_id:
        query = query.eq("user_id", user_id)  # Filter items uploaded by that user

    res = query.execute()
    return res.data if res.data else []


def find_top_matches(new_caption: str, table_name: str = "found_items", top_n: int = 3):
    #Find the top N most similar captions in the target Supabase table
    database_items = get_items_from_supabase(table_name)
    if not database_items:
        return {"matches": [], "count": 0}

    # Compute similarity scores
    scored_items = []
    for item in database_items:
        score = similarity(new_caption, item["caption"])
        scored_items.append({
            "id": item["id"],
            "caption": item["caption"],
            "score": round(score, 3)
        })

    # Sort by score (descending)
    scored_items.sort(key=lambda x: x["score"], reverse=True)

    return {"matches": scored_items[:top_n], "count": len(scored_items[:top_n])}

def compare_lost_to_found(user_id: str, top_n: int = 3):
    """Compare only this user's lost items to found_items"""
    lost_items = get_items_from_supabase("lost_items", user_id=user_id)
    results = []

    for lost in lost_items:
        caption = lost["caption"]
        matches = find_top_matches(caption, table_name="found_items", top_n=top_n)
        results.append({
            "lost_id": lost["id"],
            "lost_caption": caption,
            "matches": matches["matches"]
        })

    return results

