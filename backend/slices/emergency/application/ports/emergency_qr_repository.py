"""
Emergency QR Repository Port
Defines the interface for emergency QR code persistence operations
"""
from abc import ABC, abstractmethod
from typing import Optional, List
from uuid import UUID

from slices.emergency.domain.models.emergency_qr_model import EmergencyQR


class EmergencyQRRepositoryPort(ABC):
    """Abstract port for emergency QR repository operations"""

    @abstractmethod
    def create(self, emergency_qr: EmergencyQR) -> EmergencyQR:
        """Create new emergency QR code"""
        pass

    @abstractmethod
    def get_by_uuid(self, qr_uuid: UUID) -> Optional[EmergencyQR]:
        """Get emergency QR by UUID"""
        pass

    @abstractmethod
    def get_by_patient_id(self, patient_id: UUID) -> List[EmergencyQR]:
        """Get all emergency QRs for a patient"""
        pass

    @abstractmethod
    def get_active_by_patient_id(self, patient_id: UUID) -> Optional[EmergencyQR]:
        """Get active emergency QR for a patient"""
        pass

    @abstractmethod
    def update(self, emergency_qr: EmergencyQR) -> EmergencyQR:
        """Update emergency QR"""
        pass

    @abstractmethod
    def delete(self, emergency_qr: EmergencyQR) -> None:
        """Delete emergency QR"""
        pass

    @abstractmethod
    def deactivate_patient_qrs(self, patient_id: UUID) -> None:
        """Deactivate all QR codes for a patient"""
        pass

    @abstractmethod
    def get_with_patient_data(self, qr_uuid: UUID) -> Optional[EmergencyQR]:
        """Get emergency QR with full patient data loaded"""
        pass