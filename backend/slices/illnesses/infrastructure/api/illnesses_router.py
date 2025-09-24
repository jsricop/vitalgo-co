"""
Illnesses API endpoints with authentication
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from shared.database.database import get_db
from slices.auth.infrastructure.api.auth_endpoints import get_current_user
from slices.signup.domain.models.user_model import User
from slices.signup.domain.models.patient_model import Patient

from slices.illnesses.application.use_cases.manage_illnesses import ManageIllnessesUseCase
from slices.illnesses.infrastructure.repositories.illness_repository import IllnessRepository
from slices.illnesses.application.dto.illness_dto import (
    PatientIllnessDTO,
    CreateIllnessDTO,
    UpdateIllnessDTO
)

router = APIRouter(prefix="/api/illnesses", tags=["Illnesses"])


def get_illness_use_case(db: Session = Depends(get_db)) -> ManageIllnessesUseCase:
    """Dependency to get illness use case"""
    illness_repository = IllnessRepository(db)
    return ManageIllnessesUseCase(illness_repository)


async def get_patient_from_user(user: User, db: Session) -> Patient:
    """Get patient record from authenticated user"""
    patient = db.query(Patient).filter(Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient record not found"
        )
    return patient


@router.get("/", response_model=List[PatientIllnessDTO])
async def get_illnesses(
    current_user: User = Depends(get_current_user),
    illness_use_case: ManageIllnessesUseCase = Depends(get_illness_use_case),
    db: Session = Depends(get_db)
):
    """Get all illnesses for authenticated patient"""
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can access illness data"
        )

    patient = await get_patient_from_user(current_user, db)
    return await illness_use_case.get_patient_illnesses(patient.id)


@router.get("/{illness_id}", response_model=PatientIllnessDTO)
async def get_illness(
    illness_id: int,
    current_user: User = Depends(get_current_user),
    illness_use_case: ManageIllnessesUseCase = Depends(get_illness_use_case),
    db: Session = Depends(get_db)
):
    """Get a specific illness by ID"""
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can access illness data"
        )

    patient = await get_patient_from_user(current_user, db)
    illness = await illness_use_case.get_illness_by_id(illness_id, patient.id)

    if not illness:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Illness not found"
        )

    return illness


@router.post("/", response_model=PatientIllnessDTO, status_code=status.HTTP_201_CREATED)
async def create_illness(
    illness_data: CreateIllnessDTO,
    current_user: User = Depends(get_current_user),
    illness_use_case: ManageIllnessesUseCase = Depends(get_illness_use_case),
    db: Session = Depends(get_db)
):
    """Create a new illness record"""
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can create illness records"
        )

    patient = await get_patient_from_user(current_user, db)
    return await illness_use_case.create_illness(illness_data, patient.id)


@router.put("/{illness_id}", response_model=PatientIllnessDTO)
async def update_illness(
    illness_id: int,
    illness_data: UpdateIllnessDTO,
    current_user: User = Depends(get_current_user),
    illness_use_case: ManageIllnessesUseCase = Depends(get_illness_use_case),
    db: Session = Depends(get_db)
):
    """Update an existing illness record"""
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can update illness records"
        )

    patient = await get_patient_from_user(current_user, db)
    updated_illness = await illness_use_case.update_illness(illness_id, illness_data, patient.id)

    if not updated_illness:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Illness not found"
        )

    return updated_illness


@router.delete("/{illness_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_illness(
    illness_id: int,
    current_user: User = Depends(get_current_user),
    illness_use_case: ManageIllnessesUseCase = Depends(get_illness_use_case),
    db: Session = Depends(get_db)
):
    """Delete an illness record"""
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can delete illness records"
        )

    patient = await get_patient_from_user(current_user, db)
    success = await illness_use_case.delete_illness(illness_id, patient.id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Illness not found"
        )