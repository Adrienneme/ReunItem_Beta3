import requests
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration


processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base").to("cpu")

img_url = "C:/Users/AdrienneMedenilla/Downloads/wallet_488220-80725.jpg"

raw_image = Image.open(img_url).convert('RGB')

inputs = processor(raw_image, return_tensors="pt").to("cpu")

out = model.generate(**inputs)
print(processor.decode(out[0], skip_special_tokens=True))

# unconditional image captioning
inputs = processor(raw_image, return_tensors="pt").to("cpu")

out = model.generate(**inputs)
print(processor.decode(out[0], skip_special_tokens=True))

