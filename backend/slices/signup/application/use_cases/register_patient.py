"""
Register patient use case - Main business logic for patient registration
"""
import bcrypt
from datetime import datetime, date
from typing import Dict, Any

from slices.signup.application.ports.user_repository import UserRepository
from slices.signup.application.ports.patient_repository import PatientRepository
from slices.signup.application.dto.patient_registration import PatientRegistrationDTO, PatientRegistrationResponse
from slices.signup.domain.models.user_model import User
from slices.signup.domain.models.patient_model import Patient


class RegisterPatientUseCase:
    """Use case for registering a new patient"""

    def __init__(
        self,
        user_repository: UserRepository,
        patient_repository: PatientRepository
    ):
        self.user_repository = user_repository
        self.patient_repository = patient_repository

    async def execute(self, registration_data: PatientRegistrationDTO) -> PatientRegistrationResponse:
        """Execute patient registration process"""

        # 1. Validate business rules
        await self._validate_registration(registration_data)

        # 2. Create user
        user = await self._create_user(registration_data)

        # 3. Create patient
        patient = await self._create_patient(user, registration_data)

        # 4. Generate JWT token (placeholder for now)
        token = self._generate_jwt_token(user)

        # 5. Return response
        return PatientRegistrationResponse(
            message="Cuenta creada exitosamente",
            user_id=user.id,
            patient_id=patient.id,
            qr_code=patient.qr_code,
            token=token
        )

    async def _validate_registration(self, data: PatientRegistrationDTO) -> None:
        """Validate registration data"""

        # Validate password confirmation
        if data.password != data.confirm_password:
            raise ValueError("Las contraseñas no coinciden")

        # Validate age (must be 18+)
        today = date.today()
        age = today.year - data.birth_date.year - ((today.month, today.day) < (data.birth_date.month, data.birth_date.day))
        if age < 18:
            raise ValueError("Debe ser mayor de 18 años para registrarse")

        # Validate email uniqueness
        if await self.user_repository.email_exists(data.email.lower()):
            raise ValueError("El email ya está registrado")

        # Validate document uniqueness
        if await self.patient_repository.document_exists(data.document_number):
            raise ValueError("El número de documento ya está registrado")

        # Validate required acceptances
        if not data.accept_terms:
            raise ValueError("Debe aceptar los términos y condiciones")

        if not data.accept_privacy:
            raise ValueError("Debe aceptar la política de privacidad")

    async def _create_user(self, data: PatientRegistrationDTO) -> User:
        """Create user with hashed password"""

        # Hash password with bcrypt
        password_hash = bcrypt.hashpw(
            data.password.encode('utf-8'),
            bcrypt.gensalt(rounds=12)
        ).decode('utf-8')

        user = User(
            email=data.email.lower(),
            password_hash=password_hash,
            user_type="patient",
            is_verified=True  # Default to True as per RF001
        )

        return await self.user_repository.create(user)

    async def _create_patient(self, user: User, data: PatientRegistrationDTO) -> Patient:
        """Create patient with legal acceptance timestamps"""

        # Get document type ID from code
        document_types = await self.patient_repository.get_document_types()
        document_type = next((dt for dt in document_types if dt.code == data.document_type), None)

        if not document_type:
            raise ValueError(f"Tipo de documento inválido: {data.document_type}")

        # Create timestamp for legal acceptances
        acceptance_timestamp = datetime.utcnow()

        patient = Patient(
            user_id=user.id,
            full_name=data.full_name,
            document_type_id=document_type.id,
            document_number=data.document_number,
            phone_international=data.phone_international,
            birth_date=data.birth_date,
            accept_terms=data.accept_terms,
            accept_terms_date=acceptance_timestamp,
            accept_policy=data.accept_privacy,
            accept_policy_date=acceptance_timestamp
        )

        return await self.patient_repository.create(patient)

    def _generate_jwt_token(self, user: User) -> str:
        """Generate JWT token (placeholder implementation)"""
        # TODO: Implement proper JWT token generation
        return f"jwt_token_placeholder_{user.id}"