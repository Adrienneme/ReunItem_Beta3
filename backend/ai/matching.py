import os
from dotenv import load_dotenv
import requests

load_dotenv()
HF_TOKEN= os.getenv('HF_TOKEN')

API_URL = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/sentence-similarity"
headers = {
    "Authorization": f"Bearer {HF_TOKEN}",
}

def match(lost_item: str, found_items: list):
  
    def query(payload):
      response = requests.post(API_URL, headers=headers, json=payload)
      return response.json()

    output = query({
        "inputs": {
        "source_sentence": lost_item,
        "sentences": found_items
    },
    })
    
    return output

output = match()


