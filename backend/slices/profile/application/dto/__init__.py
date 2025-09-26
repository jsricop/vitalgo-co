"""
Profile DTOs
"""
from .profile_completion_dto import (
    ProfileCompletenessResponse,
    ExtendedPatientProfileDTO,
    PatientProfileUpdateDTO,
    MedicationDTO,
    AllergyDTO,
    DiseaseDTO,
    SurgeryDTO,
    GynecologicalHistoryDTO
)
from .basic_patient_dto import (
    BasicPatientInfoDTO,
    BasicPatientUpdateDTO
)

__all__ = [
    'ProfileCompletenessResponse',
    'ExtendedPatientProfileDTO',
    'PatientProfileUpdateDTO',
    'MedicationDTO',
    'AllergyDTO',
    'DiseaseDTO',
    'SurgeryDTO',
    'GynecologicalHistoryDTO',
    'BasicPatientInfoDTO',
    'BasicPatientUpdateDTO'
]