# backend/ai/generator.py
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import requests
from io import BytesIO

# Load BLIP model once
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

def generate_caption(image_input):
    """
    Generate caption from:
    - a URL string, or
    - image bytes (uploaded file)
    """
    try:
        # If it's a URL
        if isinstance(image_input, str) and image_input.startswith("http"):
            response = requests.get(image_input)
            image = Image.open(BytesIO(response.content)).convert("RGB")

        # If it's bytes (e.g., UploadFile)
        elif isinstance(image_input, (bytes, bytearray)):
            image = Image.open(BytesIO(image_input)).convert("RGB")

        else:
            raise ValueError("Invalid input — expected image URL or bytes")

        # Generate caption
        inputs = processor(images=image, return_tensors="pt")
        out = model.generate(**inputs)
        caption = processor.decode(out[0], skip_special_tokens=True)

        return caption

    except Exception as e:
        print(f"❌ Caption generation failed: {e}")
        return None
