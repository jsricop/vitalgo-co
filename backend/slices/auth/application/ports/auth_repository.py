"""
Authentication repository interface (port)
"""
from abc import ABC, abstractmethod
from typing import Optional
from uuid import UUID

from slices.signup.domain.models.user_model import User


class AuthRepository(ABC):
    """Interface for authentication-related user operations"""

    @abstractmethod
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email for authentication"""
        pass

    @abstractmethod
    async def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        """Get user by ID for token validation"""
        pass

    @abstractmethod
    async def update_last_login(self, user_id: UUID) -> None:
        """Update user's last login timestamp"""
        pass

    @abstractmethod
    async def increment_failed_login_attempts(self, user_id: UUID) -> int:
        """Increment failed login attempts and return current count"""
        pass

    @abstractmethod
    async def reset_failed_login_attempts(self, user_id: UUID) -> None:
        """Reset failed login attempts after successful login"""
        pass

    @abstractmethod
    async def lock_user_account(self, user_id: UUID, locked_until: Optional[str] = None) -> None:
        """Lock user account due to too many failed attempts"""
        pass

    @abstractmethod
    async def is_user_locked(self, user_id: UUID) -> bool:
        """Check if user account is locked"""
        pass