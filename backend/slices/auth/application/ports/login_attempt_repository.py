"""
Login attempt repository interface (port)
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from datetime import datetime

from slices.auth.domain.models.login_attempt_model import LoginAttempt


class LoginAttemptRepository(ABC):
    """Interface for login attempt audit operations"""

    @abstractmethod
    async def create_attempt(
        self,
        email: str,
        ip_address: str,
        user_agent: str,
        success: bool,
        failure_reason: Optional[str] = None,
        user_id: Optional[str] = None
    ) -> LoginAttempt:
        """Record a login attempt"""
        pass

    @abstractmethod
    async def get_recent_failures_by_ip(
        self,
        ip_address: str,
        since: datetime,
        limit: int = 10
    ) -> List[LoginAttempt]:
        """Get recent failed attempts from IP address"""
        pass

    @abstractmethod
    async def get_recent_failures_by_email(
        self,
        email: str,
        since: datetime,
        limit: int = 5
    ) -> List[LoginAttempt]:
        """Get recent failed attempts for email"""
        pass

    @abstractmethod
    async def count_failures_by_ip(
        self,
        ip_address: str,
        since: datetime
    ) -> int:
        """Count failed attempts from IP since timestamp"""
        pass

    @abstractmethod
    async def count_failures_by_email(
        self,
        email: str,
        since: datetime
    ) -> int:
        """Count failed attempts for email since timestamp"""
        pass