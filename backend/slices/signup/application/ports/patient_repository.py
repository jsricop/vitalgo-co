"""
Patient repository interface (port)
"""
from abc import ABC, abstractmethod
from typing import Optional, List
from uuid import UUID

from slices.signup.domain.models.patient_model import Patient
from slices.signup.domain.models.document_type_model import DocumentType


class PatientRepository(ABC):
    """Interface for patient data persistence operations"""

    @abstractmethod
    async def create(self, patient: Patient) -> Patient:
        """Create a new patient"""
        pass

    @abstractmethod
    async def get_by_id(self, patient_id: UUID) -> Optional[Patient]:
        """Get patient by ID"""
        pass

    @abstractmethod
    async def get_by_user_id(self, user_id: UUID) -> Optional[Patient]:
        """Get patient by user ID"""
        pass

    @abstractmethod
    async def get_by_qr_code(self, qr_code: UUID) -> Optional[Patient]:
        """Get patient by QR code"""
        pass

    @abstractmethod
    async def document_exists(self, document_number: str) -> bool:
        """Check if document number already exists"""
        pass

    @abstractmethod
    async def get_document_types(self) -> List[DocumentType]:
        """Get all active document types"""
        pass

    @abstractmethod
    async def update(self, patient: Patient) -> Patient:
        """Update patient information"""
        pass