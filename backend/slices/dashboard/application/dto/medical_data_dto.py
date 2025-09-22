"""
Medical data DTOs for dashboard API responses
Pydantic models for serialization of medical data
"""
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class PatientMedicationDTO(BaseModel):
    """Pydantic model for PatientMedication responses"""
    id: int
    patient_id: str
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

    class Config:
        from_attributes = True  # For Pydantic v2 compatibility


class PatientAllergyDTO(BaseModel):
    """Pydantic model for PatientAllergy responses"""
    id: int
    patient_id: str
    allergen: str
    severity_level: str
    reaction_description: Optional[str] = None
    diagnosis_date: Optional[date] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PatientSurgeryDTO(BaseModel):
    """Pydantic model for PatientSurgery responses"""
    id: int
    patient_id: str
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

    class Config:
        from_attributes = True


class PatientIllnessDTO(BaseModel):
    """Pydantic model for PatientIllness responses"""
    id: int
    patient_id: str
    illness_name: str
    diagnosis_date: date
    status: str
    is_chronic: bool
    treatment_description: Optional[str] = None
    cie10_code: Optional[str] = None
    diagnosed_by: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Input DTOs for creating/updating medical data
class CreateMedicationDTO(BaseModel):
    """DTO for creating a new medication"""
    medication_name: str
    dosage: str
    frequency: str
    start_date: date
    end_date: Optional[date] = None
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


class CreateAllergyDTO(BaseModel):
    """DTO for creating a new allergy"""
    allergen: str
    severity_level: str
    reaction_description: Optional[str] = None
    diagnosis_date: Optional[date] = None
    notes: Optional[str] = None


class UpdateAllergyDTO(BaseModel):
    """DTO for updating an allergy"""
    allergen: Optional[str] = None
    severity_level: Optional[str] = None
    reaction_description: Optional[str] = None
    diagnosis_date: Optional[date] = None
    notes: Optional[str] = None


class CreateSurgeryDTO(BaseModel):
    """DTO for creating a new surgery"""
    procedure_name: str
    surgery_date: date
    hospital_name: Optional[str] = None
    surgeon_name: Optional[str] = None
    anesthesia_type: Optional[str] = None
    duration_hours: Optional[int] = None
    notes: Optional[str] = None
    complications: Optional[str] = None


class UpdateSurgeryDTO(BaseModel):
    """DTO for updating a surgery"""
    procedure_name: Optional[str] = None
    surgery_date: Optional[date] = None
    hospital_name: Optional[str] = None
    surgeon_name: Optional[str] = None
    anesthesia_type: Optional[str] = None
    duration_hours: Optional[int] = None
    notes: Optional[str] = None
    complications: Optional[str] = None


class CreateIllnessDTO(BaseModel):
    """DTO for creating a new illness"""
    illness_name: str
    diagnosis_date: date
    status: str
    is_chronic: bool = False
    treatment_description: Optional[str] = None
    cie10_code: Optional[str] = None
    diagnosed_by: Optional[str] = None
    notes: Optional[str] = None


class UpdateIllnessDTO(BaseModel):
    """DTO for updating an illness"""
    illness_name: Optional[str] = None
    diagnosis_date: Optional[date] = None
    status: Optional[str] = None
    is_chronic: Optional[bool] = None
    treatment_description: Optional[str] = None
    cie10_code: Optional[str] = None
    diagnosed_by: Optional[str] = None
    notes: Optional[str] = None