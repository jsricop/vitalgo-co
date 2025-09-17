"""
User repository interface (port)
"""
from abc import ABC, abstractmethod
from typing import Optional
from uuid import UUID

from slices.signup.domain.models.user_model import User


class UserRepository(ABC):
    """Interface for user data persistence operations"""

    @abstractmethod
    async def create(self, user: User) -> User:
        """Create a new user"""
        pass

    @abstractmethod
    async def get_by_id(self, user_id: UUID) -> Optional[User]:
        """Get user by ID"""
        pass

    @abstractmethod
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        pass

    @abstractmethod
    async def email_exists(self, email: str) -> bool:
        """Check if email already exists"""
        pass

    @abstractmethod
    async def update(self, user: User) -> User:
        """Update user information"""
        pass