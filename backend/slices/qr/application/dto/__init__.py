"""
QR DTOs for API responses
Pydantic models for QR code data transfer
"""
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, field_serializer

from slices.qr.application.dto.qr_response_dto import QRResponseDTO


class QRCodeResponseDTO(BaseModel):
    """DTO for QR code generation response"""
    qr_code: UUID
    emergency_url: str
    qr_image_base64: str

    @field_serializer('qr_code')
    def serialize_qr_code(self, value: UUID) -> str:
        return str(value)

    class Config:
        from_attributes = True


class EmergencyPatientResponseDTO(BaseModel):
    """DTO for emergency patient data response"""
    full_name: str
    blood_type: Optional[str] = None
    emergency_contact: Optional[str] = None
    critical_allergies: List[str] = []
    current_medications: List[str] = []
    chronic_conditions: List[str] = []

    class Config:
        from_attributes = True


class QRDataDTO(BaseModel):
    """DTO for patient QR code metadata"""
    patient_id: UUID
    qr_code: UUID
    emergency_url: str
    has_qr_image: bool = False

    @field_serializer('patient_id', 'qr_code')
    def serialize_uuid(self, value: UUID) -> str:
        return str(value)

    class Config:
        from_attributes = True


__all__ = [
    'QRResponseDTO',
    'QRCodeResponseDTO',
    'EmergencyPatientResponseDTO',
    'QRDataDTO'
]