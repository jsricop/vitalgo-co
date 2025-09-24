"""
Illness repository port interface
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from slices.illnesses.domain.models.illness_model import PatientIllness


class IllnessRepositoryPort(ABC):
    """Port interface for illness repository operations"""

    @abstractmethod
    async def get_illnesses_by_patient_id(self, patient_id: UUID) -> List[PatientIllness]:
        """Get all illnesses for a specific patient"""
        pass

    @abstractmethod
    async def get_illness_by_id(self, illness_id: int, patient_id: UUID) -> Optional[PatientIllness]:
        """Get a specific illness by ID with patient ownership verification"""
        pass

    @abstractmethod
    async def create_illness(self, illness: PatientIllness) -> PatientIllness:
        """Create a new illness record"""
        pass

    @abstractmethod
    async def update_illness(self, illness_id: int, illness_data: dict, patient_id: UUID) -> Optional[PatientIllness]:
        """Update an existing illness record with patient ownership verification"""
        pass

    @abstractmethod
    async def delete_illness(self, illness_id: int, patient_id: UUID) -> bool:
        """Delete an illness record with patient ownership verification"""
        pass