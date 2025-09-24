"""
Surgery DTOs for API request/response
"""
from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field, field_serializer


class CreateSurgeryDTO(BaseModel):
    """DTO for creating a new surgery"""
    procedure_name: str = Field(..., max_length=300, description="Name of the surgical procedure")
    surgery_date: date = Field(..., description="Date when surgery was performed")
    hospital_name: Optional[str] = Field(None, max_length=200, description="Name of the hospital")
    surgeon_name: Optional[str] = Field(None, max_length=200, description="Name of the surgeon")
    anesthesia_type: Optional[str] = Field(None, max_length=100, description="Type of anesthesia used")
    duration_hours: Optional[int] = Field(None, ge=0, description="Duration of surgery in hours")
    notes: Optional[str] = Field(None, description="Additional notes about the surgery")
    complications: Optional[str] = Field(None, description="Any complications that occurred")


class UpdateSurgeryDTO(BaseModel):
    """DTO for updating an existing surgery"""
    procedure_name: Optional[str] = Field(None, max_length=300, description="Name of the surgical procedure")
    surgery_date: Optional[date] = Field(None, description="Date when surgery was performed")
    hospital_name: Optional[str] = Field(None, max_length=200, description="Name of the hospital")
    surgeon_name: Optional[str] = Field(None, max_length=200, description="Name of the surgeon")
    anesthesia_type: Optional[str] = Field(None, max_length=100, description="Type of anesthesia used")
    duration_hours: Optional[int] = Field(None, ge=0, description="Duration of surgery in hours")
    notes: Optional[str] = Field(None, description="Additional notes about the surgery")
    complications: Optional[str] = Field(None, description="Any complications that occurred")


class PatientSurgeryDTO(BaseModel):
    """DTO for surgery response with UUID string serialization"""
    id: int
    patient_id: str  # UUID as string
    procedure_name: str
    surgery_date: date
    hospital_name: Optional[str] = None
    surgeon_name: Optional[str] = None
    anesthesia_type: Optional[str] = None
    duration_hours: Optional[int] = None
    notes: Optional[str] = None
    complications: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    @field_serializer('patient_id', when_used='json')
    def serialize_patient_id(self, patient_id) -> str:
        """Ensure patient_id is always serialized as string"""
        return str(patient_id)

    @field_serializer('surgery_date', when_used='json')
    def serialize_surgery_date(self, surgery_date) -> str:
        """Serialize date as ISO string"""
        return surgery_date.isoformat()

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