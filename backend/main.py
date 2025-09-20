"""
VitalGo Backend API
Main FastAPI application entry point
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from slices.signup.infrastructure.api import patient_signup_router, validation_router
from slices.auth.infrastructure.api import auth_router

# Create FastAPI app instance
app = FastAPI(
    title="VitalGo API",
    description="VitalGo Backend API following Hexagonal Architecture",
    version="0.1.0"
)

# Configure CORS - SECURITY HARDENED
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),  # Configurable origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Specific methods only
    allow_headers=["Content-Type", "Authorization", "Accept"],  # Specific headers only
)

# Register routers
app.include_router(patient_signup_router)
app.include_router(validation_router)
app.include_router(auth_router)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "VitalGo API is running", "status": "healthy"}


@app.get("/health")
async def health_check():
    """Detailed health check endpoint"""
    return {
        "status": "healthy",
        "service": "vitalgo-backend",
        "version": "0.1.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)