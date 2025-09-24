"""
Allergy DTOs for API request/response
"""
from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field, field_serializer, field_validator


class CreateAllergyDTO(BaseModel):
    """DTO for creating a new allergy"""
    allergen: str = Field(..., max_length=200, description="Allergen name")
    severity_level: str = Field(..., max_length=50, description="Severity level: leve, moderada, severa, critica")
    reaction_description: Optional[str] = Field(None, description="Description of allergic reaction")
    diagnosis_date: Optional[date] = Field(None, description="Date when allergy was diagnosed")
    notes: Optional[str] = Field(None, description="Additional notes")


class UpdateAllergyDTO(BaseModel):
    """DTO for updating an existing allergy"""
    allergen: Optional[str] = Field(None, max_length=200, description="Allergen name")
    severity_level: Optional[str] = Field(None, max_length=50, description="Severity level")
    reaction_description: Optional[str] = Field(None, description="Description of allergic reaction")
    diagnosis_date: Optional[date] = Field(None, description="Date when allergy was diagnosed")
    notes: Optional[str] = Field(None, description="Additional notes")


class PatientAllergyDTO(BaseModel):
    """DTO for allergy response with UUID string serialization"""
    id: int
    patient_id: str  # UUID as string
    allergen: str
    severity_level: str
    reaction_description: Optional[str] = None
    diagnosis_date: Optional[date] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    @field_validator('patient_id', mode='before')
    @classmethod
    def convert_uuid_to_string(cls, v):
        """Convert UUID objects to string for validation"""
        return str(v) if v is not None else None

    @field_serializer('patient_id', when_used='json')
    def serialize_patient_id(self, patient_id) -> str:
        """Ensure patient_id is always serialized as string"""
        return str(patient_id)

    @field_serializer('diagnosis_date', when_used='json')
    def serialize_diagnosis_date(self, diagnosis_date) -> Optional[str]:
        """Serialize date as ISO string"""
        return diagnosis_date.isoformat() if diagnosis_date else None

    @field_serializer('created_at', when_used='json')
    def serialize_created_at(self, created_at) -> str:
        """Serialize datetime as ISO string"""
        return created_at.isoformat()

    @field_serializer('updated_at', when_used='json')
    def serialize_updated_at(self, updated_at) -> str:
        """Serialize datetime as ISO string"""
        return updated_at.isoformat()

    class Config:
        from_attributes = True