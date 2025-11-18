from fastapi import FastAPI
from app.routes.user import router as user_router
from app.routes.entries import router as item_router
from fastapi.middleware.cors import CORSMiddleware
##
from app.admin.image_accept import router as admin_image_router
from app.admin.routes import admin_claims_router





app = FastAPI(title="ReunItem")


origin = [
    "http://localhost:5173",
    "http://localhost:5174",
    
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(user_router)
app.include_router(item_router)
##
app.include_router(admin_image_router)    # Admin image approvals
app.include_router(admin_claims_router)   # Admin claim 


@app.get("/")
def root():
    return {"message": "API is running!"}