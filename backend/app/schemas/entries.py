from pydantic import BaseModel
from typing import Optional
from enum import Enum
import uuid


# --- ENUMS ---
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


# --- ITEM SCHEMAS ---
class ItemSchemas:

    class ItemBase(BaseModel):
        item_name: str
        description: str
        photo_url: Optional[str] = None
        pickup_location: Optional[str] = None
        type: EntryType
        status: EntryStatus = EntryStatus.Pending_Approval

    class ItemCreate(ItemBase):
        # user_id will come from JWT
        pass

    class ItemResponse(ItemBase):
        entry_id: uuid.UUID
        user_id: uuid.UUID

        class Config:
            from_attributes = True


# --- MATCH SCHEMAS ---
class MatchSchemas:

    class MatchedItems(BaseModel):
        match_id: Optional[uuid.UUID] = None
        lost_entry_id: uuid.UUID
        found_entry_id: uuid.UUID
        similarity: int
        is_claimed: bool = False

    class MatchResponse(BaseModel):
        match_id: uuid.UUID
        similarity: int
        is_claimed: bool
        lost_item: ItemSchemas.ItemResponse
        found_item: ItemSchemas.ItemResponse
        
    class FoundMatchResponse(ItemSchemas.ItemResponse):
        similarity: int
