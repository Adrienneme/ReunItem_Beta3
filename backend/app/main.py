from fastapi import FastAPI
from app.routes.user import router as user_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ReunItem")

origin = [
    "http://localhost:5173"
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