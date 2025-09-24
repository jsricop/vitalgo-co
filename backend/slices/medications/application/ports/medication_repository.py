"""
Medication repository port (interface)
Defines the contract for medication data access
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from slices.medications.domain.models.medication_model import PatientMedication


class MedicationRepositoryPort(ABC):
    """Abstract repository for medication operations"""

    @abstractmethod
    async def get_medications(self, patient_id: UUID) -> List[PatientMedication]:
        """Get all medications for a patient"""
        pass

    @abstractmethod
    async def create_medication(self, medication: PatientMedication) -> PatientMedication:
        """Create a new medication record"""
        pass

    @abstractmethod
    async def update_medication(self, medication_id: int, medication_data: dict) -> Optional[PatientMedication]:
        """Update a medication record"""
        pass

    @abstractmethod
    async def delete_medication(self, medication_id: int, patient_id: UUID) -> bool:
        """Delete a medication record"""
        pass

    @abstractmethod
    async def get_medication_by_id(self, medication_id: int, patient_id: UUID) -> Optional[PatientMedication]:
        """Get a specific medication by ID"""
        pass