"""
Validate Token Use Case
"""
from typing import Dict, Any, Optional
from fastapi import HTTPException, status

from slices.auth.application.ports import AuthRepository, UserSessionRepository
from slices.auth.infrastructure.security.jwt_service import JWTService


class ValidateTokenUseCase:
    """Use case for JWT token validation and user session verification"""

    def __init__(
        self,
        auth_repository: AuthRepository,
        user_session_repository: UserSessionRepository,
        jwt_service: JWTService
    ):
        self.auth_repository = auth_repository
        self.user_session_repository = user_session_repository
        self.jwt_service = jwt_service

    async def execute(self, token: str) -> Dict[str, Any]:
        """
        Validate JWT token and return user information

        Args:
            token: JWT access token to validate

        Returns:
            Dictionary with user information if valid

        Raises:
            HTTPException: If token is invalid or expired
        """
        # Step 1: Verify and decode JWT token
        try:
            payload = self.jwt_service.verify_token(token)
        except HTTPException as e:
            raise e

        # Step 2: Extract user information from token
        user_id = payload.get("sub")
        session_id = payload.get("session_id")

        if not user_id or not session_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Step 3: Verify session exists and is active
        session = await self.user_session_repository.get_session_by_token(token)
        if not session or session.is_revoked:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session not found or revoked",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Step 4: Get user from database
        user = await self.auth_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Step 5: Check if user account is locked
        if await self.auth_repository.is_user_locked(user.id):
            # Revoke session for locked account
            await self.user_session_repository.revoke_session(session.id)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is locked",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Step 6: Return user information
        return {
            "user_id": str(user.id),
            "email": user.email,
            "user_type": user.user_type,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_verified": user.is_verified,
            "profile_completed": user.profile_completed,
            "mandatory_fields_completed": user.mandatory_fields_completed,
            "session_id": session_id
        }