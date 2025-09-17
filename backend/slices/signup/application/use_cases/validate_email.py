"""
Validate email use case for onBlur validation
"""
import re
from typing import Dict, Any
from slices.signup.application.ports.user_repository import UserRepository


class ValidateEmailUseCase:
    """Use case for validating email format and uniqueness (onBlur)"""

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def execute(self, email: str) -> Dict[str, Any]:
        """Validate email format and uniqueness"""

        try:
            # Normalize email
            email = email.lower().strip()

            # Validate format (RFC 5322 basic validation)
            if not self._validate_email_format(email):
                return {
                    "valid": False,
                    "error": "Formato de email inválido"
                }

            # Check uniqueness
            exists = await self.user_repository.email_exists(email)

            if exists:
                return {
                    "valid": False,
                    "error": "Este email ya está registrado"
                }

            return {
                "valid": True,
                "message": "Email disponible"
            }

        except Exception as e:
            return {
                "valid": False,
                "error": "Error validando email"
            }

    def _validate_email_format(self, email: str) -> bool:
        """Validate email format using regex (RFC 5322 basic)"""

        # Basic RFC 5322 regex pattern
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

        if not re.match(pattern, email):
            return False

        # Additional checks
        if len(email) > 255:
            return False

        local_part, domain = email.split('@')

        # Local part checks
        if len(local_part) > 64:
            return False

        # Domain checks
        if len(domain) > 253:
            return False

        return True