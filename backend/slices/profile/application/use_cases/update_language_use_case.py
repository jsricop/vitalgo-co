"""
Update Language Preference Use Case for Internationalization Support
"""
from sqlalchemy.orm import Session
from typing import Dict, Any

from slices.signup.domain.models.user_model import User
from slices.profile.application.dto.language_dto import (
    LanguagePreferenceDTO,
    LanguageCode
)


class UpdateLanguagePreferenceUseCase:
    """Use case for updating user language preference"""

    def __init__(self, db: Session):
        self.db = db

    def execute(self, user_id: str, language_data: LanguagePreferenceDTO) -> Dict[str, Any]:
        """
        Update user's preferred language

        Args:
            user_id: User UUID string
            language_data: LanguagePreferenceDTO with new language preference

        Returns:
            Dictionary with update result and new language preference
        """
        # Find user
        user = self.db.query(User).filter(User.id == user_id).first()

        if not user:
            return {
                "success": False,
                "message": "User not found"
            }

        try:
            # Update user's preferred language
            user.preferred_language = language_data.preferred_language

            # Commit changes
            self.db.commit()
            self.db.refresh(user)

            # Return success with new language
            return {
                "success": True,
                "message": "Language preference updated successfully",
                "preferred_language": user.preferred_language
            }

        except Exception as e:
            self.db.rollback()
            return {
                "success": False,
                "message": f"Error updating language preference: {str(e)}"
            }

    def get_current_language(self, user_id: str) -> Dict[str, Any]:
        """
        Get user's current preferred language

        Args:
            user_id: User UUID string

        Returns:
            Dictionary with current language preference
        """
        user = self.db.query(User).filter(User.id == user_id).first()

        if not user:
            return {
                "success": False,
                "message": "User not found"
            }

        return {
            "success": True,
            "preferred_language": user.preferred_language
        }
