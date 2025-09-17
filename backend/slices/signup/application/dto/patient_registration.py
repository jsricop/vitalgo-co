"""
Patient registration DTOs
"""
from datetime import date, datetime
from pydantic import BaseModel, EmailStr, Field
from uuid import UUID


class PatientRegistrationDTO(BaseModel):
    """Data Transfer Object for patient registration"""

    full_name: str = Field(..., min_length=2, max_length=100, description="Patient full name")
    document_type: str = Field(..., min_length=2, max_length=5, description="Document type code")
    document_number: str = Field(..., min_length=6, max_length=20, description="Document number")
    phone_international: str = Field(..., min_length=10, max_length=20, description="Phone in international format")
    birth_date: date = Field(..., description="Birth date")
    email: EmailStr = Field(..., description="Email address")
    password: str = Field(..., min_length=8, max_length=128, description="Password")
    confirm_password: str = Field(..., min_length=8, max_length=128, description="Password confirmation")
    accept_terms: bool = Field(..., description="Accept terms and conditions")
    accept_privacy: bool = Field(..., description="Accept privacy policy")

    class Config:
        str_strip_whitespace = True
        validate_assignment = True


class PatientRegistrationResponse(BaseModel):
    """Response DTO for successful patient registration"""

    success: bool = Field(default=True, description="Registration success status")
    message: str = Field(..., description="Success message")
    user_id: UUID = Field(..., description="Created user ID")
    patient_id: UUID = Field(..., description="Created patient ID")
    qr_code: UUID = Field(..., description="Patient QR code")
    token: str = Field(..., description="JWT authentication token")
    redirect_url: str = Field(default="/completar-perfil-medico", description="Next step URL")

    class Config:
        validate_assignment = True