"""
Medications API endpoints with authentication
"""
import json
import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import ValidationError

from shared.database.database import get_db
from slices.auth.infrastructure.api.auth_endpoints import get_current_user
from slices.signup.domain.models.user_model import User
from slices.signup.domain.models.patient_model import Patient

from slices.medications.application.use_cases.manage_medications import ManageMedicationsUseCase
from slices.medications.infrastructure.repositories.medication_repository import MedicationRepository
from slices.medications.application.dto.medication_dto import (
    PatientMedicationDTO,
    CreateMedicationDTO,
    UpdateMedicationDTO
)

# Configure logger for medication router debugging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/medications", tags=["Medications"])


def get_medications_use_case(db: Session = Depends(get_db)) -> ManageMedicationsUseCase:
    """Dependency to get medications use case"""
    medication_repository = MedicationRepository(db)
    return ManageMedicationsUseCase(medication_repository)


async def get_patient_from_user(user: User, db: Session) -> Patient:
    """Get patient record from authenticated user"""
    patient = db.query(Patient).filter(Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient record not found"
        )
    return patient


@router.get("/", response_model=List[PatientMedicationDTO])
async def get_medications(
    current_user: User = Depends(get_current_user),
    medications_use_case: ManageMedicationsUseCase = Depends(get_medications_use_case),
    db: Session = Depends(get_db)
):
    """Get all medications for authenticated patient"""
    # Ensure user is a patient
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can access medication data"
        )

    patient = await get_patient_from_user(current_user, db)
    return await medications_use_case.get_medications(patient.id)


@router.post("/", response_model=PatientMedicationDTO)
async def create_medication(
    medication_data: CreateMedicationDTO,
    current_user: User = Depends(get_current_user),
    medications_use_case: ManageMedicationsUseCase = Depends(get_medications_use_case),
    db: Session = Depends(get_db)
):
    """Create new medication record"""
    # Ensure user is a patient
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can create medication records"
        )

    patient = await get_patient_from_user(current_user, db)
    return await medications_use_case.create_medication(
        medication_data,
        patient.id,
        current_user
    )


@router.put("/{medication_id}", response_model=PatientMedicationDTO)
async def update_medication(
    medication_id: int,
    request: Request,
    current_user: User = Depends(get_current_user),
    medications_use_case: ManageMedicationsUseCase = Depends(get_medications_use_case),
    db: Session = Depends(get_db)
):
    """Update medication record with detailed validation logging"""
    # Ensure user is a patient
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can update medication records"
        )

    # Get raw request body for logging
    try:
        request_body = await request.body()
        raw_data = json.loads(request_body.decode('utf-8'))
        logger.info(f"🔍 MEDICATION UPDATE DEBUG - Raw request data: {json.dumps(raw_data, indent=2)}")
    except Exception as e:
        logger.error(f"❌ Failed to parse request body: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON in request body"
        )

    # Validate medication data with detailed error logging
    try:
        medication_data = UpdateMedicationDTO(**raw_data)
        logger.info(f"✅ MEDICATION UPDATE DEBUG - DTO validation successful: {medication_data}")
    except ValidationError as e:
        logger.error(f"❌ MEDICATION UPDATE VALIDATION ERROR: {e}")
        logger.error(f"❌ Validation error details: {e.errors()}")

        # Format validation errors for frontend consumption
        formatted_errors = []
        for error in e.errors():
            formatted_errors.append({
                "field": ".".join(str(loc) for loc in error["loc"]),
                "message": error["msg"],
                "type": error["type"]
            })

        logger.error(f"❌ Formatted validation errors: {formatted_errors}")

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "message": "Validation failed",
                "errors": formatted_errors
            }
        )
    except Exception as e:
        logger.error(f"❌ Unexpected error during DTO validation: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during validation"
        )

    patient = await get_patient_from_user(current_user, db)

    try:
        updated = await medications_use_case.update_medication(
            medication_id,
            medication_data,
            patient.id,
            current_user
        )
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medication not found"
            )

        logger.info(f"✅ MEDICATION UPDATE SUCCESS - Updated medication ID: {medication_id}")
        return updated

    except Exception as e:
        logger.error(f"❌ MEDICATION UPDATE USE CASE ERROR: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update medication: {str(e)}"
        )


@router.delete("/{medication_id}")
async def delete_medication(
    medication_id: int,
    current_user: User = Depends(get_current_user),
    medications_use_case: ManageMedicationsUseCase = Depends(get_medications_use_case),
    db: Session = Depends(get_db)
):
    """Delete medication record"""
    # Ensure user is a patient
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can delete medication records"
        )

    patient = await get_patient_from_user(current_user, db)
    success = await medications_use_case.delete_medication(
        medication_id,
        patient.id,
        current_user
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medication not found"
        )
    return {"message": "Medication deleted successfully"}


@router.get("/{medication_id}", response_model=PatientMedicationDTO)
async def get_medication_by_id(
    medication_id: int,
    current_user: User = Depends(get_current_user),
    medications_use_case: ManageMedicationsUseCase = Depends(get_medications_use_case),
    db: Session = Depends(get_db)
):
    """Get specific medication by ID"""
    # Ensure user is a patient
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can access medication data"
        )

    patient = await get_patient_from_user(current_user, db)
    medication = await medications_use_case.get_medication_by_id(medication_id, patient.id)
    if not medication:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medication not found"
        )
    return medication


@router.patch("/{medication_id}/toggle-status", response_model=PatientMedicationDTO)
async def toggle_medication_status(
    medication_id: int,
    is_active: bool,
    current_user: User = Depends(get_current_user),
    medications_use_case: ManageMedicationsUseCase = Depends(get_medications_use_case),
    db: Session = Depends(get_db)
):
    """Toggle medication active status"""
    # Ensure user is a patient
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can update medication status"
        )

    patient = await get_patient_from_user(current_user, db)
    updated = await medications_use_case.toggle_medication_status(
        medication_id,
        is_active,
        patient.id,
        current_user
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medication not found"
        )
    return updated