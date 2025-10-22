from fastapi import APIRouter, Depends, UploadFile, Form, File
from typing import Optional
from app.models import ItemModels, UserModels
from app.schemas import ItemSchemas, EntryType, EntryStatus
from typing import List

router = APIRouter(prefix="/items")

@router.post("/report", response_model=ItemSchemas.ItemResponse)
async def create_item_route(
    item_name: str = Form(...),
    description: str = Form(...),
    pickup_location: Optional[str] = Form(None),
    type: str = Form(...),  # matches the frontend key exactly
    status: str = Form("Pending Approval"),
    photo: Optional[UploadFile] = File(None),
    current_user=Depends(UserModels.get_current_active_user)
):
    print("=== Received Form Data ===")
    print("item_name:", item_name)
    print("description:", description)
    print("pickup_location:", pickup_location)
    print("type:", type)
    print("status:", status)
    print("photo:", photo)
    print("==========================")

    # Ensure pickup_location is not None
    if not pickup_location:
        pickup_location = "Unknown"

    # Validate type against Enum
    try:
        item_type = EntryType(type)
    except ValueError:
        item_type = EntryType.found 

    item_data = ItemSchemas.ItemCreate(
        item_name=item_name,
        description=description,
        pickup_location=pickup_location,
        type=item_type,
        status=status
    )

    return ItemModels.create_item(item_data, str(current_user.user_id), photo)


@router.get("/list", response_model=List[ItemSchemas.ItemResponse])
async def get_items_route(current_user = Depends(UserModels.get_current_active_user)):
  return ItemModels.get_items(str(current_user.user_id))
  

@router.get("/detail/{entry_id}", response_model=ItemSchemas.ItemResponse)
async def get_Specific_item_route(entry_id: str, current_user = Depends(UserModels.get_current_active_user)):
  item = ItemModels.get_specific_item(entry_id)
  return item
  

@router.put("/edit/{entry_id}", response_model=ItemSchemas.ItemResponse)
async def update_item_route(
  entry_id: str,
  item_name: str = Form(None),
  description: str = Form(None),
  pickup_location: str = Form(None),
  type: str = Form(None),
  photo: UploadFile = None,
  current_user = Depends(UserModels.get_current_active_user)
):
  updates = {}
  if item_name: updates["item_name"] = item_name
  if description: updates["description"] = description
  if pickup_location: updates["pickup_location"] = pickup_location
  if type: updates["type"] = type
  
  updates["status"] = EntryStatus.Pending_Approval

  return ItemModels.update_item(entry_id, str(current_user.user_id), updates, photo)


@router.delete("/delete/{entry_id}")
async def delete_item_route(entry_id: str, current_user = Depends(UserModels.get_current_active_user)):
  return ItemModels.delete_item(entry_id, str(current_user.user_id))


