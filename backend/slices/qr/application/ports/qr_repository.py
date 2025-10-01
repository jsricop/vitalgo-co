"""
QR repository port interface
Interface for QR code data access operations
"""
from abc import ABC, abstractmethod
from uuid import UUID
from typing import Optional

from slices.qr.domain.models import EmergencyPatientInfo


class QRRepositoryPort(ABC):
    """Port interface for QR repository operations"""

    @abstractmethod
    async def get_patient_qr_code(self, patient_id: UUID) -> Optional[UUID]:
        """Get patient's QR code UUID"""
        pass

    @abstractmethod
    async def get_emergency_patient_info(self, qr_uuid: UUID) -> Optional[EmergencyPatientInfo]:
        """Get emergency patient information by QR code UUID"""
        pass

    @abstractmethod
    async def get_patient_id_by_qr_code(self, qr_uuid: UUID) -> Optional[UUID]:
        """Get patient ID by QR code UUID"""
        pass