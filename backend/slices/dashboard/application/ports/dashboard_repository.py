"""
Dashboard repository port interface
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from slices.dashboard.domain.models.medical_models import (
    PatientMedication,
    PatientAllergy,
    PatientSurgery,
    PatientIllness,
    DashboardActivityLog
)
from slices.dashboard.domain.entities.dashboard_stats import DashboardStats, MedicalDataSummary


class DashboardRepositoryPort(ABC):
    """Port interface for dashboard repository operations"""

    # Dashboard Statistics
    @abstractmethod
    async def get_dashboard_stats(self, patient_id: UUID) -> DashboardStats:
        """Get aggregated dashboard statistics for a patient"""
        pass

    @abstractmethod
    async def get_medical_data_summary(self, patient_id: UUID) -> MedicalDataSummary:
        """Get summary of all medical data for a patient"""
        pass

    # Medication operations
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
        """Delete a medication record (with patient ownership check)"""
        pass

    # Allergy operations
    @abstractmethod
    async def get_allergies(self, patient_id: UUID) -> List[PatientAllergy]:
        """Get all allergies for a patient"""
        pass

    @abstractmethod
    async def create_allergy(self, allergy: PatientAllergy) -> PatientAllergy:
        """Create a new allergy record"""
        pass

    @abstractmethod
    async def update_allergy(self, allergy_id: int, allergy_data: dict) -> Optional[PatientAllergy]:
        """Update an allergy record"""
        pass

    @abstractmethod
    async def delete_allergy(self, allergy_id: int, patient_id: UUID) -> bool:
        """Delete an allergy record (with patient ownership check)"""
        pass

    # Surgery operations
    @abstractmethod
    async def get_surgeries(self, patient_id: UUID) -> List[PatientSurgery]:
        """Get all surgeries for a patient"""
        pass

    @abstractmethod
    async def create_surgery(self, surgery: PatientSurgery) -> PatientSurgery:
        """Create a new surgery record"""
        pass

    @abstractmethod
    async def update_surgery(self, surgery_id: int, surgery_data: dict) -> Optional[PatientSurgery]:
        """Update a surgery record"""
        pass

    @abstractmethod
    async def delete_surgery(self, surgery_id: int, patient_id: UUID) -> bool:
        """Delete a surgery record (with patient ownership check)"""
        pass

    # Illness operations
    @abstractmethod
    async def get_illnesses(self, patient_id: UUID) -> List[PatientIllness]:
        """Get all illnesses for a patient"""
        pass

    @abstractmethod
    async def create_illness(self, illness: PatientIllness) -> PatientIllness:
        """Create a new illness record"""
        pass

    @abstractmethod
    async def update_illness(self, illness_id: int, illness_data: dict) -> Optional[PatientIllness]:
        """Update an illness record"""
        pass

    @abstractmethod
    async def delete_illness(self, illness_id: int, patient_id: UUID) -> bool:
        """Delete an illness record (with patient ownership check)"""
        pass

    # Activity logging
    @abstractmethod
    async def log_activity(self, activity: DashboardActivityLog) -> DashboardActivityLog:
        """Log dashboard activity"""
        pass