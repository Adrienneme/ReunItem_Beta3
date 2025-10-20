import requests
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base").to("cpu")

img_url = 'https://i5.walmartimages.com/seo/Fashion-Women-Wallets-Female-PU-Leather-Wallet-Mini-Ladies-Purse-Zipper-Clutch-Bag-Money-Card-Holder-for-Women-Girl-Pink_41d2d2bf-c634-435d-8569-e423deac00ca_1.1486f2ec5b0988c92120f1a8f0fd7e5b.jpeg' 
raw_image = Image.open(requests.get(img_url, stream=True).raw).convert('RGB')

inputs = processor(raw_image, return_tensors="pt").to("cpu")

out = model.generate(**inputs)
print(processor.decode(out[0], skip_special_tokens=True))

# unconditional image captioning
inputs = processor(raw_image, return_tensors="pt").to("cpu")

out = model.generate(**inputs)
print(processor.decode(out[0], skip_special_tokens=True))


#changes I added
#Caption generator
