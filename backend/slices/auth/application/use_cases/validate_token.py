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
        print(f"🔍 VALIDATE TOKEN DEBUG - Starting validation process:")
        print(f"   Token length: {len(token)}")
        print(f"   Token preview: {token[:50]}...")

        # Step 1: Verify and decode JWT token
        try:
            print(f"🔍 VALIDATE TOKEN DEBUG - Step 1: Verifying JWT token...")
            payload = self.jwt_service.verify_token(token)
            print(f"   ✅ JWT verification successful")
            print(f"   Payload: {payload}")
        except HTTPException as e:
            print(f"   ❌ JWT verification failed: {e.detail}")
            raise e

        # Step 2: Extract user information from token
        print(f"🔍 VALIDATE TOKEN DEBUG - Step 2: Extracting token payload...")
        user_id = payload.get("sub")
        session_id = payload.get("session_id")
        print(f"   User ID: {user_id}")
        print(f"   Session ID: {session_id}")

        if not user_id or not session_id:
            print(f"   ❌ Missing required payload fields")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Step 3: Verify session exists and is active
        print(f"🔍 VALIDATE TOKEN DEBUG - Step 3: Checking session...")
        session = await self.user_session_repository.get_session_by_token(token)
        print(f"   Session found: {'Yes' if session else 'No'}")
        if session:
            print(f"   Session ID: {session.id}")
            print(f"   Session user_id: {session.user_id}")
            print(f"   Session is_active: {session.is_active}")
            print(f"   Session is_revoked: {getattr(session, 'is_revoked', 'No is_revoked field')}")
            print(f"   Session expires_at: {session.expires_at}")
            print(f"   Session created_at: {session.created_at}")
            print(f"   Session last_accessed: {session.last_accessed}")

        if not session:
            print(f"   ❌ Session not found")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session not found or revoked",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Check if session has is_revoked attribute and if it's revoked
        if hasattr(session, 'is_revoked') and session.is_revoked:
            print(f"   ❌ Session is revoked")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session not found or revoked",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Step 4: Get user from database
        print(f"🔍 VALIDATE TOKEN DEBUG - Step 4: Getting user from database...")
        user = await self.auth_repository.get_user_by_id(user_id)
        print(f"   User found: {'Yes' if user else 'No'}")
        if user:
            print(f"   User ID: {user.id}")
            print(f"   User email: {user.email}")
            print(f"   User type: {user.user_type}")

        if not user:
            print(f"   ❌ User not found")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Step 5: Check if user account is locked
        print(f"🔍 VALIDATE TOKEN DEBUG - Step 5: Checking if user is locked...")
        is_locked = await self.auth_repository.is_user_locked(user.id)
        print(f"   User is locked: {is_locked}")

        if is_locked:
            print(f"   ❌ User account is locked, revoking session")
            # Revoke session for locked account
            await self.user_session_repository.revoke_session(session.id)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is locked",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Step 6: Return user information
        print(f"🔍 VALIDATE TOKEN DEBUG - Step 6: Returning user information...")
        print(f"   User attributes: {[attr for attr in dir(user) if not attr.startswith('_')]}")

        # Get patient/profile data if available
        first_name = None
        last_name = None
        profile_completed = False
        mandatory_fields_completed = False

        # Try to get patient record for additional fields
        try:
            from slices.signup.domain.models.patient_model import Patient
            from sqlalchemy.orm import Session

            # Get database session from auth_repository
            db_session = self.auth_repository.db_session if hasattr(self.auth_repository, 'db_session') else None
            if db_session:
                patient = db_session.query(Patient).filter(Patient.user_id == user.id).first()
                if patient:
                    first_name = patient.first_name
                    last_name = patient.last_name
                    profile_completed = True  # If patient record exists, profile is completed
                    mandatory_fields_completed = bool(patient.first_name and patient.last_name)
        except Exception as e:
            print(f"   ⚠️ Could not get patient data: {e}")

        user_info = {
            "user_id": str(user.id),
            "email": user.email,
            "user_type": user.user_type,
            "first_name": first_name,
            "last_name": last_name,
            "is_verified": user.is_verified,
            "profile_completed": profile_completed,
            "mandatory_fields_completed": mandatory_fields_completed,
            "session_id": session_id
        }
        print(f"   ✅ Validation successful, returning user info: {user_info}")
        return user_info