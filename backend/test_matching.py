#for testing, will be deleted
from backend.ai.matching import find_best_match


caption = "pink women's wallet with zipper"
result = find_best_match(caption, table_name="found_items")

if result["match"]:
    print(f"Closest Match: {result['match']['caption']}")
    print(f"imilarity Score: {result['score']:.2f}")
else:
    print("No items found in Supabase.")
