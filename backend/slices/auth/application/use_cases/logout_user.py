"""
Logout User Use Case
"""
from typing import Dict, Any
from fastapi import HTTPException, status

from slices.auth.application.ports import UserSessionRepository
from slices.auth.infrastructure.security.jwt_service import JWTService


class LogoutUserUseCase:
    """Use case for user logout and session management"""

    def __init__(
        self,
        user_session_repository: UserSessionRepository,
        jwt_service: JWTService
    ):
        self.user_session_repository = user_session_repository
        self.jwt_service = jwt_service

    async def execute(self, token: str, logout_all: bool = False) -> Dict[str, Any]:
        """
        Logout user by revoking session(s)

        Args:
            token: JWT access token
            logout_all: Whether to logout from all devices

        Returns:
            Dictionary with success message
        """
        # Step 1: Verify and decode token
        try:
            payload = self.jwt_service.verify_token(token)
        except HTTPException:
            # Even if token is invalid, we should return success for logout
            return {"success": True, "message": "Logout exitoso"}

        # Step 2: Get session information
        session_id = payload.get("session_id")
        user_id = payload.get("sub")

        if not session_id or not user_id:
            return {"success": True, "message": "Logout exitoso"}

        # Step 3: Get session from database
        session = await self.user_session_repository.get_session_by_token(token)

        if session:
            if logout_all:
                # Revoke all sessions for the user
                await self.user_session_repository.revoke_all_user_sessions(user_id)
                return {"success": True, "message": "Logout exitoso de todos los dispositivos"}
            else:
                # Revoke only current session
                await self.user_session_repository.revoke_session(session.id)
                return {"success": True, "message": "Logout exitoso"}

        return {"success": True, "message": "Logout exitoso"}

    async def execute_refresh_token_logout(self, refresh_token: str) -> Dict[str, Any]:
        """
        Logout using refresh token

        Args:
            refresh_token: JWT refresh token

        Returns:
            Dictionary with success message
        """
        # Step 1: Verify refresh token
        try:
            payload = self.jwt_service.verify_refresh_token(refresh_token)
        except HTTPException:
            return {"success": True, "message": "Logout exitoso"}

        # Step 2: Get session by refresh token
        session = await self.user_session_repository.get_session_by_refresh_token(refresh_token)

        if session:
            await self.user_session_repository.revoke_session(session.id)

        return {"success": True, "message": "Logout exitoso"}