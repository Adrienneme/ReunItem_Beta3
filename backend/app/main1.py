from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.user import router as user_router
from app.db import supabase


app = FastAPI(title="Lost & Found API")


origins = [
    "http://localhost:5173",  # React app URL
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include user routes (from backend/app/routes/user.py)
app.include_router(user_router, prefix="/user", tags=["User"])

# test connection to Supabase
@app.get("/")
def root():
    return {"message": "API is running!"}

# Temporary test route for Supabase connection
@app.get("/test_db")
def test_db():
    try:
        data = supabase.table("users").select("*").limit(1).execute()
        return {"message": "Connected to Supabase!", "data": data.data}
    except Exception as e:
        return {"error": str(e)}

# test 
@app.get("/upload_image")
def upload_image_page():
    return {"message": "Image upload page placeholder"}
