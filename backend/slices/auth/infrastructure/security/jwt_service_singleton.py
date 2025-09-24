"""
JWT Service Singleton Pattern
Ensures only one JWTService instance across the entire application

This pattern was implemented to resolve authentication issues caused by
multiple JWT service instances with inconsistent validation behavior.

Benefits:
- Single source of truth for JWT validation
- Consistent audience validation handling
- Better performance (reduced memory usage)
- Easier debugging and maintenance

Usage:
    from slices.auth.infrastructure.security.jwt_service_singleton import get_jwt_service

    jwt_service = get_jwt_service()  # Always returns the same instance
"""
from typing import Optional
from .jwt_service import JWTService

# Global instance storage
_jwt_service_instance: Optional[JWTService] = None

def get_jwt_service() -> JWTService:
    """
    Get or create the singleton JWT service instance

    Returns:
        JWTService: The singleton JWT service instance
    """
    global _jwt_service_instance

    if _jwt_service_instance is None:
        _jwt_service_instance = JWTService()

    return _jwt_service_instance

def reset_jwt_service() -> None:
    """
    Reset the singleton instance (useful for testing)
    """
    global _jwt_service_instance
    _jwt_service_instance = None