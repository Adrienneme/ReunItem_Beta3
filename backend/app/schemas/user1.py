from pydantic import BaseModel
from enum import Enum

class ImageType(str, Enum):
    lost = "lost"
    found = "found"

class ImageUpload(BaseModel):
    first_name: str
    last_name: str
    image_url: str
    image_type: ImageType 
 