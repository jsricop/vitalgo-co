"""
Surgery repository port interface
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from slices.surgeries.domain.models.surgery_model import PatientSurgery


class SurgeryRepositoryPort(ABC):
    """Port interface for surgery repository operations"""

    @abstractmethod
    async def get_surgeries_by_patient_id(self, patient_id: UUID) -> List[PatientSurgery]:
        """Get all surgeries for a specific patient"""
        pass

    @abstractmethod
    async def get_surgery_by_id(self, surgery_id: int, patient_id: UUID) -> Optional[PatientSurgery]:
        """Get a specific surgery by ID with patient ownership verification"""
        pass

    @abstractmethod
    async def create_surgery(self, surgery: PatientSurgery) -> PatientSurgery:
        """Create a new surgery record"""
        pass

    @abstractmethod
    async def update_surgery(self, surgery_id: int, surgery_data: dict, patient_id: UUID) -> Optional[PatientSurgery]:
        """Update an existing surgery record with patient ownership verification"""
        pass

    @abstractmethod
    async def delete_surgery(self, surgery_id: int, patient_id: UUID) -> bool:
        """Delete a surgery record with patient ownership verification"""
        pass