from fastapi import FastAPI
from app.routes import user

app = FastAPI(title="ReunItem")

app.include_router(user.app)