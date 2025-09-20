"""
Login Attempt SQLAlchemy model for authentication audit trail
"""
from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Text, ForeignKey, func
from sqlalchemy.dialects.postgresql import INET, JSONB, UUID
from sqlalchemy.orm import relationship

from shared.database import Base


class LoginAttempt(Base):
    """Login attempt audit model for security tracking and analysis"""

    __tablename__ = "login_attempts"

    # Use BigInteger for high performance on high-volume audit table
    id = Column(BigInteger, primary_key=True, autoincrement=True)

    # Core login attempt data
    email = Column(String(255), nullable=False, index=True)
    ip_address = Column(INET, nullable=False, index=True)
    success = Column(Boolean, nullable=False, default=False, index=True)
    attempted_at = Column(DateTime(timezone=True), nullable=False, default=func.now(), index=True)

    # Additional tracking information
    user_agent = Column(Text, nullable=True)
    failure_reason = Column(String(100), nullable=True)

    # Reference to user if exists (nullable for failed attempts with invalid emails)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    # Session and security tracking
    session_id = Column(String(255), nullable=True)
    geolocation = Column(JSONB, nullable=True)
    request_headers = Column(JSONB, nullable=True)

    # Relationships
    user = relationship("User", back_populates="login_attempts")

    def __repr__(self):
        return f"<LoginAttempt(email='{self.email}', success={self.success}, attempted_at='{self.attempted_at}')>"