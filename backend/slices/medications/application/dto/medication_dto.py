"""
Medication DTOs for medications API responses
Pydantic models for serialization of medication data
"""
from datetime import date, datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, field_serializer, field_validator


class PatientMedicationDTO(BaseModel):
    """Pydantic model for PatientMedication responses"""
    id: int
    patient_id: str  # UUID as string
    medication_name: str
    dosage: str
    frequency: str
    start_date: date
    end_date: Optional[date] = None
    is_active: bool
    notes: Optional[str] = None
    prescribed_by: Optional[str] = None
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

    @field_serializer('start_date', when_used='json')
    def serialize_start_date(self, start_date) -> str:
        """Serialize date as ISO string"""
        return start_date.isoformat()

    @field_serializer('end_date', when_used='json')
    def serialize_end_date(self, end_date) -> Optional[str]:
        """Serialize date as ISO string"""
        return end_date.isoformat() if end_date else None

    @field_serializer('created_at', when_used='json')
    def serialize_created_at(self, created_at) -> str:
        """Serialize datetime as ISO string"""
        return created_at.isoformat()

    @field_serializer('updated_at', when_used='json')
    def serialize_updated_at(self, updated_at) -> str:
        """Serialize datetime as ISO string"""
        return updated_at.isoformat()

    class Config:
        from_attributes = True  # For Pydantic v2 compatibility


# Input DTOs for creating/updating medication data
class CreateMedicationDTO(BaseModel):
    """DTO for creating a new medication"""
    medication_name: str
    dosage: str
    frequency: str
    start_date: date
    end_date: Optional[date] = None
    is_active: bool = True
    notes: Optional[str] = None
    prescribed_by: Optional[str] = None


class UpdateMedicationDTO(BaseModel):
    """DTO for updating a medication"""
    medication_name: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: Optional[bool] = None
    notes: Optional[str] = None
    prescribed_by: Optional[str] = None