"""
Refresh Token Use Case
"""
from typing import Dict, Any
from fastapi import HTTPException, status

from slices.auth.application.dto import LoginResponseDto, UserResponseDto
from slices.auth.application.ports import AuthRepository, UserSessionRepository
from slices.auth.infrastructure.security.jwt_service import JWTService


class RefreshTokenUseCase:
    """Use case for JWT token refresh"""

    def __init__(
        self,
        auth_repository: AuthRepository,
        user_session_repository: UserSessionRepository,
        jwt_service: JWTService
    ):
        self.auth_repository = auth_repository
        self.user_session_repository = user_session_repository
        self.jwt_service = jwt_service

    async def execute(self, refresh_token: str) -> Dict[str, Any]:
        """
        Refresh JWT access token using refresh token

        Args:
            refresh_token: JWT refresh token

        Returns:
            Dictionary with new tokens

        Raises:
            HTTPException: If refresh token is invalid
        """
        # Step 1: Verify refresh token
        try:
            payload = self.jwt_service.verify_refresh_token(refresh_token)
        except HTTPException as e:
            raise e

        # Step 2: Extract information from refresh token
        user_id = payload.get("sub")
        session_id = payload.get("session_id")

        if not user_id or not session_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Step 3: Verify session exists and is active
        session = await self.user_session_repository.get_session_by_refresh_token(refresh_token)
        if not session or session.is_revoked:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token not found or revoked",
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

        # Step 6: Generate new tokens
        token_data = self.jwt_service.create_access_token(
            user_id=str(user.id),
            email=user.email,
            user_type=user.user_type,
            remember_me=session.remember_me
        )

        new_refresh_token_data = self.jwt_service.create_refresh_token(
            user_id=str(user.id),
            session_id=token_data["session_id"]
        )

        # Step 7: Update session with new tokens
        updated_session = await self.user_session_repository.update_session_tokens(
            session_id=session.id,
            new_session_token=token_data["access_token"],
            new_refresh_token=new_refresh_token_data["refresh_token"],
            expires_at=token_data["expires_at"],
            refresh_expires_at=new_refresh_token_data["expires_at"]
        )

        # Step 8: Determine redirect URL based on profile completeness
        redirect_url = self._get_redirect_url(user)

        # Step 9: Create response
        user_response = UserResponseDto(
            id=str(user.id),
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            user_type=user.user_type,
            is_verified=user.is_verified,
            profile_completed=user.profile_completed,
            mandatory_fields_completed=user.mandatory_fields_completed
        )

        return {
            "success": True,
            "data": LoginResponseDto(
                access_token=token_data["access_token"],
                refresh_token=new_refresh_token_data["refresh_token"],
                expires_in=token_data["expires_in"],
                user=user_response,
                redirect_url=redirect_url
            )
        }

    def _get_redirect_url(self, user) -> str:
        """Determine redirect URL based on user profile completeness"""
        if not user.profile_completed:
            return "/completar-perfil"
        elif not user.mandatory_fields_completed:
            return "/completar-perfil-medico"
        else:
            return "/dashboard"