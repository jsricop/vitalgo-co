"""
Language Preference DTOs for internationalization support
"""
from typing import Literal
from pydantic import BaseModel, Field


# Supported language codes (ISO 639-1)
LanguageCode = Literal["es", "en"]


class LanguagePreferenceDTO(BaseModel):
    """DTO for updating user language preference"""
    preferred_language: LanguageCode = Field(
        ...,
        description="User's preferred language code (ISO 639-1): 'es' for Spanish, 'en' for English"
    )

    class Config:
        str_strip_whitespace = True
        validate_assignment = True
        json_schema_extra = {
            "example": {
                "preferred_language": "en"
            }
        }


class LanguagePreferenceResponseDTO(BaseModel):
    """DTO for language preference response"""
    preferred_language: str = Field(
        ...,
        description="User's current preferred language code"
    )
    message: str = Field(
        ...,
        description="Success message"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "preferred_language": "en",
                "message": "Language preference updated successfully"
            }
        }
