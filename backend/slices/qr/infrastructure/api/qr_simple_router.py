"""
QR API endpoints - Simplified version for patient QR display
Uses existing patients.qr_code field instead of separate table
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from shared.database.database import get_db
from slices.auth.infrastructure.api.auth_endpoints import get_current_user
from slices.signup.domain.models.user_model import User
from slices.signup.domain.models.patient_model import Patient
from slices.qr.application.dto import QRResponseDTO

router = APIRouter(prefix="/api/qr", tags=["qr"])


async def get_patient_from_user(user: User, db: Session) -> Patient:
    """Get patient record from authenticated user"""
    patient = db.query(Patient).filter(Patient.user_id == user.id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient record not found"
        )
    return patient


@router.get("/", response_model=QRResponseDTO)
async def get_patient_qr(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get patient's QR code information
    Requires authentication - patient only
    Returns patient's QR code UUID from patients table
    """
    # Ensure user is a patient
    if current_user.user_type != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can access QR codes"
        )

    # Get patient record
    patient = await get_patient_from_user(current_user, db)

    # Every patient already has a qr_code UUID (auto-generated on creation)
    # Build the QR URL using the patient's qr_code field
    qr_url = f"/qr/{patient.qr_code}"

    return QRResponseDTO(
        qr_uuid=str(patient.qr_code),
        qr_url=qr_url,
        created_at=patient.created_at,
        expires_at=None  # No expiration for patient QR codes
    )
