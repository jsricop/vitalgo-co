"""
SQLAlchemy implementation of AuthRepository
"""
from typing import Optional, Tuple
from uuid import UUID
from datetime import datetime, timezone
from sqlalchemy.orm import Session, joinedload

from slices.auth.application.ports.auth_repository import AuthRepository
from slices.signup.domain.models.user_model import User
from slices.signup.domain.models.patient_model import Patient


class SQLAlchemyAuthRepository(AuthRepository):
    """SQLAlchemy implementation of authentication repository"""

    def __init__(self, db_session: Session):
        self.db_session = db_session

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email for authentication"""
        return self.db_session.query(User).filter(
            User.email == email.lower()
        ).first()

    async def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        """Get user by ID for token validation"""
        return self.db_session.query(User).filter(User.id == user_id).first()

    async def get_user_with_patient_by_email(self, email: str) -> Optional[Tuple[User, Patient]]:
        """Get user with patient data by email for authentication with profile data"""
        result = self.db_session.query(User, Patient).join(
            Patient, User.id == Patient.user_id
        ).filter(
            User.email == email.lower()
        ).first()

        if result:
            user, patient = result
            return (user, patient)
        return None

    async def update_last_login(self, user_id: UUID) -> None:
        """Update user's last login timestamp"""
        user = await self.get_user_by_id(user_id)
        if user:
            user.last_login = datetime.now(timezone.utc)
            self.db_session.commit()

    async def increment_failed_login_attempts(self, user_id: UUID) -> int:
        """Increment failed login attempts and return current count"""
        user = await self.get_user_by_id(user_id)
        if user:
            if user.failed_login_attempts is None:
                user.failed_login_attempts = 0
            user.failed_login_attempts += 1
            # Note: last_failed_login field not in User model, skipping
            self.db_session.commit()
            return user.failed_login_attempts
        return 0

    async def reset_failed_login_attempts(self, user_id: UUID) -> None:
        """Reset failed login attempts after successful login"""
        user = await self.get_user_by_id(user_id)
        if user:
            user.failed_login_attempts = 0
            user.locked_until = None
            self.db_session.commit()

    async def lock_user_account(self, user_id: UUID, locked_until: Optional[str] = None) -> None:
        """Lock user account due to too many failed attempts"""
        user = await self.get_user_by_id(user_id)
        if user:
            if locked_until:
                user.locked_until = datetime.fromisoformat(locked_until)
            else:
                # Lock for 1 hour by default
                user.locked_until = datetime.now(timezone.utc).replace(
                    hour=datetime.now(timezone.utc).hour + 1
                )
            self.db_session.commit()

    async def is_user_locked(self, user_id: UUID) -> bool:
        """Check if user account is locked"""
        user = await self.get_user_by_id(user_id)
        if not user or not user.locked_until:
            return False

        # Check if lock has expired
        if user.locked_until <= datetime.now(timezone.utc):
            # Auto-unlock expired locks
            user.locked_until = None
            self.db_session.commit()
            return False

        return True