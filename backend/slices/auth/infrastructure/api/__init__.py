"""
Authentication API infrastructure
"""
from .auth_endpoints import router as auth_router

__all__ = ["auth_router"]