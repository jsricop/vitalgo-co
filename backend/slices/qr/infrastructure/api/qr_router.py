"""
QR API endpoints with authentication and public emergency access
"""
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from shared.database.database import get_db
from slices.auth.infrastructure.api.auth_endpoints import get_current_user
from slices.signup.domain.models.user_model import User
from slices.signup.domain.models.patient_model import Patient
from shared.exceptions.application_exceptions import NotFoundException

from slices.qr.application.use_cases import GenerateQRCodeUseCase, GetEmergencyDataUseCase
from slices.qr.infrastructure.repositories.qr_repository import QRRepository
from slices.qr.infrastructure.services.qr_generator_service import QRGeneratorService
from slices.qr.application.dto import QRCodeResponseDTO, EmergencyPatientResponseDTO

router = APIRouter(prefix="/api/qr", tags=["QR Code"])


def get_generate_qr_use_case(db: Session = Depends(get_db)) -> GenerateQRCodeUseCase:
    """Dependency to get QR generation use case"""
    qr_repository = QRRepository(db)
    qr_generator = QRGeneratorService()
    return GenerateQRCodeUseCase(qr_repository, qr_generator)


def get_emergency_data_use_case(db: Session = Depends(get_db)) -> GetEmergencyDataUseCase:
    """Dependency to get emergency data use case"""
    qr_repository = QRRepository(db)
    return GetEmergencyDataUseCase(qr_repository)


async def get_patient_from_user(user: User, db: Session) -> Patient:
    """Get patient record from authenticated user"""
    patient = db.query(Patient).filter(Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient record not found"
        )
    return patient


@router.get("/generate", response_model=QRCodeResponseDTO)
async def generate_patient_qr_code(
    current_user: User = Depends(get_current_user),
    generate_qr_use_case: GenerateQRCodeUseCase = Depends(get_generate_qr_use_case),
    db: Session = Depends(get_db)
):
    """
    Generate QR code with VitalGo logo for authenticated patient
    Requires authentication
    """
    # Ensure user is a patient
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can generate QR codes"
        )

    # Get patient record
    patient = await get_patient_from_user(current_user, db)

    try:
        # Generate QR code
        qr_data = await generate_qr_use_case.execute(patient.id)

        return QRCodeResponseDTO(
            qr_code=qr_data.qr_code,
            emergency_url=qr_data.emergency_url,
            qr_image_base64=qr_data.qr_image_base64
        )

    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error generating QR code"
        )


@router.get("/emergency/{qr_uuid}", response_model=EmergencyPatientResponseDTO)
async def get_emergency_patient_data(
    qr_uuid: UUID,
    emergency_data_use_case: GetEmergencyDataUseCase = Depends(get_emergency_data_use_case)
):
    """
    Get patient emergency information by QR code UUID
    Public endpoint - no authentication required
    """
    try:
        # Get emergency patient information
        emergency_info = await emergency_data_use_case.execute(qr_uuid)

        return EmergencyPatientResponseDTO(
            full_name=emergency_info.full_name,
            blood_type=emergency_info.blood_type,
            emergency_contact=emergency_info.emergency_contact,
            critical_allergies=emergency_info.critical_allergies,
            current_medications=emergency_info.current_medications,
            chronic_conditions=emergency_info.chronic_conditions
        )

    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving emergency data"
        )


@router.get("/data", response_model=dict)
async def get_patient_qr_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get patient's QR code metadata (without generating image)
    Requires authentication
    """
    # Ensure user is a patient
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can access QR data"
        )

    # Get patient record
    patient = await get_patient_from_user(current_user, db)

    if not patient.qr_code:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient QR code not found"
        )

    # Generate emergency URL
    qr_generator = QRGeneratorService()
    emergency_url = qr_generator.get_emergency_url(patient.qr_code)

    return {
        "qr_code": str(patient.qr_code),
        "emergency_url": emergency_url,
        "has_qr_code": True
    }


@router.get("/test/generate", response_model=QRCodeResponseDTO)
async def test_generate_qr_code(
    patient_id: Optional[int] = None,
    generate_qr_use_case: GenerateQRCodeUseCase = Depends(get_generate_qr_use_case),
    db: Session = Depends(get_db)
):
    """
    Test QR generation without authentication
    TEMPORARY ENDPOINT - Uses specified patient_id or first patient in DB
    """
    if patient_id:
        # Get specific patient by ID
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patient with ID {patient_id} not found"
            )
    else:
        # Get first patient for testing
        patient = db.query(Patient).first()
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No patients found in database"
            )

    try:
        # Generate QR code
        qr_data = await generate_qr_use_case.execute(patient.id)

        return QRCodeResponseDTO(
            qr_code=qr_data.qr_code,
            emergency_url=qr_data.emergency_url,
            qr_image_base64=qr_data.qr_image_base64
        )

    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating QR code: {str(e)}"
        )