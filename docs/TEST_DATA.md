# VitalGo Test Database Data Registry

## IMPORTANT: PERSISTENT TEST DATA
This file contains real test data stored in the database that should NEVER be deleted.
This data is invaluable for efficient testing and development.

**⚠️ CRITICAL:** Test passwords are hashed with bcrypt and CANNOT be decrypted.
Always refer to this document for the original plaintext passwords.

---

## Test User Accounts

### Primary Test User
- **Email:** `test.patient@vitalgo.com`
- **Password:** `TestPassword123!`
- **Full Name:** `Test Patient Primary`
- **Document Type:** `CC` (Cédula de Ciudadanía)
- **Document Number:** `1234567890`
- **Phone International:** `+57 300 123 4567`
- **Birth Date:** `1990-01-15`
- **Origin Country:** `CO` (Colombia - Default)
- **User Type:** `patient`
- **Status:** Active
- **Created:** `2025-09-20 17:31:06.964406+00`
- **User ID:** `9534695e-4685-4e46-a88f-5e44144e81f8`
- **Patient ID:** `9a64ced3-a488-4d86-b8ec-c1cc406683cb`
- **QR Code:** `767c8ead-683d-4175-b6e5-53cd2a89eb06`

### Secondary Test User
- **Email:** `test.patient2@vitalgo.com`
- **Password:** `TestPassword123!`
- **Full Name:** `Test Patient Secondary`
- **Document Type:** `CC` (Cédula de Ciudadanía)
- **Document Number:** `0987654321`
- **Phone International:** `+57 300 987 6543`
- **Birth Date:** `1985-06-20`
- **Origin Country:** `CO` (Colombia - Default)
- **User Type:** `patient`
- **Status:** Active
- **Created:** `2025-09-20 17:31:07.208122+00`
- **User ID:** `ec03abdb-0051-4f34-8b75-13bb6668560f`
- **Patient ID:** `c4e9a958-f7ca-4ce1-8ddd-901e830568de`
- **QR Code:** `07d1ca4c-47d5-4b6f-95c1-f4ba6ed3f40c`

### Test Paramedic User
- **Email:** `test.paramedic@vitalgo.com`
- **Password:** `TestParamedic123!`
- **User Type:** `paramedic`
- **Status:** Active
- **Created:** `2025-10-01 19:30:22+00`
- **User ID:** `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
- **Purpose:** Emergency access testing - can access patient emergency data via QR codes
- **Permissions:**
  - Read-only access to patient emergency medical information
  - Access via `/api/emergency/{qr_code}` endpoint
  - Cannot modify patient data
  - No patient profile (paramedic-only account)

---

## API Endpoints for Testing

### Authentication Endpoints
- **Login:** `POST http://localhost:8000/api/auth/login`
- **Signup:** `POST http://localhost:8000/api/signup/patient`
- **Logout:** `POST http://localhost:8000/api/auth/logout`

### Dashboard Endpoints
- **Dashboard Data:** `GET http://localhost:8000/api/dashboard/`
- **User Profile:** `GET http://localhost:8000/api/users/me`

### Profile Endpoints
- **Basic Patient Info:** `GET http://localhost:8000/api/profile/basic`
- **Update Basic Info:** `PUT http://localhost:8000/api/profile/basic`
- **Profile Completeness:** `GET http://localhost:8000/api/profile/completeness`
- **Extended Profile:** `GET http://localhost:8000/api/profile/extended`
- **Update Extended Profile:** `PUT http://localhost:8000/api/profile/complete`

---

## Test Scenarios

### Scenario 1: Login Flow
```json
{
  "email": "test.patient@vitalgo.com",
  "password": "TestPassword123!",
  "remember_me": false
}
```

### Scenario 2: Login with Remember Me
```json
{
  "email": "test.patient@vitalgo.com",
  "password": "TestPassword123!",
  "remember_me": true
}
```

### Scenario 3: Invalid Login
```json
{
  "email": "test.patient@vitalgo.com",
  "password": "WrongPassword123!",
  "remember_me": false
}
```

---

## Database Connection Info
- **Database:** `vitalgo_dev`
- **Host:** `localhost:5432`
- **User:** `vitalgo_user`
- **Password:** `vitalgo_dev_password_2025`

---

## Document Types Reference
| Code | Name | Description |
|------|------|-------------|
| CC | Cédula de Ciudadanía | Documento de identidad para ciudadanos colombianos mayores de edad |
| TI | Tarjeta de Identidad | Documento para menores de edad (registro solo por tutor legal) |
| CE | Cédula de Extranjería | Documento para extranjeros residentes en Colombia |
| PA | Pasaporte | Documento de identidad internacional |
| RC | Registro Civil | Documento para menores (registro solo por tutor legal) |
| AS | Adulto sin Identificar | Para casos especiales de adultos sin documentación |
| MS | Menor sin Identificar | Para casos especiales de menores (registro solo por tutor legal) |

---

## Test Data Creation Log

### Initial Setup
- **Date:** 2025-09-20
- **Migration Status:** All migrations applied successfully
- **Tables Created:** 12 tables including users, patients, document_types, etc.
- **Document Types:** 7 types seeded successfully

### User Creation Status
- **Primary User:** ✅ Created Successfully (2025-09-25)
- **Secondary User:** ✅ Created Successfully (2025-09-25)

---

## Usage Notes

1. **NEVER DELETE THIS DATA** - It's designed for persistent testing
2. **Password Security** - Original passwords are stored here since DB uses bcrypt hashing
3. **API Testing** - Use the endpoint examples for Postman/curl testing
4. **E2E Testing** - Use these credentials for Playwright tests
5. **Database Queries** - Reference user IDs after creation for direct DB queries

---

## Checkpoint Validation Data

### Checkpoint 1: Login Success
- Test with Primary User credentials
- Verify JWT tokens are stored in localStorage
- Verify user data structure matches expected format

### Checkpoint 2: Dashboard Redirect
- After successful login, verify redirect to `/dashboard`
- Verify dashboard loads with real user data
- Verify session persistence

### Checkpoint 3: Session Maintenance
- Test page refresh maintains session
- Test navigation within dashboard maintains session
- Verify localStorage tokens persist

### Checkpoint 4: No Automatic Logout
- Verify session lasts at least 5 minutes
- Test Remember Me functionality
- Verify no unexpected logouts occur

---

---

## Medical Test Data for Dashboard Testing

### Patient Medical Records (Primary Test User)
**Patient ID:** `9a64ced3-a488-4d86-b8ec-c1cc406683cb`

#### Medications (PatientMedication)

##### Active Medications
```sql
INSERT INTO patient_medications (patient_id, medication_name, dosage, frequency, start_date, end_date, is_active, prescribed_by, notes, created_at, updated_at) VALUES
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Ibuprofeno', '400mg', 'Cada 8 horas', '2024-01-15', NULL, true, 'Dr. Ana García', 'Para dolor muscular', '2024-01-15 10:00:00', '2024-01-15 10:00:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Omeprazol', '20mg', 'Una vez al día', '2024-02-01', NULL, true, 'Dr. Carlos Ruiz', 'Protector gástrico', '2024-02-01 09:30:00', '2024-02-01 09:30:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Losartán', '50mg', 'Una vez al día', '2024-01-20', NULL, true, 'Dr. María López', 'Para hipertensión', '2024-01-20 14:15:00', '2024-01-20 14:15:00');
```

##### Inactive Medications
```sql
INSERT INTO patient_medications (patient_id, medication_name, dosage, frequency, start_date, end_date, is_active, prescribed_by, notes, created_at, updated_at) VALUES
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Amoxicilina', '500mg', 'Cada 8 horas', '2023-12-01', '2023-12-10', false, 'Dr. Pedro Martín', 'Antibiótico completado', '2023-12-01 11:00:00', '2023-12-10 11:00:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Acetaminofén', '500mg', 'Cada 6 horas', '2023-11-15', '2023-11-20', false, 'Dr. Ana García', 'Para fiebre', '2023-11-15 16:20:00', '2023-11-20 16:20:00');
```

#### Allergies (PatientAllergy)
```sql
INSERT INTO patient_allergies (patient_id, allergen, severity_level, reaction_description, diagnosis_date, notes, created_at, updated_at) VALUES
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Penicilina', 'severa', 'Erupción cutánea, dificultad respiratoria', '2020-05-10', 'Alergia documentada desde la infancia', '2024-01-15 11:00:00', '2024-01-15 11:00:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Mariscos', 'moderada', 'Hinchazón facial, urticaria', '2019-08-22', 'Evitar camarones y cangrejos', '2024-01-15 11:05:00', '2024-01-15 11:05:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Polen', 'leve', 'Estornudos, congestión nasal', '2021-03-15', 'Síntomas estacionales', '2024-01-15 11:10:00', '2024-01-15 11:10:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Latex', 'critica', 'Shock anafiláctico', '2022-01-30', 'Requiere epinefrina de emergencia', '2024-01-15 11:15:00', '2024-01-15 11:15:00');
```

#### Surgeries (PatientSurgery)
```sql
INSERT INTO patient_surgeries (patient_id, procedure_name, surgery_date, hospital_name, surgeon_name, anesthesia_type, duration_hours, notes, complications, created_at, updated_at) VALUES
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Apendicectomía', '2020-07-15', 'Hospital San Juan de Dios', 'Dr. Roberto Vásquez', 'General', 2, 'Cirugía laparoscópica exitosa', NULL, '2024-01-15 12:00:00', '2024-01-15 12:00:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Extracción de vesícula biliar', '2022-03-22', 'Clínica del Country', 'Dr. Sandra Morales', 'General', 3, 'Colecistectomía laparoscópica', 'Recuperación lenta por adhesiones', '2024-01-15 12:05:00', '2024-01-15 12:05:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Reparación de hernia inguinal', '2023-09-10', 'Hospital Militar', 'Dr. Luis Fernando Torres', 'Regional', 1, 'Hernia pequeña reparada con malla', NULL, '2024-01-15 12:10:00', '2024-01-15 12:10:00');
```

#### Illnesses (PatientIllness)

##### Active Illnesses
```sql
INSERT INTO patient_illnesses (patient_id, illness_name, diagnosis_date, status, is_chronic, treatment_description, cie10_code, diagnosed_by, notes, created_at, updated_at) VALUES
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Hipertensión arterial', '2023-06-15', 'activa', true, 'Control con Losartán 50mg diario', 'I10', 'Dr. María López', 'Requiere control mensual', '2024-01-15 13:00:00', '2024-01-15 13:00:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Gastritis crónica', '2023-10-20', 'en_tratamiento', true, 'Omeprazol 20mg diario, dieta blanda', 'K29.5', 'Dr. Carlos Ruiz', 'Relacionada con estrés laboral', '2024-01-15 13:05:00', '2024-01-15 13:05:00');
```

##### Resolved Illnesses
```sql
INSERT INTO patient_illnesses (patient_id, illness_name, diagnosis_date, status, is_chronic, treatment_description, cie10_code, diagnosed_by, notes, created_at, updated_at) VALUES
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Bronquitis aguda', '2023-12-05', 'resuelta', false, 'Antibióticos y expectorantes', 'J20.9', 'Dr. Ana García', 'Recuperación completa en 10 días', '2023-12-05 10:00:00', '2023-12-15 10:00:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Conjuntivitis alérgica', '2023-04-12', 'resuelta', false, 'Gotas oftálmicas antihistamínicas', 'H10.1', 'Dr. Elena Vargas', 'Episodio estacional resuelto', '2023-04-12 14:30:00', '2023-04-20 14:30:00');
```

### Expected Dashboard Statistics
Based on the test data above, the dashboard should display:

#### Stats Cards (with active_ prefix)
- **Medicamentos Activos**: 3
- **Alergias Activas**: 4
- **Cirugías**: 3 (all surgical history)
- **Enfermedades Activas**: 2

#### Allergies by Severity
- **Leve**: 1 (Polen)
- **Moderada**: 1 (Mariscos)
- **Severa**: 1 (Penicilina)
- **Crítica**: 1 (Latex)

### Complete SQL Insert Script for Medical Data
```sql
-- Insert comprehensive medical test data for dashboard testing
-- Patient ID: 9a64ced3-a488-4d86-b8ec-c1cc406683cb

-- Medications (3 active, 2 inactive)
INSERT INTO patient_medications (patient_id, medication_name, dosage, frequency, start_date, end_date, is_active, prescribed_by, notes, created_at, updated_at) VALUES
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Ibuprofeno', '400mg', 'Cada 8 horas', '2024-01-15', NULL, true, 'Dr. Ana García', 'Para dolor muscular', '2024-01-15 10:00:00', '2024-01-15 10:00:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Omeprazol', '20mg', 'Una vez al día', '2024-02-01', NULL, true, 'Dr. Carlos Ruiz', 'Protector gástrico', '2024-02-01 09:30:00', '2024-02-01 09:30:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Losartán', '50mg', 'Una vez al día', '2024-01-20', NULL, true, 'Dr. María López', 'Para hipertensión', '2024-01-20 14:15:00', '2024-01-20 14:15:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Amoxicilina', '500mg', 'Cada 8 horas', '2023-12-01', '2023-12-10', false, 'Dr. Pedro Martín', 'Antibiótico completado', '2023-12-01 11:00:00', '2023-12-10 11:00:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Acetaminofén', '500mg', 'Cada 6 horas', '2023-11-15', '2023-11-20', false, 'Dr. Ana García', 'Para fiebre', '2023-11-15 16:20:00', '2023-11-20 16:20:00');

-- Allergies (4 total with different severities)
INSERT INTO patient_allergies (patient_id, allergen, severity_level, reaction_description, diagnosis_date, notes, created_at, updated_at) VALUES
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Penicilina', 'severa', 'Erupción cutánea, dificultad respiratoria', '2020-05-10', 'Alergia documentada desde la infancia', '2024-01-15 11:00:00', '2024-01-15 11:00:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Mariscos', 'moderada', 'Hinchazón facial, urticaria', '2019-08-22', 'Evitar camarones y cangrejos', '2024-01-15 11:05:00', '2024-01-15 11:05:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Polen', 'leve', 'Estornudos, congestión nasal', '2021-03-15', 'Síntomas estacionales', '2024-01-15 11:10:00', '2024-01-15 11:10:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Latex', 'critica', 'Shock anafiláctico', '2022-01-30', 'Requiere epinefrina de emergencia', '2024-01-15 11:15:00', '2024-01-15 11:15:00');

-- Surgeries (3 total - all surgical history)
INSERT INTO patient_surgeries (patient_id, procedure_name, surgery_date, hospital_name, surgeon_name, anesthesia_type, duration_hours, notes, complications, created_at, updated_at) VALUES
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Apendicectomía', '2020-07-15', 'Hospital San Juan de Dios', 'Dr. Roberto Vásquez', 'General', 2, 'Cirugía laparoscópica exitosa', NULL, '2024-01-15 12:00:00', '2024-01-15 12:00:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Extracción de vesícula biliar', '2022-03-22', 'Clínica del Country', 'Dr. Sandra Morales', 'General', 3, 'Colecistectomía laparoscópica', 'Recuperación lenta por adhesiones', '2024-01-15 12:05:00', '2024-01-15 12:05:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Reparación de hernia inguinal', '2023-09-10', 'Hospital Militar', 'Dr. Luis Fernando Torres', 'Regional', 1, 'Hernia pequeña reparada con malla', NULL, '2024-01-15 12:10:00', '2024-01-15 12:10:00');

-- Illnesses (2 active, 2 resolved)
INSERT INTO patient_illnesses (patient_id, illness_name, diagnosis_date, status, is_chronic, treatment_description, cie10_code, diagnosed_by, notes, created_at, updated_at) VALUES
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Hipertensión arterial', '2023-06-15', 'activa', true, 'Control con Losartán 50mg diario', 'I10', 'Dr. María López', 'Requiere control mensual', '2024-01-15 13:00:00', '2024-01-15 13:00:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Gastritis crónica', '2023-10-20', 'en_tratamiento', true, 'Omeprazol 20mg diario, dieta blanda', 'K29.5', 'Dr. Carlos Ruiz', 'Relacionada con estrés laboral', '2024-01-15 13:05:00', '2024-01-15 13:05:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Bronquitis aguda', '2023-12-05', 'resuelta', false, 'Antibióticos y expectorantes', 'J20.9', 'Dr. Ana García', 'Recuperación completa en 10 días', '2023-12-05 10:00:00', '2023-12-15 10:00:00'),
('9a64ced3-a488-4d86-b8ec-c1cc406683cb', 'Conjuntivitis alérgica', '2023-04-12', 'resuelta', false, 'Gotas oftálmicas antihistamínicas', 'H10.1', 'Dr. Elena Vargas', 'Episodio estacional resuelto', '2023-04-12 14:30:00', '2023-04-20 14:30:00');

COMMIT;
```

### Dashboard Validation Checklist
After inserting medical test data, verify that the dashboard displays:

- [ ] **3 Medicamentos Activos** (no "de undefined")
- [ ] **4 Alergias Activas** (no "de undefined")
- [ ] **3 Cirugías** (all surgical history)
- [ ] **2 Enfermedades Activas** (no "de undefined")
- [ ] Correct allergy severity breakdown in backend
- [ ] Recent medications showing in dashboard overview
- [ ] Recent activities displaying latest medical updates
- [ ] No undefined values in any dashboard card

---

## Test Data Status & Verification

### ✅ Production Environment (October 2025)
**Database:** PostgreSQL 15.12 on AWS RDS
**Endpoint:** vitalgo-db.c8bms8iu4zjq.us-east-1.rds.amazonaws.com
**Production URL:** https://vitalgo.co

### ✅ Verified Test Accounts
**Patient Account** - test.patient@vitalgo.com
- Password: `TestPassword123!`
- Status: ✅ Active in production
- User Type: Patient
- Has Medical Records: Yes
- Last Verified: October 8, 2025

**Paramedic Account** - test.paramedic@vitalgo.com
- Password: `TestParamedic123!`
- Status: ✅ Active in production
- User Type: Paramedic
- Emergency Access: Enabled
- Last Verified: October 8, 2025

### 📊 Current Production Statistics (Oct 2025)
- **Total Users**: 19 (18 patients + 1 paramedic)
- **Active Patients**: 18
- **Medical Records**: 45 total
  - Medications: 16
  - Allergies: 7
  - Surgeries: 8
  - Illnesses: 14
- **Active Sessions**: 58

### 🔐 Password Security Reminder
**CRITICAL:** Test passwords in this document are the ONLY record of plaintext passwords.
The database stores bcrypt hashes which CANNOT be reversed.
- Always refer to this document for login credentials
- Never attempt to decrypt hashed passwords
- Keep this document secure and backed up

### 📋 Account Unlock Operations
Recent production operations:
- **Oct 8, 2025**: Successfully unlocked `nacrisger@yahoo.com` (6 failed attempts → 0, lockout cleared)

---

**Last Updated:** October 2025
**Medical Data Added:** Dashboard test data with active_ prefix standardization
**Production Verification:** ✅ All test accounts verified working
**Review Status:** ✅ Verified against production database