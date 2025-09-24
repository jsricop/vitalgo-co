"""
Dashboard API endpoints with authentication
"""
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from shared.database.database import get_db
from slices.auth.infrastructure.api.auth_endpoints import get_current_user
from slices.signup.domain.models.user_model import User
from slices.signup.domain.models.patient_model import Patient

from slices.dashboard.application.use_cases import GetDashboardDataUseCase
from slices.dashboard.infrastructure.repositories.dashboard_repository import DashboardRepository
from slices.dashboard.application.dto.dashboard_dto import DashboardDataDTO

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


def get_dashboard_use_case(db: Session = Depends(get_db)) -> GetDashboardDataUseCase:
    """Dependency to get dashboard use case"""
    dashboard_repository = DashboardRepository(db)
    return GetDashboardDataUseCase(dashboard_repository)


async def get_patient_from_user(user: User, db: Session) -> Patient:
    """Get patient record from authenticated user"""
    patient = db.query(Patient).filter(Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient record not found"
        )
    return patient


@router.get("/", response_model=DashboardDataDTO)
async def get_dashboard_data(
    current_user: User = Depends(get_current_user),
    dashboard_use_case: GetDashboardDataUseCase = Depends(get_dashboard_use_case),
    db: Session = Depends(get_db)
):
    """
    Get complete dashboard data for authenticated patient
    """
    # Ensure user is a patient
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can access dashboard data"
        )

    # Get patient record
    patient = await get_patient_from_user(current_user, db)

    # Get dashboard data
    dashboard_data = await dashboard_use_case.execute(current_user, patient)

    return dashboard_data









