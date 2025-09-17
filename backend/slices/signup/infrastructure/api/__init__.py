"""
API endpoints for signup domain
"""
from .patient_signup_endpoint import router as patient_signup_router
from .validation_endpoints import router as validation_router

__all__ = ["patient_signup_router", "validation_router"]