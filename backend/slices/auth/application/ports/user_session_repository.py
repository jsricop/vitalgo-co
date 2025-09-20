"""
User session repository interface (port)
"""
from abc import ABC, abstractmethod
from typing import Optional
from uuid import UUID
from datetime import datetime

from slices.auth.domain.models.user_session_model import UserSession


class UserSessionRepository(ABC):
    """Interface for user session management operations"""

    @abstractmethod
    async def create_session(
        self,
        user_id: UUID,
        session_token: str,
        refresh_token: Optional[str],
        ip_address: str,
        user_agent: str,
        expires_at: datetime,
        refresh_expires_at: Optional[datetime] = None
    ) -> UserSession:
        """Create a new user session"""
        pass

    @abstractmethod
    async def get_session_by_token(self, session_token: str) -> Optional[UserSession]:
        """Get session by access token"""
        pass

    @abstractmethod
    async def get_session_by_refresh_token(self, refresh_token: str) -> Optional[UserSession]:
        """Get session by refresh token"""
        pass

    @abstractmethod
    async def update_session_tokens(
        self,
        session_id: int,
        new_session_token: str,
        new_refresh_token: Optional[str],
        expires_at: datetime,
        refresh_expires_at: Optional[datetime] = None
    ) -> UserSession:
        """Update session tokens after refresh"""
        pass

    @abstractmethod
    async def revoke_session(self, session_id: int) -> None:
        """Revoke a specific session"""
        pass

    @abstractmethod
    async def revoke_all_user_sessions(self, user_id: UUID) -> None:
        """Revoke all sessions for a user"""
        pass

    @abstractmethod
    async def cleanup_expired_sessions(self) -> int:
        """Remove expired sessions and return count of removed sessions"""
        pass

    @abstractmethod
    async def get_active_sessions_count(self, user_id: UUID) -> int:
        """Get count of active sessions for user"""
        pass