"""
Emergency API Router
FastAPI router for emergency QR code and medical data endpoints
"""
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from shared.database import get_db
from slices.auth.infrastructure.api.auth_endpoints import get_current_user
from slices.emergency.infrastructure.persistence.emergency_qr_repository import EmergencyQRRepository
from slices.emergency.application.use_cases.generate_qr_use_case import GenerateQRUseCase
from slices.emergency.application.use_cases.get_emergency_data_use_case import GetEmergencyDataUseCase
from slices.emergency.application.dto.emergency_data_dto import (
    CreateEmergencyQRRequest, EmergencyQRResponse, EmergencyDataDto, EmergencyQRDto
)
from slices.signup.infrastructure.persistence.patient_repository import PatientRepository
# Remove the User import since get_current_user returns dict

# Create router
router = APIRouter(prefix="/api/v1/emergency", tags=["emergency"])


@router.post("/qr", response_model=EmergencyQRResponse)
async def generate_emergency_qr(
    request: CreateEmergencyQRRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate or retrieve emergency QR code for the authenticated user
    Only the user can generate their own QR code
    """
    try:
        # Initialize repositories and use case
        emergency_qr_repository = EmergencyQRRepository(db)
        patient_repository = PatientRepository(db)
        use_case = GenerateQRUseCase(emergency_qr_repository, patient_repository)

        # Execute use case
        result = use_case.execute(
            user_id=current_user["id"],
            expires_in_days=request.expires_in_days
        )

        return result

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate emergency QR code"
        )


@router.get("/qr", response_model=Optional[EmergencyQRResponse])
async def get_user_emergency_qr(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's active emergency QR code
    Returns None if no active QR exists
    """
    try:
        # Initialize repositories
        emergency_qr_repository = EmergencyQRRepository(db)
        patient_repository = PatientRepository(db)

        # Get patient
        patient = patient_repository.get_by_user_id(current_user["id"])
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient profile not found"
            )

        # Get active QR
        active_qr = emergency_qr_repository.get_active_by_patient_id(patient.id)

        if not active_qr or not active_qr.is_valid:
            return None

        return EmergencyQRResponse(
            qr_code=EmergencyQRDto.from_orm(active_qr),
            emergency_url=active_qr.emergency_url
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve emergency QR code"
        )


@router.get("/{qr_uuid}", response_model=EmergencyDataDto)
async def get_emergency_data(
    qr_uuid: UUID,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get emergency medical data by QR code UUID
    Only the owner of the QR code can access their medical data
    """
    try:
        # Initialize repositories and use case
        emergency_qr_repository = EmergencyQRRepository(db)
        patient_repository = PatientRepository(db)
        use_case = GetEmergencyDataUseCase(emergency_qr_repository, patient_repository, db)

        # Execute use case
        result = use_case.execute(
            qr_uuid=qr_uuid,
            requesting_user_id=current_user["id"]
        )

        return result

    except ValueError as e:
        if "not found" in str(e):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        elif "expired" in str(e) or "inactive" in str(e):
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail=str(e)
            )
        elif "Access denied" in str(e):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=str(e)
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve emergency data"
        )


@router.post("/{qr_uuid}/regenerate", response_model=EmergencyQRResponse)
async def regenerate_emergency_qr(
    qr_uuid: UUID,
    request: CreateEmergencyQRRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Regenerate emergency QR code (invalidates old one)
    Only the owner can regenerate their QR code
    """
    try:
        # Initialize repositories
        emergency_qr_repository = EmergencyQRRepository(db)
        patient_repository = PatientRepository(db)

        # Verify ownership of the QR code
        existing_qr = emergency_qr_repository.get_by_uuid(qr_uuid)
        if not existing_qr:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Emergency QR code not found"
            )

        # Get patient and verify ownership
        patient = patient_repository.get_by_user_id(current_user["id"])
        if not patient or existing_qr.patient_id != patient.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: QR code belongs to different user"
            )

        # Generate new QR (this will deactivate existing ones)
        use_case = GenerateQRUseCase(emergency_qr_repository, patient_repository)
        result = use_case.execute(
            user_id=current_user["id"],
            expires_in_days=request.expires_in_days
        )

        return result

    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to regenerate emergency QR code"
        )