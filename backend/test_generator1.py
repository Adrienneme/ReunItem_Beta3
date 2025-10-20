from ai.generator import generate_caption

# Try with a sample image
url = "https://i5.walmartimages.com/seo/Fashion-Women-Wallets-Female-PU-Leather-Wallet-Mini-Ladies-Purse-Zipper-Clutch-Bag-Money-Card-Holder-for-Women-Girl-Pink_41d2d2bf-c634-435d-8569-e423deac00ca_1.1486f2ec5b0988c92120f1a8f0fd7e5b.jpeg"

caption = generate_caption(url)
print("🖼️ Image URL:", url)
print("📝 Generated Caption:", caption)
