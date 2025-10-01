"""
QR Domain Models
Domain models for QR code functionality
"""
from typing import Optional
from uuid import UUID
from pydantic import BaseModel

from slices.qr.domain.models.qr_model import QR


class QRCodeData(BaseModel):
    """Domain model for QR code data"""
    patient_id: UUID
    qr_code: UUID
    emergency_url: str
    qr_image_base64: Optional[str] = None


class EmergencyPatientInfo(BaseModel):
    """Domain model for emergency patient information"""
    qr_code: UUID
    full_name: str
    blood_type: Optional[str] = None
    emergency_contact: Optional[str] = None
    critical_allergies: list[str] = []
    current_medications: list[str] = []
    chronic_conditions: list[str] = []


__all__ = ['QR', 'QRCodeData', 'EmergencyPatientInfo']