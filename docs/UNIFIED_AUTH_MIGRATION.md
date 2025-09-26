# Unified Authentication Migration Plan

## Problem Statement
Currently, authentication logic is duplicated across multiple API services:
- `/slices/medications/services/medicationsApi.ts`
- `/slices/allergies/services/allergiesApi.ts`
- `/slices/surgeries/services/surgeriesApi.ts`
- `/slices/illnesses/services/illnessesApi.ts`
- `/slices/dashboard/services/api.ts`
- `/slices/profile/services/basicProfileApi.ts`

Each service has its own:
- `getAuthHeaders()` method
- `handleResponse()` method
- Error handling logic
- Authentication failure detection
- Token debugging code

## Solution: Unified API Client

Created `/shared/services/apiClient.ts` that provides:
- ✅ **Centralized Authentication**: Single `getAuthHeaders()` with JWT token handling
- ✅ **Unified Error Handling**: Comprehensive error parsing for all API response types
- ✅ **Consistent Auth Failure Detection**: Automatic login redirect for auth failures
- ✅ **Standardized Logging**: Unified debug output format
- ✅ **HTTP Methods**: GET, POST, PUT, DELETE, PATCH with consistent interface
- ✅ **Type Safety**: Generic responses with `ApiResponse<T>` and `ApiError`

## Implementation Status

### ✅ COMPLETED
- **Profile API**: `basicProfileApi.ts` now uses unified client
- **Shared API Client**: Created with full authentication and error handling

### 🔄 PENDING MIGRATION
The following services need to be updated to use `apiClient`:

#### 1. Medications API (`medicationsApi.ts`)
**Before** (145 lines with duplicated auth logic):
```typescript
class MedicationsAPIService {
  private async getAuthHeaders(): Promise<HeadersInit> { /* 45 lines */ }
  private async handleResponse<T>(response: Response): Promise<T> { /* 95 lines */ }
  // ... CRUD methods
}
```

**After** (simplified):
```typescript
class MedicationsAPIService {
  async getMedications(): Promise<Medication[]> {
    const response = await apiClient.get<MedicationApiResponse[]>('/medications/');
    return response.data.map(med => this.transformFromApiResponse(med));
  }
  // ... other methods using apiClient
}
```

#### 2. Dashboard API (`api.ts`)
**Before**: Custom auth headers and error handling
**After**: Simple `apiClient.get<DashboardData>('/dashboard/')`

#### 3. Other Medical APIs
- Allergies, Surgeries, Illnesses follow same pattern

## Migration Benefits

### Code Reduction
- **Remove ~100+ lines** of duplicated authentication code per service
- **Eliminate** 6 copies of `getAuthHeaders()`
- **Eliminate** 6 copies of `handleResponse()`
- **Standardize** error handling across all services

### Maintenance Improvements
- **Single point** for authentication logic changes
- **Consistent** error messages and handling
- **Unified** logging and debugging
- **Easier testing** of authentication flows

### Developer Experience
- **Simple API**: `apiClient.get()`, `apiClient.post()`, etc.
- **Type safe**: Generic responses
- **Automatic auth**: No manual token handling
- **Consistent errors**: Standardized error format

## Usage Examples

### Simple GET Request
```typescript
// Old way (medications)
const response = await fetch(`${API_BASE_URL}/api/medications/`, {
  method: 'GET',
  headers: await this.getAuthHeaders(),
});
const apiMedications = await this.handleResponse<MedicationApiResponse[]>(response);

// New way
const response = await apiClient.get<MedicationApiResponse[]>('/medications/');
const apiMedications = response.data;
```

### POST with Data
```typescript
// Old way
const response = await fetch(`${API_BASE_URL}/api/medications/`, {
  method: 'POST',
  headers: await this.getAuthHeaders(),
  body: JSON.stringify(apiRequest),
});
const result = await this.handleResponse<MedicationApiResponse>(response);

// New way
const response = await apiClient.post<MedicationApiResponse>('/medications/', apiRequest);
const result = response.data;
```

### Error Handling
```typescript
// Automatic auth failure handling, no manual checks needed
try {
  const response = await apiClient.get<Data>('/endpoint');
  return response.data;
} catch (error) {
  // All auth failures automatically handled (redirect to login)
  // Only business logic errors need handling here
  throw error;
}
```

## Migration Priority

### Phase 1 (Immediate)
- ✅ **Profile API** - Already migrated
- 🔄 **Dashboard API** - Simple migration, single endpoint

### Phase 2 (Next Sprint)
- 🔄 **Medications API** - Most complex, highest usage
- 🔄 **Allergies API** - Medium complexity

### Phase 3 (Following Sprint)
- 🔄 **Surgeries API** - Medium complexity
- 🔄 **Illnesses API** - Medium complexity

## Testing Strategy

1. **Gradual Migration**: Migrate one service at a time
2. **Parallel Testing**: Keep old service methods until new ones are verified
3. **Integration Tests**: Verify authentication flows work correctly
4. **Error Scenarios**: Test token expiration, invalid tokens, network errors

## Breaking Changes

**None** - The unified client maintains the same interface as existing services. Each service's public API remains unchanged, only the internal implementation uses the unified client.

## Implementation Guide

For each service migration:

1. **Import unified client**:
   ```typescript
   import { apiClient, ApiError } from '../../../shared/services/apiClient';
   ```

2. **Replace fetch calls**:
   ```typescript
   // Replace manual fetch + auth headers
   const response = await apiClient.get<ResponseType>('/endpoint');
   ```

3. **Remove duplicate methods**:
   - Delete `getAuthHeaders()`
   - Delete `handleResponse()`
   - Remove authentication logic

4. **Update error handling**:
   ```typescript
   catch (error) {
     if (error instanceof ApiError) {
       throw new Error(error.message);
     }
     throw error;
   }
   ```

5. **Test authentication flows**:
   - Valid requests work
   - Token expiration redirects to login
   - Network errors handled properly

## Future Enhancements

With unified authentication, we can easily add:
- **Request/Response Interceptors**
- **Automatic Token Refresh**
- **Request Retry Logic**
- **Centralized Rate Limiting**
- **API Metrics/Monitoring**
- **Request Caching**

## Conclusion

The unified API client eliminates hundreds of lines of duplicated code while providing a more maintainable, testable, and consistent authentication system across the entire application.