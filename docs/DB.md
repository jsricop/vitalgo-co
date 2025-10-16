# Database Fields Reference

## Core User Management Tables

### users
- `id`: UUID (PK) - Unique user identifier
- `email`: String(255, unique) - Login email address with index
- `password_hash`: String(255) - Bcrypt hashed password
- `user_type`: String(20) - Account access level (default: "patient")
- `is_verified`: Boolean - Email verification status (default: true)
- `created_at`: DateTime(timezone) - Registration timestamp (auto-generated)
- `updated_at`: DateTime(timezone) - Last modification timestamp (auto-updated)
- `last_login`: DateTime(timezone, nullable) - Last successful login time
- `failed_login_attempts`: Integer - Failed login counter (default: 0)
- `locked_until`: DateTime(timezone, nullable) - Account lockout expiration time
- `preferred_language`: String(5, indexed) - User's preferred language for i18n (ISO 639-1: 'es', 'en') (default: 'es')

### patients
- `id`: UUID (PK) - Unique patient identifier
- `user_id`: UUID (FK->users.id, unique) - Links to user account with cascade delete
- `qr_code`: UUID (unique, indexed) - Patient QR identifier for emergency access
- `full_name`: String(100) - Complete patient legal name
- `document_type_id`: Integer (FK->document_types.id) - Government ID type reference
- `document_number`: String(20, unique, indexed) - Government ID number
- `phone_international`: String(20) - Legacy full phone with country code
- `country_code`: String(2, nullable) - ISO country code for phone ("CO", "US", etc.)
- `dial_code`: String(5, nullable) - Phone country dial code ("+57", "+1", etc.)
- `phone_number`: String(15, nullable) - Local phone number only
- `birth_date`: Date - Patient birthdate for age calculation
- `accept_terms`: Boolean - Terms of service acceptance flag
- `accept_terms_date`: DateTime(timezone) - When terms were accepted
- `accept_policy`: Boolean - Privacy policy acceptance flag
- `accept_policy_date`: DateTime(timezone) - When policy was accepted
- `profile_photo_url`: String(500, nullable) - Full URL to patient's profile photo (local filesystem or S3)
- `biological_sex`: String(20, nullable) - Patient's biological sex for medical records
- `gender`: String(50, nullable) - Patient's gender identity
- `gender_other`: String(100, nullable) - Other gender specification when gender is "OTRO"
- `birth_country`: String(100, nullable) - Birth country (ISO code or full name)
- `birth_country_other`: String(100, nullable) - Other birth country when selection is "OTHER"
- `birth_department`: String(100, nullable) - State/department of birth (Colombia only)
- `birth_city`: String(100, nullable) - City of birth (Colombia only)
- `residence_address`: String(500, nullable) - Current full address
- `residence_country`: String(100, nullable) - Residence country (ISO code or full name)
- `residence_country_other`: String(100, nullable) - Other residence country when selection is "OTHER"
- `residence_department`: String(100, nullable) - Current state/department (Colombia only)
- `residence_city`: String(100, nullable) - Current city (Colombia only)
- `eps`: String(100, nullable) - EPS (Colombian health insurance) - ✅ IMPLEMENTED
- `eps_other`: String(100, nullable) - Other EPS specification - ✅ IMPLEMENTED
- `occupation`: String(200, nullable) - Patient's occupation - ✅ IMPLEMENTED
- `additional_insurance`: String(200, nullable) - Additional insurance information - ✅ IMPLEMENTED
- `complementary_plan`: String(100, nullable) - Complementary health plan - ✅ IMPLEMENTED
- `complementary_plan_other`: String(100, nullable) - Other complementary plan - ✅ IMPLEMENTED
- `blood_type`: String(10, nullable) - Blood type (A+, B-, AB+, O-, etc.) - ✅ IMPLEMENTED
- `emergency_contact_name`: String(200, nullable) - Emergency contact full name - ✅ IMPLEMENTED
- `emergency_contact_relationship`: String(50, nullable) - Relationship to patient - ✅ IMPLEMENTED
- `emergency_contact_phone`: String(20, nullable) - Emergency contact phone - ✅ IMPLEMENTED
- `emergency_contact_phone_alt`: String(20, nullable) - Alternative emergency contact phone - ✅ IMPLEMENTED
- `is_pregnant`: Boolean(nullable) - Pregnancy status (female patients only) - ✅ IMPLEMENTED
- `pregnancy_weeks`: Integer(nullable) - Weeks of pregnancy (1-42) - ✅ IMPLEMENTED
- `last_menstruation_date`: Date(nullable) - Last menstruation date - ✅ IMPLEMENTED
- `pregnancies_count`: Integer(nullable) - Number of pregnancies (0 or greater) - ✅ IMPLEMENTED
- `births_count`: Integer(nullable) - Number of births (0 or greater) - ✅ IMPLEMENTED
- `cesareans_count`: Integer(nullable) - Number of cesarean sections (0 or greater) - ✅ IMPLEMENTED
- `abortions_count`: Integer(nullable) - Number of abortions (0 or greater) - ✅ IMPLEMENTED
- `contraceptive_method`: String(100, nullable) - Current contraceptive method - ✅ IMPLEMENTED
- `personal_info_completed`: Boolean - Whether personal information section is complete (default: false)
- `created_at`: DateTime(timezone) - Patient record creation (auto-generated)
- `updated_at`: DateTime(timezone) - Last patient data update (auto-updated)

### document_types
- `id`: Integer (PK) - Document type identifier
- `code`: String (unique) - Short code (CC, TI, CE, PA, RC, AS, MS, etc.)
- `name`: String - Full document type name
- `description`: Text - Purpose and usage details
- `is_active`: Boolean - Available for selection flag

## Authentication & Security Tables

### user_sessions
- `id`: BigInteger (PK) - Session identifier (auto-increment for performance)
- `user_id`: UUID (FK->users.id, indexed) - Session owner with cascade delete
- `session_token`: String(1000, unique, indexed) - JWT access token
- `refresh_token`: String(1000, unique, indexed, nullable) - JWT refresh token
- `expires_at`: DateTime(timezone, indexed) - Session expiration time
- `refresh_expires_at`: DateTime(timezone, nullable) - Refresh token expiration
- `created_at`: DateTime(timezone) - Session start time (auto-generated)
- `last_accessed`: DateTime(timezone) - Last activity timestamp (auto-generated)
- `ip_address`: INET (nullable) - Source IP address for security tracking
- `user_agent`: Text (nullable) - Browser/client information
- `is_active`: Boolean (indexed) - Session validity flag (default: true)
- `remember_me`: Boolean - Extended session flag (default: false)
- `device_fingerprint`: String(255, nullable) - Device identification for security
- `location_info`: JSONB (nullable) - Geolocation data for security tracking

### login_attempts
- `id`: UUID (PK) - Login attempt identifier
- `email`: String - Email used for login attempt
- `ip_address`: String - Source IP for security tracking
- `success`: Boolean - Whether login succeeded
- `attempted_at`: DateTime(timezone) - When attempt occurred
- `user_agent`: Text (nullable) - Browser/client information
- `failure_reason`: String (nullable) - Reason for failed login
- `user_id`: UUID (FK->users.id, nullable) - User reference if found
- `session_id`: Integer (nullable) - Session reference if successful
- `geolocation`: JSONB (nullable) - Location data for security
- `request_headers`: JSONB (nullable) - Request headers for analysis

## Medical Data Tables

### ~~medications~~ (Profile System - REMOVED)
**DEPRECATED**: This table has been removed to eliminate duplication.
All medication data is now stored in `patient_medications` table (Dashboard System).
Migration: `dashboard_001` consolidated data and removed duplicate table.

### allergies (Profile System)
- `id`: UUID (PK) - Allergy record identifier
- `patient_id`: UUID (FK->patients.id) - Owner patient with cascade delete
- `allergen`: String(200, indexed) - What patient is allergic to
- `severity`: Enum - Reaction severity ("leve", "moderada", "severa", "critica")
- `symptoms`: Text (nullable) - Description of allergic symptoms
- `treatment`: Text (nullable) - Treatment or medication for allergy
- `diagnosis_date`: Date (nullable) - When allergy was diagnosed
- `notes`: Text (nullable) - Additional allergy information
- `created_at`: DateTime(timezone) - Record creation (auto-generated)
- `updated_at`: DateTime(timezone) - Last modification (auto-updated)

### diseases (Profile System)
- `id`: UUID (PK) - Disease record identifier
- `patient_id`: UUID (FK->patients.id) - Owner patient with cascade delete
- `name`: String(200, indexed) - Disease/condition name
- `diagnosis_date`: Date (nullable) - When diagnosed
- `is_chronic`: Boolean - Whether it's a chronic condition (default: false)
- `treatment`: Text (nullable) - Current treatment approach
- `notes`: Text (nullable) - Additional disease notes
- `cie10_code`: String(10, nullable) - ICD-10 classification code
- `created_at`: DateTime(timezone) - Record creation (auto-generated)
- `updated_at`: DateTime(timezone) - Last modification (auto-updated)

### surgeries (Profile System)
- `id`: UUID (PK) - Surgery record identifier
- `patient_id`: UUID (FK->patients.id) - Owner patient with cascade delete
- `name`: String(200, indexed) - Surgery procedure name
- `date`: Date (nullable) - When surgery was performed
- `hospital`: String(200, nullable) - Where surgery was performed
- `surgeon`: String(200, nullable) - Performing surgeon name
- `anesthesia_type`: String(100, nullable) - Type of anesthesia used
- `complications`: Text (nullable) - Any complications that occurred
- `notes`: Text (nullable) - Additional surgery notes
- `created_at`: DateTime(timezone) - Record creation (auto-generated)
- `updated_at`: DateTime(timezone) - Last modification (auto-updated)

### gynecological_history (Profile System)
- `id`: UUID (PK) - Gynecological record identifier
- `patient_id`: UUID (FK->patients.id) - Owner patient with cascade delete
- `first_menstruation_age`: Integer (nullable) - Age of menarche
- `cycle_duration_days`: Integer (nullable) - Normal cycle length
- `pregnancies_count`: Integer (nullable) - Total number of pregnancies
- `births_count`: Integer (nullable) - Total number of births
- `abortions_count`: Integer (nullable) - Total number of abortions
- `last_menstruation_date`: Date (nullable) - Date of last menstrual period
- `contraceptive_method`: String(100, nullable) - Current contraceptive method
- `notes`: Text (nullable) - Additional gynecological notes
- `created_at`: DateTime(timezone) - Record creation (auto-generated)
- `updated_at`: DateTime(timezone) - Last modification (auto-updated)

## Dashboard Medical Data Tables (Primary System)

### patient_medications (Primary Medications Table)
**NOTE**: This is the single source of truth for all medication data.
Uses BigInteger PKs for optimal performance in high-volume operations.
- `id`: BigInteger (PK) - Medication record identifier (auto-increment for performance)
- `patient_id`: UUID (FK->patients.id) - Owner patient with cascade delete
- `medication_name`: String(200, indexed) - Medication name
- `dosage`: String(100) - Dosage information (e.g., "50mg", "500mg")
- `frequency`: String(100) - How often taken (e.g., "Cada 8 horas", "Diario")
- `start_date`: Date - When medication started
- `end_date`: Date (nullable) - When medication ended
- `is_active`: Boolean - Currently taking flag (default: true)
- `notes`: Text (nullable) - Additional medication notes
- `prescribed_by`: String(200, nullable) - Doctor name who prescribed
- `created_at`: DateTime(timezone) - Record creation (auto-generated)
- `updated_at`: DateTime(timezone) - Last modification (auto-updated)

### patient_allergies (Dashboard System)
- `id`: Integer (PK) - Allergy record identifier (auto-increment)
- `patient_id`: UUID (FK->patients.id) - Owner patient with cascade delete
- `allergen`: String(200, indexed) - What patient is allergic to
- `severity_level`: String(50) - Reaction severity level
- `reaction_description`: Text (nullable) - Description of allergic reaction
- `diagnosis_date`: Date (nullable) - When allergy was diagnosed
- `notes`: Text (nullable) - Additional allergy information
- `created_at`: DateTime(timezone) - Record creation (auto-generated)
- `updated_at`: DateTime(timezone) - Last modification (auto-updated)

### patient_surgeries (Dashboard System)
- `id`: Integer (PK) - Surgery record identifier (auto-increment)
- `patient_id`: UUID (FK->patients.id) - Owner patient with cascade delete
- `procedure_name`: String(200, indexed) - Surgery procedure name
- `surgery_date`: Date - When surgery was performed
- `hospital_name`: String(200, nullable) - Where surgery was performed
- `surgeon_name`: String(200, nullable) - Performing surgeon name
- `anesthesia_type`: String(100, nullable) - Type of anesthesia used
- `duration_hours`: Integer (nullable) - Surgery duration in hours
- `notes`: Text (nullable) - Additional surgery notes
- `complications`: Text (nullable) - Any complications that occurred
- `created_at`: DateTime(timezone) - Record creation (auto-generated)
- `updated_at`: DateTime(timezone) - Last modification (auto-updated)

### patient_illnesses (Dashboard System)
- `id`: Integer (PK) - Illness record identifier (auto-increment)
- `patient_id`: UUID (FK->patients.id) - Owner patient with cascade delete
- `illness_name`: String(200, indexed) - Illness/condition name
- `diagnosis_date`: Date - When diagnosed
- `status`: String(50) - Current status ("activa", "en_tratamiento", "curada", "cronica")
- `is_chronic`: Boolean - Whether it's a chronic condition (default: false)
- `treatment_description`: Text (nullable) - Current treatment approach
- `cie10_code`: String(10, nullable) - ICD-10 classification code
- `diagnosed_by`: String(200, nullable) - Doctor who diagnosed
- `notes`: Text (nullable) - Additional illness notes
- `created_at`: DateTime(timezone) - Record creation (auto-generated)
- `updated_at`: DateTime(timezone) - Last modification (auto-updated)

## Emergency Access Tables

### emergency_qrs
- `id`: UUID (PK) - Emergency QR record identifier
- `patient_id`: UUID (FK->patients.id) - Owner patient with cascade delete
- `qr_uuid`: UUID (unique, indexed) - QR code unique identifier for URLs
- `generated_at`: DateTime(timezone) - When QR was generated (auto-generated)
- `expires_at`: DateTime(timezone, nullable) - Optional QR expiration time
- `is_active`: Boolean - QR code validity flag (default: true)
- `access_count`: Integer - Number of times QR was accessed (default: 0)
- `last_accessed_at`: DateTime(timezone, nullable) - Last time QR was used
- `created_at`: DateTime(timezone) - Record creation (auto-generated)
- `updated_at`: DateTime(timezone) - Last modification (auto-updated)

## System Tables

### alembic_version
- `version_num`: String(32) (PK) - Current Alembic migration version

### dashboard_activity_logs
- `id`: BigInteger (PK) - Activity log identifier (auto-increment)
- `patient_id`: UUID (FK->patients.id) - Patient who performed activity
- `activity_type`: String(50) - Type of activity (medication, allergy, surgery, illness)
- `activity_description`: Text - Human-readable activity description
- `entity_id`: Integer (nullable) - ID of the entity (medication_id, allergy_id, etc.)
- `created_at`: DateTime(timezone) - When activity occurred (auto-generated)

### deployment_history
- `id`: Integer (PK) - Deployment record identifier (auto-increment)
- `deployment_date`: DateTime(timezone) - When deployment occurred
- `version`: String(50) - Application version deployed
- `deployed_by`: String(100) - Who initiated deployment
- `migration_applied`: Boolean - Whether migrations ran
- `notes`: Text (nullable) - Deployment notes
- `created_at`: DateTime(timezone) - Record creation (auto-generated)

## Field Types & Constraints

### PostgreSQL Data Types Used
- **UUID**: Using PostgreSQL UUID type with `as_uuid=True` for Python UUID objects
- **String(n)**: Variable length strings with maximum length constraint
- **Text**: Unlimited text fields for long content
- **Integer**: 32-bit integers
- **BigInteger**: 64-bit integers for high-volume tables
- **Boolean**: True/false values with explicit defaults
- **Date**: Date-only values (YYYY-MM-DD)
- **DateTime(timezone=True)**: Timestamp with timezone information
- **INET**: PostgreSQL IP address type for network addresses
- **JSONB**: Binary JSON for structured data with indexing support
- **Enum**: Custom enumeration types for controlled values

### Indexing Strategy
- **Primary Keys**: All tables have indexed primary keys
- **Foreign Keys**: Most foreign key fields are indexed for join performance
- **Unique Constraints**: Email, document_number, QR codes, tokens
- **Search Fields**: Name fields, allergens, medications are indexed
- **Security Fields**: Session tokens, IP addresses indexed for lookups
- **Time Fields**: Expiration times indexed for cleanup operations

### Cascade Delete Rules
- **users -> patients**: CASCADE (delete patient when user deleted)
- **patients -> medical_data**: CASCADE (delete medical data when patient deleted)
- **users -> sessions**: CASCADE (delete sessions when user deleted)
- **patients -> emergency_qrs**: CASCADE (delete QR codes when patient deleted)

### Auto-Generated Fields
- **created_at**: Automatically set on record creation using `func.now()`
- **updated_at**: Automatically updated on record modification using `onupdate=func.now()`
- **UUID fields**: Auto-generated using `uuid.uuid4()` default
- **BigInteger PKs**: Auto-incrementing for performance on high-volume tables

### Nullable vs Required Fields
- **Required**: Core identification, authentication, and medical safety fields
- **Nullable**: Optional descriptive fields, dates, notes, and extended information
- **Defaults**: Booleans have explicit defaults, counters start at 0

### Security Considerations
- **Password Storage**: Only hashed passwords stored, never plaintext
- **Token Management**: Tokens stored with expiration and revocation capability
- **IP Tracking**: Connection IPs logged for security analysis
- **Device Fingerprinting**: Optional device identification for security
- **Audit Trail**: Creation and modification timestamps on all records

---

## Database Implementation Status

### ✅ Active Tables (Production)
**User Management:**
- `users` - User accounts (19 records as of Oct 2025)
- `patients` - Patient profiles (18 records)
- `document_types` - Government ID types (7 types)

**Authentication & Security:**
- `user_sessions` - Active sessions (58 sessions)
- `login_attempts` - Login audit trail

**Medical Records (Dashboard System):**
- `patient_medications` - Medications (16 records, BigInteger PK)
- `patient_allergies` - Allergies (7 records)
- `patient_surgeries` - Surgeries (8 records)
- `patient_illnesses` - Illnesses (14 records)

**System & Monitoring:**
- `alembic_version` - Migration tracking
- `dashboard_activity_logs` - Activity tracking
- `deployment_history` - Deployment audit trail

### ⚠️ Deprecated Tables
- `medications` - Old profile system table (REMOVED in dashboard_001 migration)
- `allergies` - Old profile system (still exists but not actively used)
- `diseases` - Old profile system (still exists but not actively used)
- `surgeries` - Old profile system (still exists but not actively used)
- `gynecological_history` - Old profile system (still exists but not actively used)

### 🔄 Special Notes
- **QR Codes**: Stored in `patients.qr_code` field (UUID), not `emergency_qrs` table
- **Primary Keys**: Medical tables use BigInteger for performance optimization
- **Profile Photos**: `patients.profile_photo_url` field exists but no upload API yet
- **RDS Instance**: PostgreSQL 15.12 on AWS (vitalgo-db.c8bms8iu4zjq.us-east-1.rds.amazonaws.com)

### 📊 Production Statistics (October 2025)
- **Total Users**: 19 (18 patients + 1 paramedic)
- **Medical Records**: 45 total (medications + allergies + surgeries + illnesses)
- **Active Sessions**: 58
- **Database Size**: ~1.2 MB (user_sessions table is largest at 344 KB)

**Last Updated:** October 2025
**Review Status:** ✅ Verified against production database schema