from fastapi import FastAPI
from app.routes import router as user_router
from fastapi.middleware.cors import CORSMiddleware

##
from backend.app.routes.user import router as upload_user_router
from backend.app.routes.upload import router as upload_router
from backend.app.routes.image_caption import router as caption_router
from backend.app.db import supabase

app = FastAPI(title="ReunItem")

origin = [
    "http://localhost:5173",
    "http://localhost:5174"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(user_router)

@app.get("/")
def root():
    return {"message": "API is running!"}

#changes I aded
app = FastAPI(title="Lost & Found API")

# Allow frontend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(user_router, prefix="/user", tags=["User Account"])
app.include_router(upload_user_router, prefix="/user_image", tags=["User Image Upload"])
app.include_router(upload_router, prefix="/upload", tags=["Upload"])
app.include_router(caption_router, prefix="/caption", tags=["AI Caption"])

# Root route
@app.get("/")
def root():
    return {"message": "API is running!"}
