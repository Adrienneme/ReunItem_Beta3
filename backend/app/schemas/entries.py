from pydantic import BaseModel
from typing import Optional
from enum import Enum
import uuid


class EntryType(str, Enum):
    lost = "lost"
    found = "found"


class EntryStatus(str, Enum):
    Pending_Approval = "Pending Approval"
    Pending_Claim = "Pending Claim"
    Approved = "Approved"
    Matched = "Matched"
    Claimed = "Claimed"
    Rejected = "Rejected"
    Archived = "Archived"

class ItemSchemas:
    
    class ItemBase(BaseModel):
        item_name: str
        description: str
        photo_url: Optional[str] = None
        pickup_location: Optional[str] = None
        type: EntryType
        status: EntryStatus = EntryStatus.Pending_Approval

    class ItemCreate(ItemBase):
        #nasa JWT ung user_id
        pass

    class ItemResponse(ItemBase):
        entry_id: uuid.UUID
        user_id: uuid.UUID

        class Config:
            from_attributes = True 
