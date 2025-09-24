"""
Allergy repository port interface
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from slices.allergies.domain.models.allergy_model import PatientAllergy


class AllergyRepositoryPort(ABC):
    """Port interface for allergy repository operations"""

    @abstractmethod
    async def get_allergies_by_patient_id(self, patient_id: UUID) -> List[PatientAllergy]:
        """Get all allergies for a specific patient"""
        pass

    @abstractmethod
    async def get_allergy_by_id(self, allergy_id: int, patient_id: UUID) -> Optional[PatientAllergy]:
        """Get a specific allergy by ID with patient ownership verification"""
        pass

    @abstractmethod
    async def create_allergy(self, allergy: PatientAllergy) -> PatientAllergy:
        """Create a new allergy record"""
        pass

    @abstractmethod
    async def update_allergy(self, allergy_id: int, allergy_data: dict, patient_id: UUID) -> Optional[PatientAllergy]:
        """Update an existing allergy record with patient ownership verification"""
        pass

    @abstractmethod
    async def delete_allergy(self, allergy_id: int, patient_id: UUID) -> bool:
        """Delete an allergy record with patient ownership verification"""
        pass