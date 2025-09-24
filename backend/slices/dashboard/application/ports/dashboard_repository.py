"""
Dashboard repository port interface - NO medical entity CRUD operations
Only dashboard summary/statistics operations
Medical CRUD operations belong in their respective dedicated slices
"""
from abc import ABC, abstractmethod
from uuid import UUID

from slices.dashboard.domain.entities.dashboard_stats import DashboardStats, MedicalDataSummary


class DashboardRepositoryPort(ABC):
    """Port interface for dashboard repository operations - ONLY summary/statistics"""

    @abstractmethod
    async def get_dashboard_stats(self, patient_id: UUID) -> DashboardStats:
        """Get aggregated dashboard statistics for a patient"""
        pass

    @abstractmethod
    async def get_medical_data_summary(self, patient_id: UUID) -> MedicalDataSummary:
        """Get summary of all medical data for a patient"""
        pass