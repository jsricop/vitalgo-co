"""
Profile Completeness Data Transfer Object
"""
from pydantic import BaseModel, Field
from typing import Optional, List


class ProfileCompletenessDto(BaseModel):
    """DTO for user profile completeness information"""

    profile_completed: bool = Field(
        ...,
        description="Whether the user has completed their basic profile",
        example=False
    )

    mandatory_fields_completed: bool = Field(
        ...,
        description="Whether the user has completed all mandatory medical profile fields",
        example=False
    )

    completion_percentage: int = Field(
        ...,
        ge=0,
        le=100,
        description="Overall profile completion percentage",
        example=65
    )

    missing_basic_fields: List[str] = Field(
        default_factory=list,
        description="List of missing basic profile fields",
        example=["phone", "date_of_birth"]
    )

    missing_mandatory_fields: List[str] = Field(
        default_factory=list,
        description="List of missing mandatory medical fields",
        example=["emergency_contact", "medical_conditions"]
    )

    next_step_url: Optional[str] = Field(
        None,
        description="URL to the next step in profile completion",
        example="/completar-perfil-medico"
    )

    next_step_title: Optional[str] = Field(
        None,
        description="Title for the next step in profile completion",
        example="Completar información médica"
    )

    class Config:
        """Pydantic configuration"""
        json_schema_extra = {
            "example": {
                "profile_completed": False,
                "mandatory_fields_completed": False,
                "completion_percentage": 65,
                "missing_basic_fields": ["phone", "date_of_birth"],
                "missing_mandatory_fields": ["emergency_contact", "medical_conditions"],
                "next_step_url": "/completar-perfil-medico",
                "next_step_title": "Completar información médica"
            }
        }