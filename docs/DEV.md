# Development Reference Guide

## Reference Documentation System

**Purpose**: These documents serve as the single source of truth for API contracts, database schema, and type definitions.

### Core Documents:
- **APIS.md**: Complete API endpoint documentation with request/response schemas
- **DB.md**: Database schema reference with field types, constraints, and relationships
- **TYPES.md**: TypeScript/Python type definitions for frontend-backend consistency

### Usage Rules:
1. **Before Development**: Always consult relevant reference documents
2. **After Changes**: Update the corresponding document immediately
3. **Consistency**: Frontend TypeScript interfaces must match Python DTOs exactly

## Architecture

### Modular Monolith
- **Backend**: Vertical Slicing + Hexagonal Architecture (domain/application/infrastructure)
- **Frontend**: Vertical Slicing + Atomic Design
- **Critical**: Identical slice names across backend/frontend (e.g., `auth`)

### Stack
**Backend**: FastAPI, SQLAlchemy, PostgreSQL, Pydantic, Poetry
**Frontend**: Next.js, React, TypeScript, Tailwind CSS, Zustand

## Directory Structure
```
backend/
├── slices/
│   └── [slice]/
│       ├── application/         # Business logic, use cases
│       ├── domain/              # Models, entities (no dependencies)
│       └── infrastructure/      # API endpoints, repositories
└── shared/                      # Cross-slice utilities

frontend/
├── src/slices/
│   └── [slice]/
│       ├── components/
│       │   ├── atoms/          # Basic elements
│       │   ├── molecules/      # Simple combinations
│       │   ├── organisms/      # Complex components
│       │   └── templates/      # Page layouts
│       ├── pages/              # Complete pages
│       ├── services/           # API calls
│       ├── types/              # TypeScript interfaces
│       └── hooks/              # Custom React hooks
└── shared/                     # Cross-slice utilities
```

## Development Rules

### Architecture Layers (STRICT)
**Backend Dependencies**:
- `domain/`: No external dependencies
- `application/`: Can import domain only
- `infrastructure/`: Can import application and domain

**Frontend Components**:
- `atoms/`: No dependencies
- `molecules/`: Depend only on atoms
- `organisms/`: Depend on molecules and atoms
- `templates/`: Layout structure for pages

### Sharing Components
- Slice-specific: `/slices/[slice]/components/`
- Cross-slice shared: `/shared/components/`
- **Rule**: If used in 2+ slices, move to shared

## Critical Development Patterns

### Backend: UUID Handling (MANDATORY)
All DTOs with UUID fields from SQLAlchemy models MUST include validators:

```python
from pydantic import BaseModel, field_serializer

class PatientDataDTO(BaseModel):
    id: int
    patient_id: UUID  # UUID field

    @field_serializer('patient_id', when_used='json')
    def serialize_patient_id(self, value: UUID, _info) -> str:
        return str(value)
```

**Why Required**: SQLAlchemy `UUID(as_uuid=True)` fields return UUID objects, but frontend expects strings.

### Frontend: Authentication Patterns (MANDATORY)

**❌ NEVER use SWR with AuthGuard protected components**
**Root Cause**: Race conditions with authentication state

**✅ CORRECT Pattern**:
```typescript
export function useDataHook() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // No useAuth needed inside AuthGuard components

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await apiService.fetchData();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
```

### Frontend: API Service Pattern (MANDATORY)

**✅ PREFERRED**: Use Unified API Client (New Standard)

```typescript
import { apiClient, ApiError } from '../../../shared/services/apiClient';

class YourAPIService {
  async getData(): Promise<DataType> {
    try {
      const response = await apiClient.get<DataType>('/your-endpoint');
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async updateData(data: UpdateType): Promise<ResultType> {
    const response = await apiClient.put<ResultType>('/your-endpoint', data);
    return response.data;
  }
}
```

**🔄 LEGACY**: Manual Authentication (Being Phased Out)
```typescript
import { LocalStorageService } from '../../../shared/services/local-storage-service';

const getHeaders = (): HeadersInit => {
  const token = LocalStorageService.getAccessToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};
```

**Never use**: `localStorage.getItem('access_token')` - wrong key format

### Unified API Client Benefits

**Why Use Unified Client**:
- ✅ **Zero Duplication**: No more auth code copying
- ✅ **Automatic Auth**: Token handling, login redirects
- ✅ **Consistent Errors**: Standardized error messages
- ✅ **Type Safety**: Generic responses with proper types
- ✅ **Simplified Code**: `apiClient.get()` vs manual fetch + auth

**Available Methods**:
```typescript
apiClient.get<T>(endpoint)       // GET request
apiClient.post<T>(endpoint, data)  // POST request
apiClient.put<T>(endpoint, data)   // PUT request
apiClient.delete<T>(endpoint)      // DELETE request
apiClient.patch<T>(endpoint, data) // PATCH request
```

**Response Format**:
```typescript
interface ApiResponse<T> {
  data: T;        // Your actual data
  status: number; // HTTP status code
  statusText: string;
}
```

**Error Handling**:
```typescript
try {
  const response = await apiClient.get<User>('/profile/basic');
  return response.data;
} catch (error) {
  // Auth failures automatically redirect to login
  // Only handle business logic errors here

  // IMPORTANT: ApiError is an interface, not a class
  // Use duck typing instead of instanceof checks
  if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') {
    throw new Error((error as any).message);
  }
  throw error;
}
```

**⚠️ Common Mistake**:
```typescript
// ❌ WRONG - ApiError is an interface, not a class
if (error instanceof ApiError) { ... }

// ✅ CORRECT - Use duck typing pattern
if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') { ... }
```

### Authentication Debugging Guide

**Common Issue**: "Not authenticated" errors

**✅ NEW APPROACH**: Use Unified API Client
```typescript
// ✅ CORRECT - No manual auth needed
const response = await apiClient.get<Data>('/endpoint');
// Auth headers, error handling, login redirects all automatic
```

**🔄 LEGACY DEBUGGING** (for services not yet migrated):

**Root Causes & Solutions**:

1. **localStorage Key Mismatch** (Most Common):
   ```typescript
   // ❌ WRONG
   const token = localStorage.getItem('access_token'); // snake_case

   // ✅ CORRECT
   const token = LocalStorageService.getAccessToken(); // camelCase
   ```

2. **Missing Authorization Header**:
   ```typescript
   // ❌ WRONG
   ...(token && { Authorization: `Bearer ${token}` })

   // ✅ CORRECT
   'Authorization': token ? `Bearer ${token}` : ''
   ```

**Debugging Steps**:
1. **First**: Try using `apiClient` instead of manual auth
2. Check localStorage keys: `console.log(Object.keys(localStorage))`
3. Verify Authorization header in Network tab
4. Follow working patterns from `basicProfileApi.ts` (new) or `medicationsApi.ts` (legacy)

**Migration Status** (✅ COMPLETED):
- ✅ **Profile API** (Basic): Uses unified client
- ✅ **Medications API**: Migrated (373→242 lines, -35%)
- ✅ **Allergies API**: Migrated (354→209 lines, -41%)
- ✅ **Surgeries API**: Migrated (302→172 lines, -43%)
- ✅ **Illnesses API**: Migrated (179→93 lines, -48%)
- ✅ **Dashboard API**: Migrated (95→27 lines, -72%)
- ✅ **Signup API**: Enhanced with consistent error handling (public endpoints)

**Migration Results**:
- **Total Lines Eliminated**: 560+ lines of duplicated auth code
- **Average Reduction**: 45% across authenticated APIs
- **Benefits**: Unified auth, consistent errors, automatic login redirects

### Profile Endpoints Troubleshooting

**Common Issue**: Profile page showing "Not Found" or TypeErrors

**Root Causes & Solutions**:

1. **Router Prefix Mismatch**
   - **Issue**: Router defined with `/profile` instead of `/api/profile`
   - **Fix**: Use `router = APIRouter(prefix="/api/profile", tags=["profile"])`
   - **Detection**: Check browser Network tab for 404 errors on `/api/profile/*`

2. **Type Annotation Errors**
   - **Issue**: `TypeError: 'User' object is not subscriptable`
   - **Cause**: Using `current_user: dict` instead of `current_user: User`
   - **Fix**: Import User model and use proper typing:
     ```python
     from slices.signup.domain.models.user_model import User
     current_user: User = Depends(get_current_user)
     # Use current_user.id instead of current_user["id"]
     ```

3. **Field Mapping Issues**
   - **Issue**: Frontend expecting `originCountry` but backend returning `origin_country`
   - **Fix**: Ensure API service transforms field names:
     ```typescript
     // GET transformation
     originCountry: data.origin_country,
     // PUT transformation
     origin_country: data.originCountry,
     ```

4. **Database Safety Issues**
   - **Issue**: NULL values for required fields like `origin_country`
   - **Fix**: Add fallbacks in use case methods:
     ```python
     origin_country=patient.origin_country or 'CO'
     ```

**Debugging Steps**:
1. Check server logs for TypeErrors during API calls
2. Verify router registration in main.py uses correct prefix
3. Test endpoints directly with curl to isolate backend issues
4. Check browser Network tab for failed API calls
5. Verify field transformations in API service layer

## Naming Conventions

### Cross-Stack Standards
**Python (Backend)**:
- Variables: `snake_case` (`user_id`, `created_at`)
- Classes: `PascalCase` (`UserRepository`)
- Files: `snake_case.py`

**TypeScript (Frontend)**:
- Variables: `camelCase` (`userId`, `createdAt`)
- Components: `PascalCase` (`LoginForm`)
- Files: `kebab-case.ts` (except components: `PascalCase.tsx`)

### Application-Specific
**localStorage Keys**: `camelCase` (`accessToken`, `refreshToken`)
**API Responses**: `snake_case` (`access_token`, `user_type`)
**Component Test IDs**: `[slice]-[component]-[element]` (`auth-login-submit`)

### Consistency Rules
```typescript
// ✅ Frontend - camelCase
localStorage.setItem('accessToken', token);
const userId = user.userId;

// ✅ Backend API Response - snake_case
{
  "access_token": "jwt_token_here",
  "user": { "user_type": "patient" }
}
```

## Development Commands

```bash
# Full stack development
docker-compose up -d

# Backend
cd backend && poetry install && poetry run uvicorn main:app --reload

# Frontend
cd frontend && npm install && npm run dev
```

## Code Quality
- **Formatting**: Black + isort (Python), Prettier (TypeScript)
- **Security**: Bcrypt passwords, JWT auth, Pydantic validation
- **Environment**: All secrets in env vars

## AI Development Checklist

Before generating code:
1. ✅ Identify the correct slice and layer
2. ✅ Verify directory structure compliance
3. ✅ Check naming convention consistency
4. ✅ **Use unified apiClient** for new API services (preferred)
5. ✅ Add required UUID validators (backend)
6. ✅ Use LocalStorageService (legacy APIs only)
7. ✅ Follow useState + useEffect pattern (not SWR)
8. ✅ Ensure proper authentication patterns

## Critical Rules

1. **Slice Consistency**: Identical slice names across backend/frontend
2. **Authentication**: Never use SWR with AuthGuard components
3. **API Services**: Use unified `apiClient` for new services (eliminates auth duplication)
4. **UUID Handling**: Always add field_serializer for UUID fields
5. **Token Access**: Use `apiClient` (preferred) or LocalStorageService (legacy), never direct localStorage
6. **Dependencies**: Domain layer has zero external dependencies
7. **Reference Docs**: Update immediately after any API/DB/Type changes

---

## Implementation Case Study: Gynecological Information (RF003)

### Overview
This case study demonstrates the complete implementation of gynecological information functionality, including UI styling, type compatibility fixes, and documentation updates.

**Implementation Summary**:
- ✅ **Frontend UI**: GynecologicalInformationTab with BasicInformationTab styling applied
- ✅ **Modal Implementation**: Complete GynecologicalInfoEditModal with form validation and radio buttons
- ✅ **Type System**: Enhanced PersonalPatientInfo interfaces with gynecological fields
- ✅ **Type Compatibility**: Fixed helper function types to handle `undefined` values
- ✅ **Date Handling**: Fixed timezone issues for menstruation date display
- ✅ **Documentation**: Updated APIS.md, TYPES.md, DB.md with implementation status

### Technical Implementation Details

#### 1. Visual Styling Application
Applied the exact visual design from BasicInformationTab to GynecologicalInformationTab:

**Key Styling Elements Applied**:
```tsx
// Header with edit button (consistent placement and styling)
<div className="flex items-start justify-between mb-8">
  <div>
    <h3 className="text-xl font-semibold text-vitalgo-dark mb-2">
      Información Ginecológica
    </h3>
    <p className="text-vitalgo-dark-light">
      Tu información de salud reproductiva y ginecológica
    </p>
  </div>
  <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-vitalgo-green rounded-lg hover:bg-vitalgo-green-light...">
</div>

// Gradient background with themed card grid
<div className="bg-gradient-to-br from-vitalgo-green/5 to-pink-50 rounded-xl border border-vitalgo-green/10 p-6 shadow-sm">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    {/* Themed cards with hover effects */}
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-150">
```

#### 2. Type System Enhancement
Extended existing types to include gynecological fields:

**Core Interface Updates**:
```typescript
// Added to PersonalPatientInfo (frontend/src/slices/profile/types/personalInfo.ts)
interface PersonalPatientInfo {
  // ... existing fields
  // Gynecological Information Fields (RF003)
  is_pregnant?: boolean | null;
  pregnancy_weeks?: number | null;
  last_menstruation_date?: string | null;
  pregnancies_count?: number | null;
  births_count?: number | null;
  cesareans_count?: number | null;
  abortions_count?: number | null;
  contraceptive_method?: string | null;
}
```

#### 3. Type Compatibility Fixes
Fixed TypeScript errors by updating helper function signatures:

**Before (Type Errors)**:
```typescript
// ❌ WRONG - Caused TypeScript errors
const formatDate = (dateString: string | null) => { ... }
const getContraceptiveMethodLabel = (method: string | null) => { ... }
const getPregnancyStatusLabel = (isPregnant: boolean | null) => { ... }
```

**After (Type Compatible)**:
```typescript
// ✅ CORRECT - Fixed to handle undefined values from usePersonalPatientInfo
const formatDate = (dateString: string | null | undefined) => { ... }
const getContraceptiveMethodLabel = (method: string | null | undefined) => { ... }
const getPregnancyStatusLabel = (isPregnant: boolean | null | undefined) => { ... }
```

#### 4. Implementation Files Modified
**Frontend Changes**:
- `/src/slices/profile/types/personalInfo.ts` - Added gynecological fields to interfaces
- `/src/slices/profile/components/organisms/GynecologicalInformationTab.tsx` - Applied styling and fixed types
- `/src/slices/profile/components/molecules/TabNavigation.tsx` - Already supported conditional rendering

**Documentation Updates**:
- `docs/APIS.md` - Updated API endpoint schemas with RF003 fields
- `docs/TYPES.md` - Added GynecologicalInfo interfaces and marked fields as implemented
- `docs/DB.md` - Already documented gynecological fields as implemented

### Key Patterns Demonstrated

#### Pattern 1: Type-Safe Helper Functions
```typescript
// ✅ RECOMMENDED Pattern - Handle all possible value types
const formatValue = (value: string | null | undefined) => {
  if (!value) return 'No especificado';  // Handles null and undefined
  return processValue(value);
};
```

#### Pattern 2: Conditional Tab Rendering
```typescript
// ✅ RECOMMENDED Pattern - Filter tabs based on biological sex
const availableTabs = TAB_CONFIGS.filter(tab =>
  tab.id !== 'gynecological' || biologicalSex === 'F'
);
```

#### Pattern 3: Consistent Visual Design
```typescript
// ✅ RECOMMENDED Pattern - Reusable styling classes
const CARD_CLASSES = "bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-150";
const GRADIENT_BACKGROUND = "bg-gradient-to-br from-vitalgo-green/5 to-pink-50 rounded-xl border border-vitalgo-green/10";
```

#### Pattern 4: Type Extension
```typescript
// ✅ RECOMMENDED Pattern - Extend existing interfaces rather than creating separate ones
interface PersonalPatientInfo {
  // ... existing RF002 fields
  // Gynecological Information Fields (RF003) - ✅ IMPLEMENTED
  is_pregnant?: boolean | null;
  // ... other gynecological fields
}
```

### Lessons Learned

1. **Type Compatibility**: Always account for `undefined` values when data comes from hooks that may not have loaded yet
2. **UI Consistency**: Applying existing design patterns ensures visual coherence across tabs
3. **Documentation Sync**: Immediately update all relevant documentation files to reflect implementation status
4. **Incremental Enhancement**: Extending existing types/interfaces is preferable to creating isolated systems

### Future Considerations

### Modal Implementation (Update)
✅ **Complete GynecologicalInfoEditModal Implementation**:
- **Radio Button Interface**: Horizontal layout for pregnancy status (Sí/No/Prefiero no responder)
- **Conditional Fields**: Pregnancy weeks field only appears when "Sí" is selected
- **Form Validation**: Business logic validation (births ≤ pregnancies, cesareans ≤ births, etc.)
- **Date Validation**: Last menstruation date cannot be in the future
- **Timezone Handling**: Fixed Colombian timezone handling for date display
- **Loading States**: Comprehensive loading indicators and error handling

### Key Technical Solutions
#### Problem 1: Date Timezone Issues
**Issue**: User saved "01/01/2020" but display showed "31 de diciembre de 2019"
**Solution**: Enhanced date formatting with explicit timezone handling
```typescript
const date = dateString.includes('T')
  ? new Date(dateString)
  : new Date(dateString + 'T00:00:00');

return date.toLocaleDateString('es-CO', {
  year: 'numeric', month: 'long', day: 'numeric',
  timeZone: 'America/Bogota'
});
```

#### Problem 2: Radio Button UX
**Issue**: Dropdown was not intuitive for pregnancy status
**Solution**: Horizontal radio button layout with clear options
```typescript
<div className="flex flex-wrap gap-4">
  <label className="flex items-center">
    <input type="radio" name="is_pregnant" value="true" />
    <span>Sí</span>
  </label>
  // ... other options
</div>
```

### Future Considerations
- **Enhanced Validation**: Consider adding medical logic for contraceptive method implications
- **Data Analytics**: Track completion rates for gynecological information
- **Accessibility**: Add screen reader improvements for complex form sections

**When in doubt, ask: "Which slice?" and "Which layer?"**