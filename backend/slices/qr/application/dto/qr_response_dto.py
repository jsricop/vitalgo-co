"""
QR Response DTOs
Data Transfer Objects for QR API responses
"""
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, field_serializer
from datetime import datetime


class QRResponseDTO(BaseModel):
    """Response DTO for patient QR code information"""
    qr_uuid: str
    qr_url: str
    created_at: datetime
    expires_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

    @field_serializer('created_at', when_used='json')
    def serialize_created_at(self, value: datetime, _info) -> str:
        """Serialize datetime to ISO format string"""
        return value.isoformat() if value else None

    @field_serializer('expires_at', when_used='json')
    def serialize_expires_at(self, value: Optional[datetime], _info) -> Optional[str]:
        """Serialize optional datetime to ISO format string"""
        return value.isoformat() if value else None
