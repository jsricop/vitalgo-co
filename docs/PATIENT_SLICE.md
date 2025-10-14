# Patient Slice Architecture Guide

**Created:** 2025-09-26
**Status:** ✅ ACTIVE - Migrated from Profile Slice
**Purpose:** Complete guide for VitalGo's Patient Slice implementation

## Overview

The **Patient Slice** is VitalGo's dedicated domain slice for managing all patient-related data and operations. It implements a complete hexagonal architecture pattern with proper separation between basic patient information (from signup) and personal information (post-login completion).

## Architecture Principles

### 🎯 Domain Separation
- **Signup Slice**: Handles user registration and creates basic patient records
- **Patient Slice**: Manages all patient data and profile completion
- **Clear Boundaries**: No cross-slice dependencies for patient data

### 🏗️ Implementation Pattern
- **Nullable Fields Strategy**: Personal information fields are nullable for gradual completion
- **Visual Alert System**: Red/amber/green indicators guide users without blocking
- **Completion Tracking**: Automatic calculation of profile completion percentages
- **Modal-Based Editing**: Clean UI pattern for data updates

## Directory Structure

### Backend Structure
```
backend/slices/patient/
├── application/
│   ├── dto/
│   │   └── patient_dto.py          # API contract DTOs
│   └── use_cases/
│       ├── get_patient_use_case.py # Retrieve patient data
│       └── update_patient_use_case.py # Update patient info
├── domain/
│   └── models/
│       └── patient_model.py        # Patient domain model
└── infrastructure/
    ├── api/
    │   └── patient_endpoints.py    # RESTful endpoints
    └── repositories/
        └── patient_repository.py   # Data access layer
```

### Frontend Structure
```
frontend/src/slices/patient/
├── components/
│   ├── atoms/
│   │   ├── BiologicalSexSelector.tsx   # Radio button with alerts
│   │   ├── GenderSelector.tsx          # Gender identity selector
│   │   ├── ColombianDepartmentSelector.tsx # 32 departments
│   │   ├── CountrySelector.tsx         # Country selection
│   │   ├── HybridCityInput.tsx         # City suggestions + free text
│   │   └── TabButton.tsx               # Tab navigation buttons
│   ├── molecules/
│   │   ├── ProfilePhotoUpload.tsx      # Photo upload component
│   │   ├── PersonalInfoProgressBar.tsx # Visual progress tracking
│   │   ├── PersonalInfoEditModal.tsx   # Modal-based editing
│   │   ├── BasicInfoEditModal.tsx      # Basic info editing
│   │   └── TabNavigation.tsx           # Tab navigation
│   ├── organisms/
│   │   ├── BasicInformationTab.tsx     # Basic patient information
│   │   ├── PersonalInformationTab.tsx  # Personal info tab
│   │   ├── MedicalInformationTab.tsx   # Medical info tab
│   │   └── GynecologicalInformationTab.tsx # Gynecological tab
│   └── pages/
│       └── PatientProfilePage.tsx      # Main patient profile page
├── hooks/
│   ├── useBasicPatientInfo.ts          # Basic info state management
│   └── usePersonalPatientInfo.ts       # Personal info with completion
├── services/
│   ├── basicApi.ts                     # Basic patient API calls
│   └── personalApi.ts                  # Personal info API calls
└── types/
    └── index.ts                        # Patient type definitions
```

## Database Schema

### Enhanced Patient Model
The patient model combines basic information (from signup) with personal information (nullable for post-login completion):

```sql
-- Basic information (from signup)
first_name VARCHAR(100) NOT NULL
last_name VARCHAR(100) NOT NULL
document_type_id INTEGER NOT NULL
document_number VARCHAR(20) NOT NULL
phone_international VARCHAR(20) NOT NULL
birth_date DATE NOT NULL
origin_country VARCHAR(2) NOT NULL
profile_photo_url VARCHAR(500) NULL

-- Personal information (nullable for post-login completion)
biological_sex VARCHAR(20) NULL        -- 'masculino' | 'femenino' | 'intersexual'
gender VARCHAR(20) NULL                 -- 'masculino' | 'femenino' | 'no binario' | 'otro'
birth_country VARCHAR(2) NULL           -- ISO country code
birth_department VARCHAR(50) NULL       -- Colombian department (only for Colombia)
birth_city VARCHAR(100) NULL            -- City name
residence_address VARCHAR(200) NULL     -- Full address
residence_department VARCHAR(50) NULL   -- Current department
residence_city VARCHAR(100) NULL        -- Current city
personal_info_completed BOOLEAN DEFAULT FALSE
```

## API Endpoints

### Patient Information Management
```
GET    /api/patient/basic              # Get basic patient info
PUT    /api/patient/basic              # Update basic patient info
GET    /api/patient/personal           # Get personal info + completion status
PUT    /api/patient/personal           # Update personal information
GET    /api/patient/completion-status  # Get completion percentages
POST   /api/patient/personal/mark-complete # Mark personal info as complete
PUT    /api/patient/profile-photo      # Update profile photo URL
DELETE /api/patient/profile-photo      # Delete profile photo
```

### Photo Upload Endpoints (Profile Slice)
```
POST   /api/profile/photo              # Upload profile photo
DELETE /api/profile/photo              # Delete profile photo file
```

## Key Implementation Patterns

### 1. Nullable Fields Strategy
All personal information fields are nullable to enable post-login completion:

```typescript
interface PersonalPatientInfo {
  biologicalSex?: string;        // Optional for gradual completion
  gender?: string;
  birthCountry?: string;
  birthDepartment?: string;     // Conditional on birth country
  birthCity?: string;
  residenceAddress?: string;
  residenceDepartment?: string;
  residenceCity?: string;

  // Completion metadata
  personalInfoCompleted?: boolean;
  completionPercentage?: number;
  missingFields?: string[];
  lastUpdated?: string;
}
```

### 2. Visual Alert System
Guide users with color-coded indicators instead of blocking validation:

```typescript
// Red alerts for missing required fields
{showAlert && !value && (
  <div className="text-red-600">
    <span>Campo requerido para perfil completo</span>
  </div>
)}

// Green success indicators
{value && !showAlert && (
  <div className="text-vitalgo-green">
    <span>Campo completado</span>
  </div>
)}
```

### 3. Completion Calculation
Dynamic calculation of profile completion percentages:

```python
@property
def personal_info_completion_percentage(self) -> int:
    mandatory_fields = ['biological_sex', 'gender', 'birth_country', 'birth_city',
                       'residence_address', 'residence_department', 'residence_city']
    if self.birth_country == 'Colombia':
        mandatory_fields.append('birth_department')
    completed_count = sum(1 for field in mandatory_fields
                         if getattr(self, field) is not None and getattr(self, field).strip())
    return int((completed_count / len(mandatory_fields)) * 100)
```

### 4. Colombian Geography Integration
Special handling for Colombian departments and cities:

```typescript
// Conditional department selector
{formData.birthCountry === 'CO' && (
  <ColombianDepartmentSelector
    value={formData.birthDepartment}
    onChange={(value) => updateField('birthDepartment', value)}
    required={true}
    showAlert={showAlerts && !formData.birthDepartment}
  />
)}

// Hybrid city input with suggestions
<HybridCityInput
  value={formData.birthCity}
  onChange={(value) => updateField('birthCity', value)}
  department={formData.birthDepartment}
  placeholder="Ciudad de nacimiento"
  required={true}
  showAlert={showAlerts && !formData.birthCity}
/>
```

## Component Architecture

### Atomic Design Implementation

**Atoms** - Building blocks:
- `BiologicalSexSelector`: Radio buttons for biological sex
- `GenderSelector`: Gender identity selection
- `CountrySelector`: Country dropdown with flags
- `ColombianDepartmentSelector`: 32 Colombian departments
- `HybridCityInput`: City suggestions + free text input

**Molecules** - Combined functionality:
- `PersonalInfoProgressBar`: Visual progress with motivational messages
- `PersonalInfoEditModal`: Complete modal with all personal fields
- `ProfilePhotoUpload`: Photo upload with preview and validation

**Organisms** - Complete sections:
- `PersonalInformationTab`: Full personal information management
- `BasicInformationTab`: Basic patient information display/edit

### Modal-Based Editing Pattern
Clean separation between display and edit modes:

```typescript
export function PersonalInformationTab() {
  const { personalInfo, loading, error, completionStatus, updatePersonalInfo } = usePersonalPatientInfo();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Display Mode */}
      <div className="bg-white rounded-b-xl border border-gray-200 p-6">
        <button onClick={() => setIsModalOpen(true)}>
          Editar
        </button>
        {/* Information Display Cards */}
      </div>

      {/* Edit Mode */}
      <PersonalInfoEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={personalInfo}
        onSubmit={updatePersonalInfo}
      />
    </>
  );
}
```

## State Management

### React Hooks Pattern
Custom hooks for each information type:

```typescript
// Basic patient information hook
export function useBasicPatientInfo(): UseBasicPatientInfoResult {
  const [basicInfo, setBasicInfo] = useState<BasicPatientInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateBasicInfo = async (data: BasicPatientUpdate) => {
    const result = await basicPatientApi.updateBasicPatientInfo(data);
    if (result.success) {
      await fetchBasicInfo(); // Refetch for consistency
    }
    return result;
  };

  return { basicInfo, loading, error, updateBasicInfo, refetch: fetchBasicInfo };
}

// Personal patient information hook with completion tracking
export function usePersonalPatientInfo(): UsePersonalPatientInfoResult {
  const [personalInfo, setPersonalInfo] = useState<PersonalPatientInfo | null>(null);
  const [completionStatus, setCompletionStatus] = useState<PatientCompletionStatus>({...});

  const calculateLocalCompletionStatus = useCallback((info: PersonalPatientInfo | null) => {
    // Local completion calculation with server-side validation fallback
  }, []);

  return {
    personalInfo,
    loading,
    error,
    completionStatus,
    updatePersonalInfo,
    markAsComplete,
    refetch
  };
}
```

## API Services

### Unified API Client Pattern
All patient services use the unified API client for consistency:

```typescript
class PersonalPatientApiService {
  async getPersonalInfo(): Promise<PersonalPatientInfo> {
    try {
      const response = await apiClient.get<any>('/api/patient/personal');
      // Transform snake_case to camelCase
      return this.transformToFrontend(response.data);
    } catch (error) {
      throw new Error('Error fetching personal patient information');
    }
  }

  async updatePersonalInfo(data: PersonalPatientUpdate): Promise<{ success: boolean; message: string }> {
    try {
      // Transform camelCase to snake_case
      const backendData = this.transformToBackend(data);
      const response = await apiClient.put<any>('/api/patient/personal', backendData);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  private transformToFrontend(data: any): PersonalPatientInfo {
    return {
      biologicalSex: data.biological_sex,
      gender: data.gender,
      birthCountry: data.birth_country,
      birthDepartment: data.birth_department,
      birthCity: data.birth_city,
      residenceAddress: data.residence_address,
      residenceDepartment: data.residence_department,
      residenceCity: data.residence_city,
      personalInfoCompleted: data.personal_info_completed,
      completionPercentage: data.completion_percentage
    };
  }
}

export const personalPatientApi = new PersonalPatientApiService();
```

## Migration from Profile Slice

### Import Path Updates
```typescript
// ❌ OLD - Profile Slice
import { usePersonalPatientInfo } from '../../slices/profile/hooks/usePersonalPatientInfo';
import { PersonalPatientInfo } from '../../slices/profile/types';

// ✅ NEW - Patient Slice
import { usePersonalPatientInfo } from '../../slices/patient/hooks/usePersonalPatientInfo';
import { PersonalPatientInfo } from '../../slices/patient/types';
```

### API Endpoint Updates
```typescript
// ❌ OLD - Profile endpoints
const response = await apiClient.get('/api/profile/basic');

// ✅ NEW - Patient endpoints
const response = await apiClient.get('/api/patient/basic');
```

### Component Migration Map
| **Old Location** | **New Location** | **Status** |
|------------------|------------------|------------|
| `/profile/components/organisms/PersonalInformationTab.tsx` | `/patient/components/organisms/PersonalInformationTab.tsx` | ✅ Migrated |
| `/profile/components/molecules/PersonalInfoEditModal.tsx` | `/patient/components/molecules/PersonalInfoEditModal.tsx` | ✅ Migrated |
| `/profile/hooks/usePersonalPatientInfo.ts` | `/patient/hooks/usePersonalPatientInfo.ts` | ✅ Migrated |
| `/profile/services/personalPatientApi.ts` | `/patient/services/personalApi.ts` | ✅ Migrated |

## Development Guidelines

### 1. Use Patient Slice for All Patient Operations
Always use the patient slice for patient-related functionality:

```typescript
// ✅ CORRECT - Patient slice
import { usePersonalPatientInfo } from '../../slices/patient/hooks/usePersonalPatientInfo';

// ❌ WRONG - Profile slice (deprecated)
import { usePersonalPatientInfo } from '../../slices/profile/hooks/usePersonalPatientInfo';
```

### 2. Implement Nullable Strategy
Design all new fields for post-login completion:

```typescript
// ✅ CORRECT - Nullable for gradual completion
interface NewPatientField {
  medicalCondition?: string;  // Optional
  diagnosisDate?: string;     // Optional
  completed?: boolean;        // Completion tracking
}

// ❌ WRONG - Required fields block completion
interface NewPatientField {
  medicalCondition: string;   // Required blocks users
  diagnosisDate: string;      // Required blocks users
}
```

### 3. Use Visual Alerts Instead of Validation Blocking
Guide users without preventing progress:

```typescript
// ✅ CORRECT - Visual guidance
{showAlert && !value && (
  <div className="text-amber-600">
    <AlertTriangleIcon className="h-4 w-4" />
    <span>Recomendado para un perfil completo</span>
  </div>
)}

// ❌ WRONG - Blocking validation
{!value && (
  <div className="text-red-600">
    <span>Este campo es obligatorio</span>
    {/* Prevents form submission */}
  </div>
)}
```

### 4. Colombian Geography Support
Implement proper geography support:

```typescript
// ✅ CORRECT - Conditional departments
{formData.birthCountry === 'CO' && (
  <ColombianDepartmentSelector
    value={formData.birthDepartment}
    onChange={(value) => updateField('birthDepartment', value)}
    required={true}
  />
)}

// City suggestions based on department
<HybridCityInput
  value={formData.birthCity}
  department={formData.birthDepartment}
  onChange={(value) => updateField('birthCity', value)}
/>
```

### 5. Completion Tracking
Always calculate completion percentages dynamically:

```typescript
// ✅ CORRECT - Dynamic calculation
const calculateCompletion = useCallback((info: PersonalPatientInfo | null) => {
  if (!info) return 0;

  const mandatoryFields = ['biologicalSex', 'gender', 'birthCountry', 'birthCity'];
  if (info.birthCountry === 'CO') {
    mandatoryFields.push('birthDepartment');
  }

  const completedCount = mandatoryFields.filter(field =>
    info[field] && typeof info[field] === 'string' && info[field].trim()
  ).length;

  return Math.round((completedCount / mandatoryFields.length) * 100);
}, []);
```

## Testing Strategy

### Unit Tests
- Test hooks with various completion states
- Test API services with snake_case ↔ camelCase transformation
- Test completion calculation with edge cases

### Integration Tests
- Test modal opening/closing with state updates
- Test form submission with API integration
- Test Colombian geography conditional logic

### E2E Tests
- Test complete personal information flow
- Test progress bar updates
- Test visual alert system

## Common Issues & Solutions

### Import Errors
**Issue**: `ModuleNotFoundError: No module named 'slices.profile'`
**Fix**: Update all imports to use `slices.patient` instead

### API Endpoint Errors
**Issue**: `404 Not Found` on `/api/profile/*` endpoints
**Fix**: Update API calls to use `/api/patient/*` endpoints

### Type Errors
**Issue**: `Property 'markAsComplete' does not exist`
**Fix**: Ensure all interfaces include the `markAsComplete` method

### Completion Calculation Issues
**Issue**: Incorrect completion percentages
**Fix**: Verify conditional field logic (birth_department only for Colombia)

## Performance Considerations

### Lazy Loading
Load components only when needed:

```typescript
const PersonalInfoEditModal = lazy(() => import('../molecules/PersonalInfoEditModal'));

// Use with Suspense
<Suspense fallback={<Spinner />}>
  <PersonalInfoEditModal {...props} />
</Suspense>
```

### Caching Strategy
- Cache completion status for session duration
- Invalidate cache on successful updates
- Use optimistic updates for better UX

### API Optimization
- Batch multiple field updates
- Use debouncing for real-time validation
- Implement retry logic for failed requests

## Future Enhancements

### Planned Features
- [ ] Medical information fields
- [ ] Emergency contact management
- [ ] Gynecological history (conditional)
- [ ] Document upload functionality
- [ ] QR code generation for emergency access

### Architecture Improvements
- [ ] Implement undo/redo functionality
- [ ] Add offline support with sync
- [ ] Implement field-level permissions
- [ ] Add audit trail for medical information changes

---

**This documentation is maintained as part of VitalGo's technical documentation system. Keep it updated when making changes to the Patient Slice architecture.**