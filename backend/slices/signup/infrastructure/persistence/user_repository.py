"""
SQLAlchemy implementation of UserRepository
"""
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session

from slices.signup.application.ports.user_repository import UserRepository
from slices.signup.domain.models.user_model import User


class SQLAlchemyUserRepository(UserRepository):
    """SQLAlchemy implementation of user repository"""

    def __init__(self, db_session: Session):
        self.db_session = db_session

    async def create(self, user: User) -> User:
        """Create a new user"""
        self.db_session.add(user)
        self.db_session.commit()
        self.db_session.refresh(user)
        return user

    async def get_by_id(self, user_id: UUID) -> Optional[User]:
        """Get user by ID"""
        return self.db_session.query(User).filter(User.id == user_id).first()

    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        return self.db_session.query(User).filter(User.email == email.lower()).first()

    async def email_exists(self, email: str) -> bool:
        """Check if email already exists"""
        return self.db_session.query(User).filter(User.email == email.lower()).first() is not None

    async def update(self, user: User) -> User:
        """Update user information"""
        self.db_session.commit()
        self.db_session.refresh(user)
        return user