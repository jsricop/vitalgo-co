"""
User Session SQLAlchemy model for JWT token management
"""
from sqlalchemy import Column, BigInteger, String, DateTime, Boolean, ForeignKey, Text, func
from sqlalchemy.dialects.postgresql import INET, JSONB, UUID
from sqlalchemy.orm import relationship

from shared.database import Base


class UserSession(Base):
    """User session model for JWT token management and security tracking"""

    __tablename__ = "user_sessions"

    # Use BigInteger for performance on potentially high-volume table
    id = Column(BigInteger, primary_key=True, autoincrement=True)

    # Core session data
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    session_token = Column(String(1000), nullable=False, unique=True, index=True)
    refresh_token = Column(String(1000), nullable=True, unique=True, index=True)

    # Token expiration management
    expires_at = Column(DateTime(timezone=True), nullable=False, index=True)
    refresh_expires_at = Column(DateTime(timezone=True), nullable=True)

    # Session tracking
    created_at = Column(DateTime(timezone=True), nullable=False, default=func.now())
    last_accessed = Column(DateTime(timezone=True), nullable=False, default=func.now())

    # Connection information
    ip_address = Column(INET, nullable=True)
    user_agent = Column(Text, nullable=True)

    # Session state
    is_active = Column(Boolean, nullable=False, default=True, index=True)
    remember_me = Column(Boolean, nullable=False, default=False)

    # Security fields for enhanced tracking
    device_fingerprint = Column(String(255), nullable=True)
    location_info = Column(JSONB, nullable=True)

    # Relationships
    user = relationship("User", back_populates="sessions")

    def __repr__(self):
        return f"<UserSession(user_id='{self.user_id}', is_active={self.is_active}, expires_at='{self.expires_at}')>"

    def is_expired(self) -> bool:
        """Check if the session is expired"""
        from datetime import datetime, timezone
        return datetime.now(timezone.utc) > self.expires_at

    def is_refresh_expired(self) -> bool:
        """Check if the refresh token is expired"""
        from datetime import datetime, timezone
        if self.refresh_expires_at is None:
            return True
        return datetime.now(timezone.utc) > self.refresh_expires_at