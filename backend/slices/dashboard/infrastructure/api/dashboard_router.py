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

from slices.dashboard.application.use_cases import GetDashboardDataUseCase, ManageMedicalDataUseCase
from slices.dashboard.infrastructure.repositories.dashboard_repository import DashboardRepository
from slices.dashboard.application.dto.dashboard_dto import DashboardDataDTO
from slices.dashboard.application.dto.medical_data_dto import (
    PatientMedicationDTO,
    PatientAllergyDTO,
    PatientSurgeryDTO,
    PatientIllnessDTO,
    CreateMedicationDTO,
    UpdateMedicationDTO,
    CreateAllergyDTO,
    UpdateAllergyDTO,
    CreateSurgeryDTO,
    UpdateSurgeryDTO,
    CreateIllnessDTO,
    UpdateIllnessDTO
)

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


def get_dashboard_use_case(db: Session = Depends(get_db)) -> GetDashboardDataUseCase:
    """Dependency to get dashboard use case"""
    dashboard_repository = DashboardRepository(db)
    return GetDashboardDataUseCase(dashboard_repository)


def get_medical_data_use_case(db: Session = Depends(get_db)) -> ManageMedicalDataUseCase:
    """Dependency to get medical data use case"""
    dashboard_repository = DashboardRepository(db)
    return ManageMedicalDataUseCase(dashboard_repository)


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


# Medication endpoints
@router.get("/medications", response_model=List[PatientMedicationDTO])
async def get_medications(
    current_user: User = Depends(get_current_user),
    medical_use_case: ManageMedicalDataUseCase = Depends(get_medical_data_use_case),
    db: Session = Depends(get_db)
):
    """Get all medications for authenticated patient"""
    patient = await get_patient_from_user(current_user, db)
    return await medical_use_case.get_medications(patient.id)


@router.post("/medications", response_model=PatientMedicationDTO)
async def create_medication(
    medication_data: CreateMedicationDTO,
    request: Request,
    current_user: User = Depends(get_current_user),
    medical_use_case: ManageMedicalDataUseCase = Depends(get_medical_data_use_case),
    db: Session = Depends(get_db)
):
    """Create new medication record"""
    patient = await get_patient_from_user(current_user, db)
    return await medical_use_case.create_medication(
        medication_data,
        patient.id,
        current_user
    )


@router.put("/medications/{medication_id}", response_model=PatientMedicationDTO)
async def update_medication(
    medication_id: int,
    medication_data: UpdateMedicationDTO,
    current_user: User = Depends(get_current_user),
    medical_use_case: ManageMedicalDataUseCase = Depends(get_medical_data_use_case),
    db: Session = Depends(get_db)
):
    """Update medication record"""
    patient = await get_patient_from_user(current_user, db)
    updated = await medical_use_case.update_medication(
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
    return updated


@router.delete("/medications/{medication_id}")
async def delete_medication(
    medication_id: int,
    current_user: User = Depends(get_current_user),
    medical_use_case: ManageMedicalDataUseCase = Depends(get_medical_data_use_case),
    db: Session = Depends(get_db)
):
    """Delete medication record"""
    patient = await get_patient_from_user(current_user, db)
    success = await medical_use_case.delete_medication(
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


# Allergy endpoints
@router.get("/allergies", response_model=List[PatientAllergyDTO])
async def get_allergies(
    current_user: User = Depends(get_current_user),
    medical_use_case: ManageMedicalDataUseCase = Depends(get_medical_data_use_case),
    db: Session = Depends(get_db)
):
    """Get all allergies for authenticated patient"""
    patient = await get_patient_from_user(current_user, db)
    return await medical_use_case.get_allergies(patient.id)


@router.post("/allergies", response_model=PatientAllergyDTO)
async def create_allergy(
    allergy_data: CreateAllergyDTO,
    current_user: User = Depends(get_current_user),
    medical_use_case: ManageMedicalDataUseCase = Depends(get_medical_data_use_case),
    db: Session = Depends(get_db)
):
    """Create new allergy record"""
    patient = await get_patient_from_user(current_user, db)
    return await medical_use_case.create_allergy(
        allergy_data,
        patient.id,
        current_user
    )


@router.put("/allergies/{allergy_id}", response_model=PatientAllergyDTO)
async def update_allergy(
    allergy_id: int,
    allergy_data: UpdateAllergyDTO,
    current_user: User = Depends(get_current_user),
    medical_use_case: ManageMedicalDataUseCase = Depends(get_medical_data_use_case),
    db: Session = Depends(get_db)
):
    """Update allergy record"""
    patient = await get_patient_from_user(current_user, db)
    updated = await medical_use_case.update_allergy(
        allergy_id,
        allergy_data,
        patient.id,
        current_user
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Allergy not found"
        )
    return updated


@router.delete("/allergies/{allergy_id}")
async def delete_allergy(
    allergy_id: int,
    current_user: User = Depends(get_current_user),
    medical_use_case: ManageMedicalDataUseCase = Depends(get_medical_data_use_case),
    db: Session = Depends(get_db)
):
    """Delete allergy record"""
    patient = await get_patient_from_user(current_user, db)
    success = await medical_use_case.delete_allergy(
        allergy_id,
        patient.id,
        current_user
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Allergy not found"
        )
    return {"message": "Allergy deleted successfully"}


# Surgery endpoints
@router.get("/surgeries", response_model=List[PatientSurgeryDTO])
async def get_surgeries(
    current_user: User = Depends(get_current_user),
    medical_use_case: ManageMedicalDataUseCase = Depends(get_medical_data_use_case),
    db: Session = Depends(get_db)
):
    """Get all surgeries for authenticated patient"""
    patient = await get_patient_from_user(current_user, db)
    return await medical_use_case.get_surgeries(patient.id)


@router.post("/surgeries", response_model=PatientSurgeryDTO)
async def create_surgery(
    surgery_data: CreateSurgeryDTO,
    current_user: User = Depends(get_current_user),
    medical_use_case: ManageMedicalDataUseCase = Depends(get_medical_data_use_case),
    db: Session = Depends(get_db)
):
    """Create new surgery record"""
    patient = await get_patient_from_user(current_user, db)
    return await medical_use_case.create_surgery(
        surgery_data,
        patient.id,
        current_user
    )


@router.put("/surgeries/{surgery_id}", response_model=PatientSurgeryDTO)
async def update_surgery(
    surgery_id: int,
    surgery_data: UpdateSurgeryDTO,
    current_user: User = Depends(get_current_user),
    medical_use_case: ManageMedicalDataUseCase = Depends(get_medical_data_use_case),
    db: Session = Depends(get_db)
):
    """Update surgery record"""
    patient = await get_patient_from_user(current_user, db)
    updated = await medical_use_case.update_surgery(
        surgery_id,
        surgery_data,
        patient.id,
        current_user
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Surgery not found"
        )
    return updated


@router.delete("/surgeries/{surgery_id}")
async def delete_surgery(
    surgery_id: int,
    current_user: User = Depends(get_current_user),
    medical_use_case: ManageMedicalDataUseCase = Depends(get_medical_data_use_case),
    db: Session = Depends(get_db)
):
    """Delete surgery record"""
    patient = await get_patient_from_user(current_user, db)
    success = await medical_use_case.delete_surgery(
        surgery_id,
        patient.id,
        current_user
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Surgery not found"
        )
    return {"message": "Surgery deleted successfully"}


# Illness endpoints
@router.get("/illnesses", response_model=List[PatientIllnessDTO])
async def get_illnesses(
    current_user: User = Depends(get_current_user),
    medical_use_case: ManageMedicalDataUseCase = Depends(get_medical_data_use_case),
    db: Session = Depends(get_db)
):
    """Get all illnesses for authenticated patient"""
    patient = await get_patient_from_user(current_user, db)
    return await medical_use_case.get_illnesses(patient.id)


@router.post("/illnesses", response_model=PatientIllnessDTO)
async def create_illness(
    illness_data: CreateIllnessDTO,
    current_user: User = Depends(get_current_user),
    medical_use_case: ManageMedicalDataUseCase = Depends(get_medical_data_use_case),
    db: Session = Depends(get_db)
):
    """Create new illness record"""
    patient = await get_patient_from_user(current_user, db)
    return await medical_use_case.create_illness(
        illness_data,
        patient.id,
        current_user
    )


@router.put("/illnesses/{illness_id}", response_model=PatientIllnessDTO)
async def update_illness(
    illness_id: int,
    illness_data: UpdateIllnessDTO,
    current_user: User = Depends(get_current_user),
    medical_use_case: ManageMedicalDataUseCase = Depends(get_medical_data_use_case),
    db: Session = Depends(get_db)
):
    """Update illness record"""
    patient = await get_patient_from_user(current_user, db)
    updated = await medical_use_case.update_illness(
        illness_id,
        illness_data,
        patient.id,
        current_user
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Illness not found"
        )
    return updated


@router.delete("/illnesses/{illness_id}")
async def delete_illness(
    illness_id: int,
    current_user: User = Depends(get_current_user),
    medical_use_case: ManageMedicalDataUseCase = Depends(get_medical_data_use_case),
    db: Session = Depends(get_db)
):
    """Delete illness record"""
    patient = await get_patient_from_user(current_user, db)
    success = await medical_use_case.delete_illness(
        illness_id,
        patient.id,
        current_user
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Illness not found"
        )
    return {"message": "Illness deleted successfully"}