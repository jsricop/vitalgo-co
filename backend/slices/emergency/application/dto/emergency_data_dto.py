"""
Emergency Data DTOs
Data transfer objects for emergency medical information
"""
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class EmergencyContactDto(BaseModel):
    """Emergency contact information"""
    name: str
    relationship: str
    phone: str
    phone_alt: Optional[str] = None


class MedicationDto(BaseModel):
    """Current medication information"""
    name: str
    dosage: str
    frequency: str
    prescribed_by: str
    start_date: datetime
    notes: Optional[str] = None


class AllergyDto(BaseModel):
    """Allergy information"""
    allergen: str
    severity: str
    symptoms: str
    treatment: str
    diagnosis_date: datetime
    notes: Optional[str] = None


class DiseaseDto(BaseModel):
    """Disease/condition information"""
    condition: str
    diagnosis_date: datetime
    status: str
    cie10_code: Optional[str] = None
    notes: Optional[str] = None


class SurgeryDto(BaseModel):
    """Surgery history information"""
    procedure: str
    surgery_date: datetime
    hospital: str
    surgeon: str
    complications: Optional[str] = None
    notes: Optional[str] = None


class GynecologicalHistoryDto(BaseModel):
    """Gynecological history information"""
    is_pregnant: bool
    pregnancy_weeks: Optional[int] = None
    last_menstruation_date: Optional[datetime] = None
    pregnancies_count: int
    births_count: int
    csections_count: int
    abortions_count: int
    contraceptive_method: Optional[str] = None


class EmergencyDataDto(BaseModel):
    """Complete emergency medical data"""
    # Personal Information
    full_name: str
    age: int
    biological_sex: str
    gender: str
    birth_date: datetime

    # Location Information
    residence_city: str
    residence_department: str
    birth_country: str
    occupation: str

    # Critical Medical Information
    blood_type: str

    # Social Security
    eps: str
    additional_insurance: Optional[str] = None
    complementary_plan: Optional[str] = None

    # Emergency Contact
    emergency_contact: EmergencyContactDto

    # Medical History
    medications: List[MedicationDto] = []
    allergies: List[AllergyDto] = []
    diseases: List[DiseaseDto] = []
    surgeries: List[SurgeryDto] = []

    # Gynecological History (if applicable)
    gynecological: Optional[GynecologicalHistoryDto] = None

    # QR metadata
    qr_generated_at: datetime
    qr_expires_at: Optional[datetime] = None
    last_updated: datetime


class EmergencyQRDto(BaseModel):
    """Emergency QR code information"""
    id: str
    qr_uuid: str
    generated_at: datetime
    expires_at: Optional[datetime] = None
    is_active: bool
    access_count: int = 0
    last_accessed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CreateEmergencyQRRequest(BaseModel):
    """Request to create new emergency QR"""
    expires_in_days: Optional[int] = Field(default=365, ge=1, le=3650)  # 1 day to 10 years


class EmergencyQRResponse(BaseModel):
    """Response with QR code information"""
    qr_code: EmergencyQRDto
    emergency_url: str