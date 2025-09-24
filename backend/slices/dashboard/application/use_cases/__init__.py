"""
Dashboard use cases - only dashboard summary/statistics operations
Medical CRUD operations moved to their respective dedicated slices
"""
from .get_dashboard_data import GetDashboardDataUseCase

__all__ = [
    "GetDashboardDataUseCase"
]