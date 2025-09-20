"""
SQLAlchemy implementation of LoginAttemptRepository
"""
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import desc

from slices.auth.application.ports.login_attempt_repository import LoginAttemptRepository
from slices.auth.domain.models.login_attempt_model import LoginAttempt


class SQLAlchemyLoginAttemptRepository(LoginAttemptRepository):
    """SQLAlchemy implementation of login attempt repository"""

    def __init__(self, db_session: Session):
        self.db_session = db_session

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
        attempt = LoginAttempt(
            email=email.lower(),
            ip_address=ip_address,
            user_agent=user_agent[:500],  # Limit user agent length
            success=success,
            failure_reason=failure_reason,
            user_id=user_id,
            attempted_at=datetime.utcnow()
        )

        self.db_session.add(attempt)
        self.db_session.commit()
        self.db_session.refresh(attempt)
        return attempt

    async def get_recent_failures_by_ip(
        self,
        ip_address: str,
        since: datetime,
        limit: int = 10
    ) -> List[LoginAttempt]:
        """Get recent failed attempts from IP address"""
        return self.db_session.query(LoginAttempt).filter(
            LoginAttempt.ip_address == ip_address,
            LoginAttempt.success == False,
            LoginAttempt.attempted_at >= since
        ).order_by(desc(LoginAttempt.attempted_at)).limit(limit).all()

    async def get_recent_failures_by_email(
        self,
        email: str,
        since: datetime,
        limit: int = 5
    ) -> List[LoginAttempt]:
        """Get recent failed attempts for email"""
        return self.db_session.query(LoginAttempt).filter(
            LoginAttempt.email == email.lower(),
            LoginAttempt.success == False,
            LoginAttempt.attempted_at >= since
        ).order_by(desc(LoginAttempt.attempted_at)).limit(limit).all()

    async def count_failures_by_ip(
        self,
        ip_address: str,
        since: datetime
    ) -> int:
        """Count failed attempts from IP since timestamp"""
        return self.db_session.query(LoginAttempt).filter(
            LoginAttempt.ip_address == ip_address,
            LoginAttempt.success == False,
            LoginAttempt.attempted_at >= since
        ).count()

    async def count_failures_by_email(
        self,
        email: str,
        since: datetime
    ) -> int:
        """Count failed attempts for email since timestamp"""
        return self.db_session.query(LoginAttempt).filter(
            LoginAttempt.email == email.lower(),
            LoginAttempt.success == False,
            LoginAttempt.attempted_at >= since
        ).count()