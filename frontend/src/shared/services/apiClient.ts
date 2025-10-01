/**
 * Unified API Client Service
 * Centralized authentication, error handling, and request management for all API calls
 * Eliminates duplication across individual API services
 * Fixed: ApiError interface usage and consistent error handling
 * Build fix: Removed instanceof checks and import statements
 */

import { LocalStorageService } from './local-storage-service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

class ApiClientService {
  /**
   * Get authentication headers with JWT token
   */
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = LocalStorageService.getAccessToken();

    // JWT TOKEN DEBUG: Unified token analysis
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExp = payload.exp - currentTime;

        console.log('🔍 UNIFIED API JWT DEBUG - Token Analysis:');
        console.log(`   Current timestamp: ${currentTime}`);
        console.log(`   Token exp timestamp: ${payload.exp}`);
        console.log(`   Time until expiration: ${timeUntilExp} seconds`);
        console.log(`   Token valid: ${timeUntilExp > 0}`);

        if (timeUntilExp <= 0) {
          console.log('❌ UNIFIED API JWT DEBUG - TOKEN ALREADY EXPIRED!');
        }
      } catch (e) {
        console.error('❌ UNIFIED API JWT DEBUG - Token parsing failed:', e);
      }
    } else {
      console.log('❌ UNIFIED API JWT DEBUG - No access token found');
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  /**
   * Unified error handling for all API responses
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      let errorData;
      let errorMessage: string;

      try {
        errorData = await response.json();
      } catch (jsonError) {
        console.error('🔍 UNIFIED API ERROR: Failed to parse error response as JSON:', jsonError);
        errorMessage = `HTTP ${response.status} - Failed to parse error response`;

        const apiError: ApiError = {
          message: errorMessage,
          status: response.status,
          details: null
        };
        throw apiError;
      }

      console.error('🔍 UNIFIED API ERROR: Full error object:', errorData);

      // Extract meaningful error message from different error structures
      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData.detail) {
        // Check if detail is the new validation error format
        if (typeof errorData.detail === 'object' && errorData.detail.errors && Array.isArray(errorData.detail.errors)) {
          // New enhanced validation error format: { message: "...", errors: [...] }
          const validationErrors = errorData.detail.errors;
          if (validationErrors.length > 0) {
            const errorMessages = validationErrors.map((error: any) => {
              return `${error.field}: ${error.message}`;
            });
            errorMessage = `Validation failed: ${errorMessages.join(', ')}`;
          } else {
            errorMessage = errorData.detail.message || 'Validation failed';
          }
        } else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          // Standard FastAPI validation errors array format
          const firstError = errorData.detail[0];
          errorMessage = firstError.msg || firstError.message || 'Validation error';
        } else {
          errorMessage = JSON.stringify(errorData.detail);
        }
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (Array.isArray(errorData) && errorData.length > 0) {
        const firstError = errorData[0];
        errorMessage = firstError.msg || firstError.message || 'Validation error';
      } else if (typeof errorData === 'object') {
        const errorKeys = Object.keys(errorData);
        if (errorKeys.length > 0) {
          const firstKey = errorKeys[0];
          const firstValue = errorData[firstKey];
          errorMessage = `${firstKey}: ${typeof firstValue === 'string' ? firstValue : JSON.stringify(firstValue)}`;
        } else {
          errorMessage = `HTTP ${response.status} - Server error`;
        }
      } else {
        errorMessage = `HTTP ${response.status} - Unknown error format`;
      }

      console.error('🔍 UNIFIED API ERROR: Extracted message:', errorMessage);

      // Handle authentication failures
      if (response.status === 401 || response.status === 403) {
        const isAuthFailure = errorMessage.includes('Authentication required') ||
                             errorMessage.includes('Invalid token') ||
                             errorMessage.includes('Token expired') ||
                             errorMessage.includes('Session not found') ||
                             errorMessage.includes('Account is locked');

        if (isAuthFailure) {
          console.log('🚨 Unified API: Authentication failure detected, redirecting to login:', errorMessage);
          LocalStorageService.clearAuthenticationData();
          window.location.href = '/login';
        } else {
          console.warn(`⚠️ Unified API: ${response.status} error but not an auth failure:`, errorMessage);
        }
      }

      const apiError: ApiError = {
        message: errorMessage,
        status: response.status,
        details: errorData
      };

      throw apiError;
    }

    const data = await response.json();

    return {
      data,
      status: response.status,
      statusText: response.statusText
    };
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    console.log(`📊 GET ${endpoint}`);

    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    const result = await this.handleResponse<T>(response);
    console.log(`✅ GET ${endpoint} - Success`);
    return result;
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    console.log(`📝 POST ${endpoint}`, data ? 'with data' : 'without data');

    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    const result = await this.handleResponse<T>(response);
    console.log(`✅ POST ${endpoint} - Success`);
    return result;
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    console.log(`📝 PUT ${endpoint}`, data ? 'with data' : 'without data');

    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    const result = await this.handleResponse<T>(response);
    console.log(`✅ PUT ${endpoint} - Success`);
    return result;
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    console.log(`🗑️ DELETE ${endpoint}`);

    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    const result = await this.handleResponse<T>(response);
    console.log(`✅ DELETE ${endpoint} - Success`);
    return result;
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    console.log(`📝 PATCH ${endpoint}`, data ? 'with data' : 'without data');

    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    const result = await this.handleResponse<T>(response);
    console.log(`✅ PATCH ${endpoint} - Success`);
    return result;
  }
}

// Export singleton instance
export const apiClient = new ApiClientService();

// Export error class for type checking
export { ApiError };