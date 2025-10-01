"""
Emergency Access API Router
Provides paramedic-only access to patient emergency data via QR code
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from shared.database import get_db
from slices.auth.infrastructure.api.auth_endpoints import get_current_user
from slices.signup.domain.models.user_model import User
from slices.emergency_access.application.dto.emergency_data_dto import EmergencyDataResponseDTO
from slices.emergency_access.application.use_cases.get_emergency_data_use_case import GetEmergencyDataUseCase
from slices.emergency_access.infrastructure.repositories.emergency_data_repository import EmergencyDataRepository


router = APIRouter(prefix="/api/emergency", tags=["Emergency Access"])


def get_current_paramedic_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to verify user is a paramedic

    Args:
        current_user: Current authenticated user

    Returns:
        User object if user_type is 'paramedic'

    Raises:
        HTTPException 403: If user is not a paramedic
    """
    if current_user.user_type != "paramedic":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Only paramedics can access this endpoint."
        )
    return current_user


@router.get("/{qr_code}", response_model=EmergencyDataResponseDTO)
async def get_emergency_data(
    qr_code: UUID,
    db: Session = Depends(get_db),
    paramedic_user: User = Depends(get_current_paramedic_user)
) -> EmergencyDataResponseDTO:
    """
    Get patient emergency data by QR code

    **Paramedic-only endpoint** - Requires authentication with user_type='paramedic'

    Returns comprehensive patient information including:
    - Basic information (name, document, birth date, biological sex)
    - Personal information (blood type, EPS, occupation, address)
    - Emergency contacts
    - Medical history (medications, allergies, surgeries, illnesses)
    - Gynecological information (if biological_sex='F')

    Args:
        qr_code: Patient's unique QR code UUID
        db: Database session
        paramedic_user: Current authenticated paramedic user

    Returns:
        EmergencyDataResponseDTO with all patient emergency information

    Raises:
        HTTPException 401: If user is not authenticated
        HTTPException 403: If user is not a paramedic
        HTTPException 404: If patient not found
    """
    # Initialize repository and use case
    repository = EmergencyDataRepository(db)
    use_case = GetEmergencyDataUseCase(repository)

    # Execute use case
    result = await use_case.execute(qr_code)

    return result
