"""
Profile domain models
"""
# Import from existing slices instead of missing local models
from slices.medications.domain.models.medication_model import Medication
from slices.allergies.domain.models.allergy_model import Allergy
from .disease_model import Disease
from slices.surgeries.domain.models.surgery_model import Surgery
from .gynecological_model import GynecologicalHistory

__all__ = ['Medication', 'Allergy', 'Disease', 'Surgery', 'GynecologicalHistory']