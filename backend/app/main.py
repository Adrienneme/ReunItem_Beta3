from fastapi import FastAPI
from app.routes.user import router as user_router
from app.routes.entries import router as item_router
from fastapi.middleware.cors import CORSMiddleware
from app.admin.image_accept import router as admin_image_router
from app.admin.routes import admin_claims_router
from app.admin.backup import router as admin_backup_router

from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import logging

app = FastAPI(title="ReunItem")

# ------------------- Logging -------------------
logging.basicConfig(level=logging.DEBUG)

# ------------------- CORS -------------------
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

# ------------------- Routers -------------------
app.include_router(user_router)
app.include_router(item_router)
app.include_router(admin_image_router)    # Admin image approvals
app.include_router(admin_claims_router)   # Admin claim 
app.include_router(admin_backup_router)  # Admin backup & restore

# ------------------- Root -------------------
@app.get("/")
def root():
    return {"message": "API is running!"}

# ------------------- Request Validation Error Handler -------------------
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    # Log full validation error in terminal
    logging.error(f"Validation error for request {request.url}:\n{exc}")

    # Return JSON safely (convert exc.body to string)
    return JSONResponse(
        status_code=422,
        content={
            "detail": exc.errors(),
            "body": str(exc.body)  # safe for JSON serialization
        }
    )
