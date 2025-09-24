"""
Get dashboard data use case - ONLY summary/statistics operations
"""
from slices.dashboard.application.ports.dashboard_repository import DashboardRepositoryPort
from slices.dashboard.domain.entities.dashboard_stats import DashboardData
from slices.signup.domain.models.user_model import User
from slices.signup.domain.models.patient_model import Patient


class GetDashboardDataUseCase:
    """Use case for retrieving complete dashboard data for a patient"""

    def __init__(self, dashboard_repository: DashboardRepositoryPort):
        self.dashboard_repository = dashboard_repository

    async def execute(self, user: User, patient: Patient) -> DashboardData:
        """
        Execute the use case to get complete dashboard data

        Args:
            user: Authenticated user
            patient: Patient record

        Returns:
            DashboardData: Complete dashboard data including stats and medical summary
        """
        # Get dashboard statistics
        stats = await self.dashboard_repository.get_dashboard_stats(patient.id)

        # Get medical data summary
        medical_summary = await self.dashboard_repository.get_medical_data_summary(patient.id)

        # Get recent medications (returns empty list for now to avoid conversion issues)
        recent_medications = []

        # Get recent activities (returns empty list for now to avoid conversion issues)
        recent_activities = []

        # Check if this is first visit (no previous activity)
        is_first_visit = stats.last_login is None

        # Build complete dashboard data
        dashboard_data = DashboardData(
            user_id=str(user.id),
            patient_id=str(patient.id),
            full_name=patient.full_name,
            email=user.email,
            stats=stats,
            medical_summary=medical_summary,
            recent_medications=recent_medications,
            recent_activities=recent_activities,
            is_first_visit=is_first_visit
        )

        return dashboard_data