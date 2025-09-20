"""
SQLAlchemy implementation of UserSessionRepository
"""
from typing import Optional
from uuid import UUID
from datetime import datetime
from sqlalchemy.orm import Session

from slices.auth.application.ports.user_session_repository import UserSessionRepository
from slices.auth.domain.models.user_session_model import UserSession


class SQLAlchemyUserSessionRepository(UserSessionRepository):
    """SQLAlchemy implementation of user session repository"""

    def __init__(self, db_session: Session):
        self.db_session = db_session

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
        session = UserSession(
            user_id=user_id,
            session_token=session_token,
            refresh_token=refresh_token,
            ip_address=ip_address,
            user_agent=user_agent[:500],  # Limit user agent length
            expires_at=expires_at,
            refresh_expires_at=refresh_expires_at,
            is_active=True
        )

        self.db_session.add(session)
        self.db_session.commit()
        self.db_session.refresh(session)
        return session

    async def get_session_by_token(self, session_token: str) -> Optional[UserSession]:
        """Get session by access token"""
        return self.db_session.query(UserSession).filter(
            UserSession.session_token == session_token,
            UserSession.is_active == True
        ).first()

    async def get_session_by_refresh_token(self, refresh_token: str) -> Optional[UserSession]:
        """Get session by refresh token"""
        return self.db_session.query(UserSession).filter(
            UserSession.refresh_token == refresh_token,
            UserSession.is_active == True
        ).first()

    async def update_session_tokens(
        self,
        session_id: int,
        new_session_token: str,
        new_refresh_token: Optional[str],
        expires_at: datetime,
        refresh_expires_at: Optional[datetime] = None
    ) -> UserSession:
        """Update session tokens after refresh"""
        session = self.db_session.query(UserSession).filter(
            UserSession.id == session_id
        ).first()

        if session:
            session.session_token = new_session_token
            session.refresh_token = new_refresh_token
            session.expires_at = expires_at
            session.refresh_expires_at = refresh_expires_at
            session.last_accessed = datetime.utcnow()

            self.db_session.commit()
            self.db_session.refresh(session)

        return session

    async def revoke_session(self, session_id: int) -> None:
        """Revoke a specific session"""
        session = self.db_session.query(UserSession).filter(
            UserSession.id == session_id
        ).first()

        if session:
            session.is_active = False
            session.last_accessed = datetime.utcnow()
            self.db_session.commit()

    async def revoke_all_user_sessions(self, user_id: UUID) -> None:
        """Revoke all sessions for a user"""
        sessions = self.db_session.query(UserSession).filter(
            UserSession.user_id == user_id,
            UserSession.is_active == True
        ).all()

        for session in sessions:
            session.is_active = False
            session.last_accessed = datetime.utcnow()

        self.db_session.commit()

    async def cleanup_expired_sessions(self) -> int:
        """Remove expired sessions and return count of removed sessions"""
        now = datetime.utcnow()

        expired_sessions = self.db_session.query(UserSession).filter(
            UserSession.expires_at <= now
        ).all()

        count = len(expired_sessions)

        for session in expired_sessions:
            self.db_session.delete(session)

        self.db_session.commit()
        return count

    async def get_active_sessions_count(self, user_id: UUID) -> int:
        """Get count of active sessions for user"""
        now = datetime.utcnow()

        return self.db_session.query(UserSession).filter(
            UserSession.user_id == user_id,
            UserSession.is_active == True,
            UserSession.expires_at > now
        ).count()