"""
Authentication domain models initialization
"""
from .login_attempt_model import LoginAttempt
from .user_session_model import UserSession

__all__ = ["LoginAttempt", "UserSession"]