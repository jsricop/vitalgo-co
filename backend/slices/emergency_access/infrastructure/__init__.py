"""
Infrastructure layer for emergency access
"""
from .api.emergency_access_router import router
from .repositories.emergency_data_repository import EmergencyDataRepository

__all__ = ["router", "EmergencyDataRepository"]
