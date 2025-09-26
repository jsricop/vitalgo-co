"""
Basic Patient Information DTOs for profile management
"""
from datetime import date
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class BasicPatientInfoDTO(BaseModel):
    """DTO for basic patient information (from signup)"""
    first_name: str = Field(..., min_length=2, max_length=100, description="Patient first name")
    last_name: str = Field(..., min_length=2, max_length=100, description="Patient last name")
    document_type: str = Field(..., min_length=2, max_length=5, description="Document type code")
    document_number: str = Field(..., min_length=6, max_length=20, description="Document number")
    phone_international: str = Field(..., min_length=10, max_length=20, description="Phone in international format")
    birth_date: date = Field(..., description="Birth date")
    origin_country: str = Field(..., min_length=2, max_length=2, description="Country of origin (ISO 3166-1 alpha-2)")
    email: EmailStr = Field(..., description="Email address")

    class Config:
        str_strip_whitespace = True
        validate_assignment = True


class BasicPatientUpdateDTO(BaseModel):
    """DTO for updating basic patient information"""
    first_name: Optional[str] = Field(None, min_length=2, max_length=100, description="Patient first name")
    last_name: Optional[str] = Field(None, min_length=2, max_length=100, description="Patient last name")
    document_type: Optional[str] = Field(None, min_length=2, max_length=5, description="Document type code")
    document_number: Optional[str] = Field(None, min_length=6, max_length=20, description="Document number")
    phone_international: Optional[str] = Field(None, min_length=10, max_length=20, description="Phone in international format")
    birth_date: Optional[date] = Field(None, description="Birth date")
    origin_country: Optional[str] = Field(None, min_length=2, max_length=2, description="Country of origin (ISO 3166-1 alpha-2)")
    email: Optional[EmailStr] = Field(None, description="Email address")

    class Config:
        str_strip_whitespace = True
        validate_assignment = True