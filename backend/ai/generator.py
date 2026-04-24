import requests
from io import BytesIO
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration

processor = None
model = None

def get_model():
    global processor, model
    if processor is None or model is None:
        processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
        model = BlipForConditionalGeneration.from_pretrained(
            "Salesforce/blip-image-captioning-base"
        ).to("cpu")
    return processor, model

def description_generator(image) -> str:
    processor, model = get_model()

    if isinstance(image, (bytes, bytearray)):
        raw_image = Image.open(BytesIO(image)).convert('RGB')
    else:
        raw_image = Image.open(image).convert('RGB')

    inputs = processor(raw_image, return_tensors="pt").to("cpu")
    out = model.generate(**inputs)

    return processor.decode(out[0], skip_special_tokens=True)

