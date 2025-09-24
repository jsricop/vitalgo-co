"""
Allergies API endpoints with authentication
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from shared.database.database import get_db
from slices.auth.infrastructure.api.auth_endpoints import get_current_user
from slices.signup.domain.models.user_model import User
from slices.signup.domain.models.patient_model import Patient

from slices.allergies.application.use_cases.manage_allergies import ManageAllergiesUseCase
from slices.allergies.infrastructure.repositories.allergy_repository import AllergyRepository
from slices.allergies.application.dto.allergy_dto import (
    PatientAllergyDTO,
    CreateAllergyDTO,
    UpdateAllergyDTO
)

router = APIRouter(prefix="/api/allergies", tags=["Allergies"])


def get_allergy_use_case(db: Session = Depends(get_db)) -> ManageAllergiesUseCase:
    """Dependency to get allergy use case"""
    allergy_repository = AllergyRepository(db)
    return ManageAllergiesUseCase(allergy_repository)


async def get_patient_from_user(user: User, db: Session) -> Patient:
    """Get patient record from authenticated user"""
    patient = db.query(Patient).filter(Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient record not found"
        )
    return patient


@router.get("/", response_model=List[PatientAllergyDTO])
async def get_allergies(
    current_user: User = Depends(get_current_user),
    allergy_use_case: ManageAllergiesUseCase = Depends(get_allergy_use_case),
    db: Session = Depends(get_db)
):
    """Get all allergies for authenticated patient"""
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can access allergy data"
        )

    patient = await get_patient_from_user(current_user, db)
    return await allergy_use_case.get_patient_allergies(patient.id)


@router.get("/{allergy_id}", response_model=PatientAllergyDTO)
async def get_allergy(
    allergy_id: int,
    current_user: User = Depends(get_current_user),
    allergy_use_case: ManageAllergiesUseCase = Depends(get_allergy_use_case),
    db: Session = Depends(get_db)
):
    """Get a specific allergy by ID"""
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can access allergy data"
        )

    patient = await get_patient_from_user(current_user, db)
    allergy = await allergy_use_case.get_allergy_by_id(allergy_id, patient.id)

    if not allergy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Allergy not found"
        )

    return allergy


@router.post("/", response_model=PatientAllergyDTO, status_code=status.HTTP_201_CREATED)
async def create_allergy(
    allergy_data: CreateAllergyDTO,
    current_user: User = Depends(get_current_user),
    allergy_use_case: ManageAllergiesUseCase = Depends(get_allergy_use_case),
    db: Session = Depends(get_db)
):
    """Create a new allergy record"""
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can create allergy records"
        )

    patient = await get_patient_from_user(current_user, db)
    return await allergy_use_case.create_allergy(allergy_data, patient.id)


@router.put("/{allergy_id}", response_model=PatientAllergyDTO)
async def update_allergy(
    allergy_id: int,
    allergy_data: UpdateAllergyDTO,
    current_user: User = Depends(get_current_user),
    allergy_use_case: ManageAllergiesUseCase = Depends(get_allergy_use_case),
    db: Session = Depends(get_db)
):
    """Update an existing allergy record"""
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can update allergy records"
        )

    patient = await get_patient_from_user(current_user, db)
    updated_allergy = await allergy_use_case.update_allergy(allergy_id, allergy_data, patient.id)

    if not updated_allergy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Allergy not found"
        )

    return updated_allergy


@router.delete("/{allergy_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_allergy(
    allergy_id: int,
    current_user: User = Depends(get_current_user),
    allergy_use_case: ManageAllergiesUseCase = Depends(get_allergy_use_case),
    db: Session = Depends(get_db)
):
    """Delete an allergy record"""
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can delete allergy records"
        )

    patient = await get_patient_from_user(current_user, db)
    success = await allergy_use_case.delete_allergy(allergy_id, patient.id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Allergy not found"
        )