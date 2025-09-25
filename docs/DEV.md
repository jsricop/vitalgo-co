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
Always use LocalStorageService for token access:

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

### Authentication Debugging Guide

**Common Issue**: "Not authenticated" errors

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
1. Check localStorage keys: `console.log(Object.keys(localStorage))`
2. Verify Authorization header in Network tab
3. Follow working patterns from `medicationsApi.ts`

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
4. ✅ Ensure proper authentication patterns
5. ✅ Add required UUID validators (backend)
6. ✅ Use LocalStorageService (frontend APIs)
7. ✅ Follow useState + useEffect pattern (not SWR)

## Critical Rules

1. **Slice Consistency**: Identical slice names across backend/frontend
2. **Authentication**: Never use SWR with AuthGuard components
3. **UUID Handling**: Always add field_serializer for UUID fields
4. **Token Access**: Always use LocalStorageService, never direct localStorage
5. **Dependencies**: Domain layer has zero external dependencies
6. **Reference Docs**: Update immediately after any API/DB/Type changes

---

**When in doubt, ask: "Which slice?" and "Which layer?"**