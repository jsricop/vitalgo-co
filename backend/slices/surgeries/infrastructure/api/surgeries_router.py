"""
Surgeries API endpoints with authentication
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from shared.database.database import get_db
from slices.auth.infrastructure.api.auth_endpoints import get_current_user
from slices.signup.domain.models.user_model import User
from slices.signup.domain.models.patient_model import Patient

from slices.surgeries.application.use_cases.manage_surgeries import ManageSurgeriesUseCase
from slices.surgeries.infrastructure.repositories.surgery_repository import SurgeryRepository
from slices.surgeries.application.dto.surgery_dto import (
    PatientSurgeryDTO,
    CreateSurgeryDTO,
    UpdateSurgeryDTO
)

router = APIRouter(prefix="/api/surgeries", tags=["Surgeries"])


def get_surgery_use_case(db: Session = Depends(get_db)) -> ManageSurgeriesUseCase:
    """Dependency to get surgery use case"""
    surgery_repository = SurgeryRepository(db)
    return ManageSurgeriesUseCase(surgery_repository)


async def get_patient_from_user(user: User, db: Session) -> Patient:
    """Get patient record from authenticated user"""
    patient = db.query(Patient).filter(Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient record not found"
        )
    return patient


@router.get("/", response_model=List[PatientSurgeryDTO])
async def get_surgeries(
    current_user: User = Depends(get_current_user),
    surgery_use_case: ManageSurgeriesUseCase = Depends(get_surgery_use_case),
    db: Session = Depends(get_db)
):
    """Get all surgeries for authenticated patient"""
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can access surgery data"
        )

    patient = await get_patient_from_user(current_user, db)
    return await surgery_use_case.get_patient_surgeries(patient.id)


@router.get("/{surgery_id}", response_model=PatientSurgeryDTO)
async def get_surgery(
    surgery_id: int,
    current_user: User = Depends(get_current_user),
    surgery_use_case: ManageSurgeriesUseCase = Depends(get_surgery_use_case),
    db: Session = Depends(get_db)
):
    """Get a specific surgery by ID"""
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can access surgery data"
        )

    patient = await get_patient_from_user(current_user, db)
    surgery = await surgery_use_case.get_surgery_by_id(surgery_id, patient.id)

    if not surgery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Surgery not found"
        )

    return surgery


@router.post("/", response_model=PatientSurgeryDTO, status_code=status.HTTP_201_CREATED)
async def create_surgery(
    surgery_data: CreateSurgeryDTO,
    current_user: User = Depends(get_current_user),
    surgery_use_case: ManageSurgeriesUseCase = Depends(get_surgery_use_case),
    db: Session = Depends(get_db)
):
    """Create a new surgery record"""
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can create surgery records"
        )

    patient = await get_patient_from_user(current_user, db)
    return await surgery_use_case.create_surgery(surgery_data, patient.id)


@router.put("/{surgery_id}", response_model=PatientSurgeryDTO)
async def update_surgery(
    surgery_id: int,
    surgery_data: UpdateSurgeryDTO,
    current_user: User = Depends(get_current_user),
    surgery_use_case: ManageSurgeriesUseCase = Depends(get_surgery_use_case),
    db: Session = Depends(get_db)
):
    """Update an existing surgery record"""
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can update surgery records"
        )

    patient = await get_patient_from_user(current_user, db)
    updated_surgery = await surgery_use_case.update_surgery(surgery_id, surgery_data, patient.id)

    if not updated_surgery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Surgery not found"
        )

    return updated_surgery


@router.delete("/{surgery_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_surgery(
    surgery_id: int,
    current_user: User = Depends(get_current_user),
    surgery_use_case: ManageSurgeriesUseCase = Depends(get_surgery_use_case),
    db: Session = Depends(get_db)
):
    """Delete a surgery record"""
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can delete surgery records"
        )

    patient = await get_patient_from_user(current_user, db)
    success = await surgery_use_case.delete_surgery(surgery_id, patient.id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Surgery not found"
        )