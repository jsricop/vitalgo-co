#!/bin/bash
#
# Initialize Staging Database with Test Data
#
# Populates fresh staging database with test users and medical records
# Uses data from docs/TEST_DATA.md
#
# Usage:
#   ./scripts/init-staging-db.sh
#
# Prerequisites:
#   - Staging environment deployed
#   - Backend container running (vitalgo-backend-staging)
#   - Database migrations applied
#

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $1"; }
step() { echo -e "${BLUE}[STEP]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Load staging environment
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/deployment-staging.env"

if [[ ! -f "$ENV_FILE" ]]; then
    error "deployment-staging.env not found"
    error "Run this script after staging deployment is complete"
    exit 1
fi

source "$ENV_FILE"

step "🔧 Initializing staging database with test data"
log "Connecting to staging database at: $EC2_PUBLIC_IP"

# SSH into staging EC2 and execute Python script
ssh -i "$EC2_SSH_KEY" ec2-user@"$EC2_PUBLIC_IP" << 'EOSSH'
    echo "📊 Connecting to backend container..."

    # Execute Python script to create test data
    docker exec -i vitalgo-backend-staging poetry run python << 'EOPY'
from datetime import date, datetime
from slices.auth.domain.models.user_model import User
from slices.signup.domain.models.patient_model import Patient
from slices.medications.domain.models.medication_model import PatientMedication
from slices.allergies.domain.models.allergy_model import PatientAllergy
from slices.surgeries.domain.models.surgery_model import PatientSurgery
from slices.illnesses.domain.models.illness_model import PatientIllness
from shared.database.database import SessionLocal
from passlib.context import CryptContext
import uuid

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
db = SessionLocal()

print("🔐 Creating test users...")

# Create primary test patient
user1 = User(
    id=uuid.UUID("9534695e-4685-4e46-a88f-5e44144e81f8"),
    email="test.patient@vitalgo.com",
    password_hash=pwd_context.hash("TestPassword123!"),
    user_type="patient",
    is_verified=True,
    preferred_language="es"
)
db.add(user1)
db.flush()

patient1 = Patient(
    id=uuid.UUID("9a64ced3-a488-4d86-b8ec-c1cc406683cb"),
    user_id=user1.id,
    qr_code=uuid.UUID("767c8ead-683d-4175-b6e5-53cd2a89eb06"),
    first_name="Test",
    last_name="Patient Primary",
    document_type_id=1,  # CC
    document_number="1234567890",
    phone_international="+57 300 123 4567",
    birth_date=date(1990, 1, 15),
    origin_country="CO",
    accept_terms=True,
    accept_terms_date=datetime.now(),
    accept_policy=True,
    accept_policy_date=datetime.now()
)
db.add(patient1)
db.flush()

# Create secondary test patient
user2 = User(
    id=uuid.UUID("ec03abdb-0051-4f34-8b75-13bb6668560f"),
    email="test.patient2@vitalgo.com",
    password_hash=pwd_context.hash("TestPassword123!"),
    user_type="patient",
    is_verified=True,
    preferred_language="es"
)
db.add(user2)
db.flush()

patient2 = Patient(
    id=uuid.UUID("c4e9a958-f7ca-4ce1-8ddd-901e830568de"),
    user_id=user2.id,
    qr_code=uuid.UUID("07d1ca4c-47d5-4b6f-95c1-f4ba6ed3f40c"),
    first_name="Test",
    last_name="Patient Secondary",
    document_type_id=1,  # CC
    document_number="0987654321",
    phone_international="+57 300 987 6543",
    birth_date=date(1985, 6, 20),
    origin_country="CO",
    accept_terms=True,
    accept_terms_date=datetime.now(),
    accept_policy=True,
    accept_policy_date=datetime.now()
)
db.add(patient2)
db.flush()

# Create test paramedic
user3 = User(
    id=uuid.UUID("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
    email="test.paramedic@vitalgo.com",
    password_hash=pwd_context.hash("TestParamedic123!"),
    user_type="paramedic",
    is_verified=True,
    preferred_language="es"
)
db.add(user3)
db.flush()

print("✅ Test users created")
print("💊 Creating medical records for primary test patient...")

# Add medications for primary patient
medications = [
    PatientMedication(
        patient_id=patient1.id,
        medication_name="Ibuprofeno",
        dosage="400mg",
        frequency="Cada 8 horas",
        start_date=date(2024, 1, 15),
        is_active=True,
        prescribed_by="Dr. Ana García",
        notes="Para dolor muscular"
    ),
    PatientMedication(
        patient_id=patient1.id,
        medication_name="Omeprazol",
        dosage="20mg",
        frequency="Una vez al día",
        start_date=date(2024, 2, 1),
        is_active=True,
        prescribed_by="Dr. Carlos Ruiz",
        notes="Protector gástrico"
    ),
    PatientMedication(
        patient_id=patient1.id,
        medication_name="Losartán",
        dosage="50mg",
        frequency="Una vez al día",
        start_date=date(2024, 1, 20),
        is_active=True,
        prescribed_by="Dr. María López",
        notes="Para hipertensión"
    ),
    # Inactive medications
    PatientMedication(
        patient_id=patient1.id,
        medication_name="Amoxicilina",
        dosage="500mg",
        frequency="Cada 8 horas",
        start_date=date(2023, 12, 1),
        end_date=date(2023, 12, 10),
        is_active=False,
        prescribed_by="Dr. Pedro Martín",
        notes="Antibiótico completado"
    ),
]

for med in medications:
    db.add(med)

print(f"  ✓ Created {len(medications)} medications (3 active, 1 inactive)")

# Add allergies
allergies = [
    PatientAllergy(
        patient_id=patient1.id,
        allergen="Penicilina",
        severity_level="severa",
        reaction_description="Erupción cutánea, dificultad respiratoria",
        diagnosis_date=date(2020, 5, 10),
        notes="Alergia documentada desde la infancia"
    ),
    PatientAllergy(
        patient_id=patient1.id,
        allergen="Mariscos",
        severity_level="moderada",
        reaction_description="Hinchazón facial, urticaria",
        diagnosis_date=date(2019, 8, 22),
        notes="Evitar camarones y cangrejos"
    ),
    PatientAllergy(
        patient_id=patient1.id,
        allergen="Polen",
        severity_level="leve",
        reaction_description="Estornudos, congestión nasal",
        diagnosis_date=date(2021, 3, 15),
        notes="Síntomas estacionales"
    ),
    PatientAllergy(
        patient_id=patient1.id,
        allergen="Latex",
        severity_level="critica",
        reaction_description="Shock anafiláctico",
        diagnosis_date=date(2022, 1, 30),
        notes="Requiere epinefrina de emergencia"
    ),
]

for allergy in allergies:
    db.add(allergy)

print(f"  ✓ Created {len(allergies)} allergies (leve: 1, moderada: 1, severa: 1, critica: 1)")

# Add surgeries
surgeries = [
    PatientSurgery(
        patient_id=patient1.id,
        procedure_name="Apendicectomía",
        surgery_date=date(2020, 7, 15),
        hospital_name="Hospital San Juan de Dios",
        surgeon_name="Dr. Roberto Vásquez",
        anesthesia_type="General",
        duration_hours=2,
        notes="Cirugía laparoscópica exitosa"
    ),
    PatientSurgery(
        patient_id=patient1.id,
        procedure_name="Extracción de vesícula biliar",
        surgery_date=date(2022, 3, 22),
        hospital_name="Clínica del Country",
        surgeon_name="Dr. Sandra Morales",
        anesthesia_type="General",
        duration_hours=3,
        notes="Colecistectomía laparoscópica",
        complications="Recuperación lenta por adhesiones"
    ),
    PatientSurgery(
        patient_id=patient1.id,
        procedure_name="Reparación de hernia inguinal",
        surgery_date=date(2023, 9, 10),
        hospital_name="Hospital Militar",
        surgeon_name="Dr. Luis Fernando Torres",
        anesthesia_type="Regional",
        duration_hours=1,
        notes="Hernia pequeña reparada con malla"
    ),
]

for surgery in surgeries:
    db.add(surgery)

print(f"  ✓ Created {len(surgeries)} surgeries")

# Add illnesses
illnesses = [
    PatientIllness(
        patient_id=patient1.id,
        illness_name="Hipertensión arterial",
        diagnosis_date=date(2023, 6, 15),
        status="activa",
        is_chronic=True,
        treatment_description="Control con Losartán 50mg diario",
        cie10_code="I10",
        diagnosed_by="Dr. María López",
        notes="Requiere control mensual"
    ),
    PatientIllness(
        patient_id=patient1.id,
        illness_name="Gastritis crónica",
        diagnosis_date=date(2023, 10, 20),
        status="en_tratamiento",
        is_chronic=True,
        treatment_description="Omeprazol 20mg diario, dieta blanda",
        cie10_code="K29.5",
        diagnosed_by="Dr. Carlos Ruiz",
        notes="Relacionada con estrés laboral"
    ),
    PatientIllness(
        patient_id=patient1.id,
        illness_name="Bronquitis aguda",
        diagnosis_date=date(2023, 12, 5),
        status="curada",
        is_chronic=False,
        treatment_description="Antibióticos y expectorantes",
        cie10_code="J20.9",
        diagnosed_by="Dr. Ana García",
        notes="Recuperación completa en 10 días"
    ),
]

for illness in illnesses:
    db.add(illness)

print(f"  ✓ Created {len(illnesses)} illnesses (2 active, 1 resolved)")

# Commit all data
db.commit()

print("=" * 60)
print("✅ Staging database initialized successfully!")
print("=" * 60)
print("\nTest Credentials:")
print("  Primary Patient:")
print("    Email: test.patient@vitalgo.com")
print("    Password: TestPassword123!")
print("\n  Secondary Patient:")
print("    Email: test.patient2@vitalgo.com")
print("    Password: TestPassword123!")
print("\n  Paramedic:")
print("    Email: test.paramedic@vitalgo.com")
print("    Password: TestParamedic123!")
print("\nMedical Data Created:")
print(f"  • {len(medications)} Medications")
print(f"  • {len(allergies)} Allergies")
print(f"  • {len(surgeries)} Surgeries")
print(f"  • {len(illnesses)} Illnesses")
print("=" * 60)

EOPY

    echo "✅ Test data creation completed on staging EC2"
EOSSH

log "✅ Staging database initialized with test data"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Test Credentials for Staging Environment:"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Primary Patient:"
echo "  Email: test.patient@vitalgo.com"
echo "  Password: TestPassword123!"
echo ""
echo "Secondary Patient:"
echo "  Email: test.patient2@vitalgo.com"
echo "  Password: TestPassword123!"
echo ""
echo "Paramedic:"
echo "  Email: test.paramedic@vitalgo.com"
echo "  Password: TestParamedic123!"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Access staging at: http://${EC2_PUBLIC_IP}:3000"
echo "═══════════════════════════════════════════════════════════"
