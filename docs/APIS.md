# API Endpoints Reference

## Standardized Error Responses

All VitalGo API endpoints return consistent, standardized error responses for improved debugging and user experience.

### Error Response Format
```json
{
  "success": false,
  "error_code": "AUTH_001",
  "message": "Authentication required to access this resource",
  "details": null,
  "request_id": "uuid-here"
}
```

### Standard Error Codes

#### Authentication & Authorization
- `AUTH_001`: Authentication required
- `AUTH_002`: Invalid credentials
- `AUTH_003`: Token expired
- `AUTH_004`: Token invalid
- `AUTH_005`: Access forbidden
- `AUTH_006`: Account locked

#### Validation
- `VAL_001`: Validation error
- `VAL_002`: Required field missing
- `VAL_003`: Invalid format
- `VAL_004`: Value out of range

#### Resources
- `RES_001`: Resource not found
- `RES_002`: Resource already exists
- `RES_003`: Resource access denied

#### Rate Limiting
- `RATE_001`: Rate limit exceeded
- `RATE_002`: Too many requests

#### Server
- `SRV_001`: Internal server error
- `SRV_002`: Service unavailable
- `SRV_003`: Database error

### Enhanced Authentication Error Response
```json
{
  "success": false,
  "error_code": "AUTH_002",
  "message": "Invalid email or password provided",
  "attempts_remaining": 2,
  "retry_after": null,
  "account_locked_until": null,
  "request_id": "uuid-here"
}
```

### Validation Error Response
```json
{
  "success": false,
  "error_code": "VAL_001",
  "message": "Validation failed for the provided data",
  "validation_errors": [
    {
      "field": "email",
      "message": "Invalid email format",
      "invalid_value": "not-an-email"
    }
  ],
  "request_id": "uuid-here"
}
```

---

## Authentication Endpoints (/api/auth)

### POST /api/auth/login
**Description:** Authenticate user and return JWT tokens with comprehensive security features
**In:** `{email: string, password: string, remember_me?: boolean}`
**Out:** `{success: boolean, access_token: string, refresh_token: string, token_type: "bearer", expires_in: number, user: UserResponseDto, redirect_url?: string}`
**User Object:** `{id: string, email: string, first_name?: string, last_name?: string, user_type: string, is_verified: boolean, profile_completed: boolean, mandatory_fields_completed: boolean}`
**Status:** 200 success, 401 invalid credentials (`AUTH_002`), 429 rate limited (`RATE_001`)
**Features:** Rate limiting (IP and email based), account lockout, session management
**Error Response:** Uses standardized authentication error format with `attempts_remaining` and `retry_after` fields

### POST /api/auth/logout
**Description:** Logout user by revoking session(s)
**In:** `Authorization: Bearer {token}, logout_all?: boolean`
**Out:** `{success: boolean, message: string}`
**Status:** 200 success (always returns success for security)

### POST /api/auth/refresh
**Description:** Refresh JWT access token using refresh token
**In:** `{refresh_token: string}`
**Out:** `{access_token: string, refresh_token: string, token_type: "bearer", expires_in: number}`
**Status:** 200 success, 400 validation error (`VAL_001`), 401 invalid token (`AUTH_004`)
**Error Response:** Uses standardized error format

### GET /api/auth/me
**Description:** Get current authenticated user information
**In:** `Authorization: Bearer {token}`
**Out:** `{success: boolean, user: UserInfoObject}`
**Status:** 200 success, 401 unauthorized

### POST /api/auth/validate
**Description:** Validate JWT token (for internal frontend use)
**In:** `Authorization: Bearer {token}`
**Out:** `{valid: boolean, user?: UserInfoObject}`
**Status:** Always returns 200 with valid boolean

## Signup Endpoints (/api/signup)

### POST /api/signup/patient
**Description:** Register new patient account with auto-login capability
**In:** `{first_name: string, last_name: string, document_type: string, document_number: string, phone_international: string, birth_date: string, origin_country: string, email: string, password: string, confirm_password: string, accept_terms: boolean, accept_privacy: boolean}`
**Out:** `{success: boolean, message: string, user_id: string, patient_id: string, qr_code: string, access_token: string, refresh_token: string, expires_in: number, user: UserResponseDto, redirect_url: string}`
**User Object:** `{id: string, email: string, first_name?: string, last_name?: string, user_type: string, is_verified: boolean, profile_completed: boolean, mandatory_fields_completed: boolean}`
**Status:** 201 created, 400 validation error, 409 user/document exists
**Features:** Auto-login tokens, session creation, comprehensive user response
**Notes:** `origin_country` uses ISO 3166-1 alpha-2 format (e.g., "CO", "US", "MX")

### POST /api/signup/validate-email
**Description:** Check if email is available for registration
**In:** `{email: string}`
**Out:** `{available: boolean, message: string}`
**Status:** 200 available, 409 email exists

### POST /api/signup/validate-document
**Description:** Check if document number is available
**In:** `{document_type: string, document_number: string}`
**Out:** `{available: boolean, message: string}`
**Status:** 200 available, 409 document exists

### GET /api/signup/document-types
**Description:** Get list of available document types
**In:** No parameters
**Out:** `{document_types: DocumentTypeObject[]}`
**DocumentType:** `{id: number, code: string, name: string, description: string, is_active: boolean}`
**Status:** 200 success

## Dashboard Endpoints (/api/dashboard)

### GET /api/dashboard/
**Description:** Get complete dashboard data for authenticated patient
**In:** `Authorization: Bearer {token}`
**Out:** `DashboardDataDTO`
**DashboardDataDTO:** `{user_id: string, patient_id: string, full_name: string, email: string, stats: DashboardStatsDTO, medical_summary: MedicalDataSummaryDTO, recent_medications: PatientMedicationDTO[], recent_activities: ActivityDTO[], is_first_visit: boolean}`
**Status:** 200 success, 401 unauthorized, 403 non-patient forbidden

## Medications Endpoints (/api/medications)

### GET /api/medications
**Description:** Get all medications for authenticated patient
**In:** `Authorization: Bearer {token}`
**Out:** `PatientMedicationDTO[]`
**Status:** 200 success, 401 unauthorized, 403 non-patient forbidden

### GET /api/medications/{medication_id}
**Description:** Get specific medication by ID
**In:** `Authorization: Bearer {token}`
**Out:** `PatientMedicationDTO`
**Status:** 200 success, 404 not found, 401 unauthorized, 403 non-patient forbidden

### POST /api/medications
**Description:** Create new medication record
**In:** `Authorization: Bearer {token}`, `CreateMedicationDTO`
**CreateMedicationDTO:** `{medication_name: string, dosage: string, frequency: string, start_date: string, end_date?: string, is_active?: boolean, notes?: string, prescribed_by?: string}`
**Out:** `PatientMedicationDTO`
**Status:** 201 created, 400 validation error, 401 unauthorized, 403 non-patient forbidden

### PUT /api/medications/{medication_id}
**Description:** Update medication record with detailed validation logging
**In:** `Authorization: Bearer {token}`, `UpdateMedicationDTO`
**UpdateMedicationDTO:** `{medication_name?: string, dosage?: string, frequency?: string, start_date?: string, end_date?: string, is_active?: boolean, notes?: string, prescribed_by?: string}`
**Out:** `PatientMedicationDTO`
**Status:** 200 updated, 404 not found, 422 validation error (detailed), 401 unauthorized, 403 non-patient forbidden
**Validation Error Format:** `{message: "Validation failed", errors: [{field: string, message: string, type: string}]}`

### DELETE /api/medications/{medication_id}
**Description:** Delete medication record
**In:** `Authorization: Bearer {token}`
**Out:** `204 No Content`
**Status:** 204 success, 404 not found, 401 unauthorized, 403 non-patient forbidden

## Allergies Endpoints (/api/allergies)

### GET /api/allergies
**Description:** Get all allergies for authenticated patient
**In:** `Authorization: Bearer {token}`
**Out:** `PatientAllergyDTO[]`
**Status:** 200 success, 401 unauthorized, 403 non-patient forbidden

### GET /api/allergies/{allergy_id}
**Description:** Get specific allergy by ID
**In:** `Authorization: Bearer {token}`
**Out:** `PatientAllergyDTO`
**Status:** 200 success, 404 not found, 401 unauthorized, 403 non-patient forbidden

### POST /api/allergies
**Description:** Create new allergy record
**In:** `Authorization: Bearer {token}`, `CreateAllergyDTO`
**CreateAllergyDTO:** `{allergen: string, severity_level: string, reaction_description?: string, diagnosis_date?: string, notes?: string}`
**Out:** `PatientAllergyDTO`
**Status:** 201 created, 400 validation error, 401 unauthorized, 403 non-patient forbidden

### PUT /api/allergies/{allergy_id}
**Description:** Update allergy record
**In:** `Authorization: Bearer {token}`, `UpdateAllergyDTO`
**UpdateAllergyDTO:** `{allergen?: string, severity_level?: string, reaction_description?: string, diagnosis_date?: string, notes?: string}`
**Out:** `PatientAllergyDTO`
**Status:** 200 updated, 404 not found, 401 unauthorized, 403 non-patient forbidden

### DELETE /api/allergies/{allergy_id}
**Description:** Delete allergy record
**In:** `Authorization: Bearer {token}`
**Out:** `204 No Content`
**Status:** 204 success, 404 not found, 401 unauthorized, 403 non-patient forbidden

## Surgeries Endpoints (/api/surgeries)

### GET /api/surgeries
**Description:** Get all surgeries for authenticated patient
**In:** `Authorization: Bearer {token}`
**Out:** `PatientSurgeryDTO[]`
**Status:** 200 success, 401 unauthorized, 403 non-patient forbidden

### GET /api/surgeries/{surgery_id}
**Description:** Get specific surgery by ID
**In:** `Authorization: Bearer {token}`
**Out:** `PatientSurgeryDTO`
**Status:** 200 success, 404 not found, 401 unauthorized, 403 non-patient forbidden

### POST /api/surgeries
**Description:** Create new surgery record
**In:** `Authorization: Bearer {token}`, `CreateSurgeryDTO`
**CreateSurgeryDTO:** `{procedure_name: string, surgery_date: string, hospital_name?: string, surgeon_name?: string, anesthesia_type?: string, duration_hours?: integer, notes?: string, complications?: string}`
**Out:** `PatientSurgeryDTO`
**Status:** 201 created, 400 validation error, 401 unauthorized, 403 non-patient forbidden

### PUT /api/surgeries/{surgery_id}
**Description:** Update surgery record
**In:** `Authorization: Bearer {token}`, `UpdateSurgeryDTO`
**UpdateSurgeryDTO:** `{procedure_name?: string, surgery_date?: string, hospital_name?: string, surgeon_name?: string, anesthesia_type?: string, duration_hours?: integer, notes?: string, complications?: string}`
**Out:** `PatientSurgeryDTO`
**Status:** 200 updated, 404 not found, 401 unauthorized, 403 non-patient forbidden

### DELETE /api/surgeries/{surgery_id}
**Description:** Delete surgery record
**In:** `Authorization: Bearer {token}`
**Out:** `204 No Content`
**Status:** 204 success, 404 not found, 401 unauthorized, 403 non-patient forbidden

## Illnesses Endpoints (/api/illnesses)

### GET /api/illnesses
**Description:** Get all illnesses for authenticated patient
**In:** `Authorization: Bearer {token}`
**Out:** `PatientIllnessDTO[]`
**Status:** 200 success, 401 unauthorized, 403 non-patient forbidden

### GET /api/illnesses/{illness_id}
**Description:** Get specific illness by ID
**In:** `Authorization: Bearer {token}`
**Out:** `PatientIllnessDTO`
**Status:** 200 success, 404 not found, 401 unauthorized, 403 non-patient forbidden

### POST /api/illnesses
**Description:** Create new illness record
**In:** `Authorization: Bearer {token}`, `CreateIllnessDTO`
**CreateIllnessDTO:** `{illness_name: string, diagnosis_date: string, status: string, is_chronic?: boolean, treatment_description?: string, cie10_code?: string, diagnosed_by?: string, notes?: string}`
**Out:** `PatientIllnessDTO`
**Status:** 201 created, 400 validation error, 401 unauthorized, 403 non-patient forbidden

### PUT /api/illnesses/{illness_id}
**Description:** Update illness record
**In:** `Authorization: Bearer {token}`, `UpdateIllnessDTO`
**UpdateIllnessDTO:** `{illness_name?: string, diagnosis_date?: string, status?: string, is_chronic?: boolean, treatment_description?: string, cie10_code?: string, diagnosed_by?: string, notes?: string}`
**Out:** `PatientIllnessDTO`
**Status:** 200 updated, 404 not found, 401 unauthorized, 403 non-patient forbidden

### DELETE /api/illnesses/{illness_id}
**Description:** Delete illness record
**In:** `Authorization: Bearer {token}`
**Out:** `204 No Content`
**Status:** 204 success, 404 not found, 401 unauthorized, 403 non-patient forbidden

## Profile Endpoints (/api/profile)

### GET /api/profile/completeness
**Description:** Get profile completion status
**In:** `Authorization: Bearer {token}`
**Out:** `{profile_completeness: number, mandatory_fields_completed: boolean, missing_fields: string[]}`
**Status:** 200 success, 401 unauthorized

### GET /api/profile/extended
**Description:** Get extended patient profile data including personal information (RF002 fields)
**In:** `Authorization: Bearer {token}`
**Out:** `ExtendedPatientProfileDTO`
**Status:** 200 success, 401 unauthorized

**ExtendedPatientProfileDTO Personal Information Fields:**
```json
{
  "biological_sex": "string|null",
  "gender": "string|null",
  "birth_country": "string|null",
  "birth_department": "string|null",
  "birth_city": "string|null",
  "residence_address": "string|null",
  "residence_department": "string|null",
  "residence_city": "string|null"
}
```

### PUT /api/profile/complete
**Description:** Complete patient profile with medical data and personal information (RF002 fields)
**In:** `Authorization: Bearer {token}`, `CompleteProfileRequestDTO`
**Out:** `{success: boolean, message: string, profile_completeness: number}`
**Status:** 200 updated, 400 validation error, 401 unauthorized

**CompleteProfileRequestDTO Personal Information Fields:**
```json
{
  "biological_sex": "string",
  "gender": "string",
  "birth_country": "string",
  "birth_department": "string",
  "birth_city": "string",
  "residence_address": "string",
  "residence_department": "string",
  "residence_city": "string"
}
```

### GET /api/profile/medications
**Description:** Get medications from profile system
**In:** `Authorization: Bearer {token}`
**Out:** `MedicationDTO[]`
**Status:** 200 success, 401 unauthorized

### POST /api/profile/medications
**Description:** Add medication through profile system
**In:** `Authorization: Bearer {token}`, `MedicationCreateDTO`
**Out:** `{success: boolean, message: string}`
**Status:** 201 created, 400 validation error, 401 unauthorized

### GET /api/profile/allergies
**Description:** Get allergies from profile system
**In:** `Authorization: Bearer {token}`
**Out:** `AllergyDTO[]`
**Status:** 200 success, 401 unauthorized

### POST /api/profile/allergies
**Description:** Add allergy through profile system
**In:** `Authorization: Bearer {token}`, `AllergyCreateDTO`
**Out:** `{success: boolean, message: string}`
**Status:** 201 created, 400 validation error, 401 unauthorized

### GET /api/profile/basic
**Description:** Get basic patient information (from signup)
**In:** `Authorization: Bearer {token}`
**Out:** `BasicPatientInfoDTO`
**BasicPatientInfoDTO:** `{first_name: string, last_name: string, document_type: string, document_number: string, phone_international: string, birth_date: string, origin_country: string, email: string, profile_photo_url?: string}`
**Status:** 200 success, 404 not found, 401 unauthorized

### PUT /api/profile/basic
**Description:** Update basic patient information
**In:** `Authorization: Bearer {token}`, `BasicPatientUpdateDTO`
**BasicPatientUpdateDTO:** `{first_name?: string, last_name?: string, document_type?: string, document_number?: string, phone_international?: string, birth_date?: string, origin_country?: string, email?: string}`
**Out:** `{success: boolean, message: string}`
**Status:** 200 updated, 400 validation error, 401 unauthorized, 404 not found

### POST /api/profile/photo
**Description:** Upload profile photo for current user
**In:** `Authorization: Bearer {token}`, `multipart/form-data` with `photo` file field
**File Requirements:**
- **Formats:** .jpg, .jpeg, .png, .webp
- **Max Size:** 5MB
- **Field Name:** `photo`
**Out:** `ProfilePhotoResponseDTO`
**ProfilePhotoResponseDTO:** `{success: boolean, message: string, photo_url?: string}`
**Status:** 200 uploaded, 400 validation error (no file/invalid format/too large), 401 unauthorized, 500 upload failed
**Features:** Automatic file validation, unique filename generation, dual storage support (local/S3)

### DELETE /api/profile/photo
**Description:** Delete profile photo for current user
**In:** `Authorization: Bearer {token}`
**Out:** `ProfilePhotoResponseDTO`
**ProfilePhotoResponseDTO:** `{success: boolean, message: string, photo_url: null}`
**Status:** 200 deleted, 400 deletion failed, 401 unauthorized, 500 server error

## Patient Endpoints (/api/patient) - New Architecture

### GET /api/patient/basic
**Description:** Get basic patient information (from signup) - Enhanced endpoint with unified client support
**In:** `Authorization: Bearer {token}`
**Out:** `BasicPatientInfoDTO`
**BasicPatientInfoDTO:** `{first_name: string, last_name: string, document_type: string, document_number: string, phone_international: string, birth_date: string, origin_country: string, email: string, profile_photo_url?: string}`
**Status:** 200 success, 401 unauthorized, 404 patient not found
**Notes:** Replaces `/api/profile/basic` with improved validation and error handling

### PUT /api/patient/basic
**Description:** Update basic patient information - Enhanced with duplicate checking
**In:** `Authorization: Bearer {token}`, `BasicPatientUpdateDTO`
**BasicPatientUpdateDTO:** `{first_name?: string, last_name?: string, document_type?: string, document_number?: string, phone_international?: string, birth_date?: string, origin_country?: string, email?: string}`
**Out:** `{success: boolean, message: string}`
**Status:** 200 updated, 400 validation error or duplicate document/email, 401 unauthorized, 404 patient not found

### PUT /api/profile/medications/{medication_id}
**Description:** Update existing medication
**In:** `Authorization: Bearer {token}`, `MedicationDTO`
**Out:** `{success: boolean, message: string}`
**Status:** 200 success, 400 validation error, 401 unauthorized, 404 not found

### DELETE /api/profile/medications/{medication_id}
**Description:** Delete medication
**In:** `Authorization: Bearer {token}`
**Out:** `{success: boolean, message: string}`
**Status:** 200 success, 401 unauthorized, 404 not found

### PUT /api/profile/allergies/{allergy_id}
**Description:** Update existing allergy
**In:** `Authorization: Bearer {token}`, `AllergyDTO`
**Out:** `{success: boolean, message: string}`
**Status:** 200 success, 400 validation error, 401 unauthorized, 404 not found

### DELETE /api/profile/allergies/{allergy_id}
**Description:** Delete allergy
**In:** `Authorization: Bearer {token}`
**Out:** `{success: boolean, message: string}`
**Status:** 200 success, 401 unauthorized, 404 not found

## Emergency QR Endpoints (/api/emergency)

### POST /api/emergency/qr
**Description:** Generate emergency QR code for patient
**In:** `Authorization: Bearer {token}`
**Out:** `{qr_uuid: string, qr_url: string, created_at: string, expires_at?: string}`
**Status:** 201 created, 401 unauthorized

### GET /api/emergency/qr
**Description:** Get patient's current QR code
**In:** `Authorization: Bearer {token}`
**Out:** `{qr_uuid: string, qr_url: string, created_at: string, expires_at?: string}`
**Status:** 200 success, 404 not found, 401 unauthorized

### GET /api/emergency/{qr_uuid}
**Description:** Get emergency data by QR UUID (public endpoint)
**In:** `qr_uuid path parameter`
**Out:** `EmergencyDataDto`
**Status:** 200 success, 404 not found, 403 QR expired

### POST /api/emergency/{qr_uuid}/regenerate
**Description:** Regenerate emergency QR code
**In:** `Authorization: Bearer {token}`
**Out:** `{qr_uuid: string, qr_url: string, created_at: string}`
**Status:** 201 created, 401 unauthorized, 404 not found

## Data Transfer Objects (DTOs)

### DashboardStatsDTO
```json
{
  "active_medications": 5,
  "total_allergies": 2,
  "allergies_by_severity": {"mild": 1, "moderate": 1, "severe": 0, "critical": 0},
  "total_surgeries": 1,
  "active_illnesses": 2,
  "chronic_illnesses": 1,
  "profile_completeness": 85.5,
  "last_login": "2025-01-15T10:30:00Z",
  "last_updated": "2025-01-15T14:20:00Z"
}
```

### MedicalDataSummaryDTO
```json
{
  "medications_count": 5,
  "allergies_count": 2,
  "surgeries_count": 1,
  "illnesses_count": 2,
  "has_critical_allergies": false,
  "has_chronic_illnesses": true,
  "recent_activity": "2025-01-15T14:20:00Z"
}
```

### PatientMedicationDTO
```json
{
  "id": 123,
  "patient_id": "uuid-string",
  "medication_name": "Aspirin",
  "dosage": "100mg",
  "frequency": "Once daily",
  "start_date": "2025-01-01",
  "end_date": null,
  "is_active": true,
  "notes": "Take with food",
  "prescribed_by": "Dr. Smith",
  "created_at": "2025-01-01T09:00:00Z",
  "updated_at": "2025-01-01T09:00:00Z"
}
```

### PatientAllergyDTO
```json
{
  "id": 456,
  "patient_id": "uuid-string",
  "allergen": "Peanuts",
  "severity_level": "severe",
  "reaction_description": "Anaphylaxis, difficulty breathing",
  "diagnosis_date": "2020-05-15",
  "notes": "Carry EpiPen",
  "created_at": "2025-01-01T09:00:00Z",
  "updated_at": "2025-01-01T09:00:00Z"
}
```

### PatientSurgeryDTO
```json
{
  "id": 789,
  "patient_id": "uuid-string",
  "procedure_name": "Appendectomy",
  "surgery_date": "2024-06-15",
  "hospital_name": "General Hospital",
  "surgeon_name": "Dr. Johnson",
  "anesthesia_type": "General",
  "duration_hours": 2,
  "notes": "Laparoscopic procedure",
  "complications": null,
  "created_at": "2025-01-01T09:00:00Z",
  "updated_at": "2025-01-01T09:00:00Z"
}
```

### PatientIllnessDTO
```json
{
  "id": 101,
  "patient_id": "uuid-string",
  "illness_name": "Type 2 Diabetes",
  "diagnosis_date": "2020-03-10",
  "status": "en_tratamiento",
  "is_chronic": true,
  "treatment_description": "Metformin 500mg twice daily",
  "cie10_code": "E11.9",
  "diagnosed_by": "Dr. Smith",
  "notes": "Monitor blood glucose levels",
  "created_at": "2025-01-01T09:00:00Z",
  "updated_at": "2025-01-01T09:00:00Z"
}
```

### ActivityDTO
```json
{
  "type": "medication",
  "description": "Added new medication: Aspirin 100mg",
  "date": "2025-01-15T14:20:00Z"
}
```

## Health Check Endpoints

### GET /
**Description:** Basic health check
**Out:** `{message: "VitalGo API is running", status: "healthy"}`
**Status:** 200 success

### GET /health
**Description:** Detailed health check
**Out:** `{status: "healthy", service: "vitalgo-backend", version: "0.1.0"}`
**Status:** 200 success

## Error Responses

**400 Bad Request:** `{error: string, details?: object}`
**401 Unauthorized:** `{error: "Unauthorized", message: string, headers?: {WWW-Authenticate: "Bearer"}}`
**403 Forbidden:** `{error: "Forbidden", message: string}`
**404 Not Found:** `{error: "Not Found", message: string}`
**409 Conflict:** `{error: "Conflict", message: string}`
**422 Validation Error:** `{detail: {message: "Validation failed", errors: [{field: string, message: string, type: string}]}}` or legacy format `{detail: ValidationError[]}`
**429 Too Many Requests:** `{error: "Too Many Requests", message: string, retry_after?: number}`
**500 Internal Server Error:** `{error: "Internal Server Error", message: string}`

## Authentication Notes

- All protected endpoints require `Authorization: Bearer {access_token}` header
- Tokens expire in 30 minutes (1800 seconds) by default
- Remember me tokens have longer expiration
- Rate limiting applies to login attempts (IP and email based)
- Account lockout after 5 failed attempts
- Sessions are tracked and can be revoked
- JWT tokens contain user info and session ID for validation

## Frontend Authentication Patterns

### ✅ RECOMMENDED: Unified API Client
Use the centralized authentication system for all API calls:

```typescript
import { apiClient } from '../../../shared/services/apiClient';

// Automatic authentication, error handling, and login redirects
const response = await apiClient.get<DataType>('/endpoint');
const data = response.data;

const updateResponse = await apiClient.put<ResultType>('/endpoint', updateData);
const result = updateResponse.data;
```

**Benefits**:
- ✅ **Zero duplication**: No auth code copying across services
- ✅ **Automatic token handling**: Headers added automatically
- ✅ **Consistent error handling**: Unified auth failure detection
- ✅ **Auto login redirect**: 401/403 auth failures redirect to login
- ✅ **Type safety**: Generic responses with proper TypeScript types

### 🔄 LEGACY: Manual Authentication
For services not yet migrated (being phased out):

```typescript
import { LocalStorageService } from '../../../shared/services/local-storage-service';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${LocalStorageService.getAccessToken()}`,
};

const response = await fetch('/api/endpoint', { headers });
```

### Migration Status
- ✅ **Profile endpoints** (`/profile/basic`): Use unified client
- 🔄 **Medical endpoints** (`/medications`, `/allergies`, etc.): Legacy auth (migrating)
- 🔄 **Dashboard endpoint** (`/dashboard`): Legacy auth (migrating)

### Authentication Error Handling
The unified client automatically handles:
- **Token validation**: Checks expiration before requests
- **Auth failures**: Detects authentication-related 401/403 errors
- **Login redirect**: Automatically redirects to `/login` for auth failures
- **Token cleanup**: Clears invalid tokens from localStorage