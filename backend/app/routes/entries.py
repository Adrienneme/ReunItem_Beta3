from fastapi import APIRouter, Depends, UploadFile, Form, File, HTTPException
from typing import Optional
from app.models import ItemModels, UserModels
from app.schemas import ItemSchemas, EntryType, EntryStatus, MatchSchemas
from typing import List

router = APIRouter(prefix="/items")

@router.post("/create", response_model=ItemSchemas.ItemResponse)
async def create_item_route(
    item_name: str = Form(...),
    description: str = Form(...),
    pickup_location: Optional[str] = Form(None),
    type: str = Form(...), 
    status: str = Form("Pending Approval"),
    photo: Optional[UploadFile] = File(None),
    current_user=Depends(UserModels.get_current_active_user)
):
    if not pickup_location:
        pickup_location = "Not Specified"
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


@router.post('/generate')
async def generate_desc_router(
  photo: UploadFile = File(...), 
  _: dict = Depends(UserModels.get_current_active_user)
  ):
  try: 
    description = await ItemModels.gen_desc(photo)
    return {"description": description}
  except Exception as e:
      raise HTTPException(status_code=500, detail=f"Error generating description: {e}")
  
  

@router.get("/list", response_model=List[ItemSchemas.ItemResponse])
async def get_items_route(current_user = Depends(UserModels.get_current_active_user)):
  return ItemModels.get_items(str(current_user.user_id))
  

@router.get("/detail/{entry_id}", response_model=ItemSchemas.ItemResponse)
async def get_Specific_item_route(entry_id: str, _= Depends(UserModels.get_current_active_user)):
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
def delete_item_route(entry_id: str, _= Depends(UserModels.get_current_active_user)):
  return ItemModels.delete_item(entry_id)


@router.post("/matches/{entry_id}", response_model = List[MatchSchemas.FoundMatchResponse])
def generate_desc_route(entry_id: str, current_user=Depends(UserModels.get_current_active_user)):
  return ItemModels.find_match(entry_id, str(current_user.user_id))


@router.post("/set_match", response_model = MatchSchemas.MatchResponse)
def set_match_route(match_data: MatchSchemas.MatchedItems, _=Depends(UserModels.get_current_active_user)):
  return ItemModels.set_match(
    lostentry_id=match_data.lost_entry_id,
    foundentry_id=match_data.found_entry_id,
    similarity=match_data.similarity
  )
  
  
@router.get("/get_match/{entry_id}")
def get_match_route(entry_id: str, _=Depends(UserModels.get_current_active_user)):
  return ItemModels.get_match(entry_id)


@router.delete("/cancel_claim/{entry_id}")
def delete_match(entry_id: str, _=Depends(UserModels.get_current_active_user)):
  return ItemModels.cancel_claim(entry_id)