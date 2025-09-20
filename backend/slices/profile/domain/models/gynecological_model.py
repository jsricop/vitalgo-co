"""
Gynecological history SQLAlchemy model for RF002 medical history
"""
from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Integer, Boolean, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum

from shared.database import Base


class ContraceptiveMethod(enum.Enum):
    """Contraceptive method enumeration"""
    NINGUNO = "ninguno"
    PRESERVATIVO = "preservativo"
    PILDORA = "pildora"
    DIU = "diu"
    IMPLANTE = "implante"
    INYECCION = "inyeccion"
    PARCHE = "parche"
    ANILLO = "anillo"
    METODOS_NATURALES = "metodos_naturales"
    LIGADURA = "ligadura"
    OTRO = "otro"


class GynecologicalHistory(Base):
    """Gynecological history model for female patients only"""

    __tablename__ = "gynecological_histories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, unique=True)

    # Pregnancy status - mandatory for women
    is_pregnant = Column(Boolean, nullable=False, default=False)
    pregnancy_weeks = Column(Integer, nullable=True)  # Only if is_pregnant = True

    # Optional reproductive history
    last_menstruation_date = Column(Date, nullable=True)
    pregnancies_count = Column(Integer, nullable=True, default=0)
    births_count = Column(Integer, nullable=True, default=0)
    csections_count = Column(Integer, nullable=True, default=0)
    abortions_count = Column(Integer, nullable=True, default=0)

    # Contraceptive method
    contraceptive_method = Column(Enum(ContraceptiveMethod), nullable=True, default=ContraceptiveMethod.NINGUNO)
    contraceptive_method_other = Column(String(100), nullable=True)  # If method is "otro"

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    patient = relationship("Patient", backref="gynecological_history", uselist=False)

    @property
    def total_pregnancies(self) -> int:
        """Calculate total pregnancies including current one"""
        base_count = self.pregnancies_count or 0
        return base_count + (1 if self.is_pregnant else 0)

    @property
    def pregnancy_status_description(self) -> str:
        """Get human-readable pregnancy status"""
        if self.is_pregnant:
            weeks_str = f" ({self.pregnancy_weeks} semanas)" if self.pregnancy_weeks else ""
            return f"Embarazada{weeks_str}"
        return "No embarazada"

    def __repr__(self):
        status = "Embarazada" if self.is_pregnant else "No embarazada"
        return f"<GynecologicalHistory(patient_id='{self.patient_id}', status='{status}')>"