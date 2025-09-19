"""
Validate document use case for onBlur validation
"""
from typing import Dict, Any
from slices.signup.application.ports.patient_repository import PatientRepository


class ValidateDocumentUseCase:
    """Use case for validating document number uniqueness (onBlur)"""

    def __init__(self, patient_repository: PatientRepository):
        self.patient_repository = patient_repository

    async def execute(self, document_number: str, document_type: str) -> Dict[str, Any]:
        """Validate document number and format"""

        try:
            # Validate format based on document type
            self._validate_document_format(document_number, document_type)

            # Check uniqueness
            exists = await self.patient_repository.document_exists(document_number)

            if exists:
                return {
                    "valid": False,
                    "error": "Este número de documento ya está registrado"
                }

            return {
                "valid": True,
                "message": "Número de documento disponible"
            }

        except ValueError as e:
            return {
                "valid": False,
                "error": str(e)
            }

    def _validate_document_format(self, document_number: str, document_type: str) -> None:
        """Validate document format based on type"""

        if document_type == "CC":  # Cédula de Ciudadanía
            if not document_number.isdigit() or not (6 <= len(document_number) <= 10):
                raise ValueError("Cédula debe tener entre 6 y 10 dígitos")

        elif document_type == "TI":  # Tarjeta de Identidad
            if not document_number.isdigit() or not (8 <= len(document_number) <= 11):
                raise ValueError("Tarjeta de Identidad debe tener entre 8 y 11 dígitos")

        elif document_type == "CE":  # Cédula de Extranjería
            if not document_number.isdigit() or not (6 <= len(document_number) <= 9):
                raise ValueError("Cédula de Extranjería debe tener entre 6 y 9 dígitos")

        elif document_type == "PA":  # Pasaporte
            if not (6 <= len(document_number) <= 12):
                raise ValueError("Pasaporte debe tener entre 6 y 12 caracteres alfanuméricos")

        else:
            # For other document types (AS, MS, RC) - basic validation
            if not (6 <= len(document_number) <= 20):
                raise ValueError("Número de documento debe tener entre 6 y 20 caracteres")