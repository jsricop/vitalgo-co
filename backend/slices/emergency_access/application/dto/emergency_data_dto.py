"""
Emergency Data DTOs for paramedic access
"""
from pydantic import BaseModel, field_serializer
from typing import List, Optional
from datetime import date


class EmergencyMedicationDTO(BaseModel):
    """Medication data for emergency access"""
    medication_name: str
    dosage: str
    frequency: str
    is_active: bool
    notes: Optional[str] = None
    prescribed_by: Optional[str] = None


class EmergencyAllergyDTO(BaseModel):
    """Allergy data for emergency access"""
    allergen: str
    severity_level: str
    reaction_description: Optional[str] = None
    notes: Optional[str] = None


class EmergencySurgeryDTO(BaseModel):
    """Surgery data for emergency access"""
    procedure_name: str
    surgery_date: date
    hospital_name: Optional[str] = None
    complications: Optional[str] = None

    @field_serializer('surgery_date', when_used='json')
    def serialize_date(self, value: date, _info) -> str:
        return value.isoformat() if value else None


class EmergencyIllnessDTO(BaseModel):
    """Illness data for emergency access"""
    illness_name: str
    diagnosis_date: date
    status: str
    is_chronic: bool
    treatment_description: Optional[str] = None
    cie10_code: Optional[str] = None

    @field_serializer('diagnosis_date', when_used='json')
    def serialize_date(self, value: date, _info) -> str:
        return value.isoformat() if value else None


class EmergencyDataResponseDTO(BaseModel):
    """Complete emergency data response for paramedics"""

    # Basic Information
    full_name: str
    document_type: str
    document_number: str
    birth_date: date
    biological_sex: Optional[str] = None
    gender: Optional[str] = None

    # Personal Information
    blood_type: Optional[str] = None
    eps: Optional[str] = None
    occupation: Optional[str] = None
    residence_address: Optional[str] = None
    residence_country: Optional[str] = None
    residence_city: Optional[str] = None

    # Emergency Contacts
    emergency_contact_name: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_phone_alt: Optional[str] = None

    # Medical Information
    medications: List[EmergencyMedicationDTO] = []
    allergies: List[EmergencyAllergyDTO] = []
    surgeries: List[EmergencySurgeryDTO] = []
    illnesses: List[EmergencyIllnessDTO] = []

    # Gynecological Information (only if biological_sex == 'F')
    is_pregnant: Optional[bool] = None
    pregnancy_weeks: Optional[int] = None
    last_menstruation_date: Optional[date] = None
    pregnancies_count: Optional[int] = None
    births_count: Optional[int] = None
    cesareans_count: Optional[int] = None
    abortions_count: Optional[int] = None
    contraceptive_method: Optional[str] = None

    model_config = {"from_attributes": True}

    @field_serializer('birth_date', when_used='json')
    def serialize_birth_date(self, value: date, _info) -> str:
        return value.isoformat() if value else None

    @field_serializer('last_menstruation_date', when_used='json')
    def serialize_menstruation_date(self, value: Optional[date], _info) -> Optional[str]:
        return value.isoformat() if value else None
