"""
Dashboard use cases
"""
from .get_dashboard_data import GetDashboardDataUseCase
from .manage_medical_data import ManageMedicalDataUseCase

__all__ = [
    "GetDashboardDataUseCase",
    "ManageMedicalDataUseCase"
]