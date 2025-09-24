/**
 * Allergies API service
 * Handles all allergy-related API calls with authentication and data transformation
 * Converts between camelCase (frontend) and snake_case (backend)
 */

import {
  Allergy,
  AllergyFormData,
  CreateAllergyRequest,
  AllergyApiResponse
} from '../types';
import { LocalStorageService } from '../../../shared/services/local-storage-service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class AllergiesAPIService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = LocalStorageService.getAccessToken();

    // JWT TOKEN DEBUG: Frontend token analysis for allergies
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExp = payload.exp - currentTime;

        console.log('🔍 ALLERGIES API JWT DEBUG - Token Analysis:');
        console.log(`   Current timestamp: ${currentTime}`);
        console.log(`   Token exp timestamp: ${payload.exp}`);
        console.log(`   Time until expiration: ${timeUntilExp} seconds`);
        console.log(`   Token valid: ${timeUntilExp > 0}`);

        if (timeUntilExp <= 0) {
          console.log('❌ ALLERGIES API JWT DEBUG - TOKEN ALREADY EXPIRED!');
        }
      } catch (e) {
        console.error('❌ ALLERGIES API JWT DEBUG - Token parsing failed:', e);
      }
    } else {
      console.log('❌ ALLERGIES API JWT DEBUG - No access token found');
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData;
      let errorMessage: string;

      try {
        errorData = await response.json();
      } catch (jsonError) {
        console.error('🔍 ALLERGIES API ERROR: Failed to parse error response as JSON:', jsonError);
        errorMessage = `HTTP ${response.status} - Failed to parse error response`;
        throw new Error(errorMessage);
      }

      // Debug log the full error structure for analysis
      console.error('🔍 ALLERGIES API ERROR: Full error object:', errorData);

      // Extract meaningful error message from different error structures
      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData.detail) {
        // Check if detail is the new validation error format from our enhanced backend
        if (typeof errorData.detail === 'object' && errorData.detail.errors && Array.isArray(errorData.detail.errors)) {
          // New enhanced validation error format: { message: "...", errors: [...] }
          const validationErrors = errorData.detail.errors;
          if (validationErrors.length > 0) {
            // Format multiple validation errors for user display
            const errorMessages = validationErrors.map((error: any) => {
              return `${error.field}: ${error.message}`;
            });
            errorMessage = `Validation failed: ${errorMessages.join(', ')}`;
          } else {
            errorMessage = errorData.detail.message || 'Validation failed';
          }
          console.log('🔍 ALLERGIES API: Parsed validation errors:', validationErrors);
        } else if (typeof errorData.detail === 'string') {
          // Standard FastAPI error
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          // Standard FastAPI validation errors array format
          const firstError = errorData.detail[0];
          errorMessage = firstError.msg || firstError.message || 'Validation error';
        } else {
          // Complex detail object - try to extract meaningful info
          errorMessage = JSON.stringify(errorData.detail);
        }
      } else if (errorData.message) {
        // Alternative error format
        errorMessage = errorData.message;
      } else if (Array.isArray(errorData) && errorData.length > 0) {
        // Direct validation errors array format (legacy FastAPI)
        const firstError = errorData[0];
        errorMessage = firstError.msg || firstError.message || 'Validation error';
      } else if (typeof errorData === 'object') {
        // Complex object - try to extract meaningful info
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

      console.error('🔍 ALLERGIES API ERROR: Extracted message:', errorMessage);

      // Only redirect to login for specific authentication failures
      if (response.status === 401 || response.status === 403) {
        const isAuthFailure = errorMessage.includes('Authentication required') ||
                             errorMessage.includes('Invalid token') ||
                             errorMessage.includes('Token expired') ||
                             errorMessage.includes('Session not found') ||
                             errorMessage.includes('Account is locked');

        if (isAuthFailure) {
          console.log('🚨 Allergies API: Authentication failure detected, redirecting to login:', errorMessage);
          LocalStorageService.clearAuthenticationData();
          window.location.href = '/login';
        } else {
          console.warn(`⚠️ Allergies API: ${response.status} error but not an auth failure:`, errorMessage);
        }

        throw new Error(errorMessage || `HTTP ${response.status} - Access denied`);
      }

      throw new Error(errorMessage);
    }

    // Handle 204 No Content responses (e.g., DELETE operations)
    if (response.status === 204) {
      return null;
    }

    // Handle responses with no content
    const contentLength = response.headers.get('Content-Length');
    if (contentLength === '0') {
      return null;
    }

    // Parse JSON for responses with content
    return response.json();
  }

  /**
   * Transform frontend allergy data (camelCase) to API request format (snake_case)
   * Properly handles optional date fields by converting empty values to null
   */
  private transformToApiRequest(data: AllergyFormData): CreateAllergyRequest {
    // Helper function to safely handle optional string fields
    const safeString = (value: string | undefined | null): string | null => {
      if (!value || typeof value !== 'string' || value.trim() === '') {
        return null;
      }
      return value.trim();
    };

    const result = {
      allergen: data.allergen,
      severity_level: data.severityLevel,
      reaction_description: safeString(data.reactionDescription),
      diagnosis_date: safeString(data.diagnosisDate),
      notes: safeString(data.notes)
    };

    console.log('🔍 FRONTEND TRANSFORM DEBUG - Input data:', data);
    console.log('🔍 FRONTEND TRANSFORM DEBUG - Transformed result:', result);

    return result;
  }

  /**
   * Transform API response (snake_case) to frontend allergy format (camelCase)
   */
  private transformFromApiResponse(response: AllergyApiResponse): Allergy {
    return {
      id: response.id,
      patientId: response.patient_id,
      allergen: response.allergen,
      severityLevel: response.severity_level,
      reactionDescription: response.reaction_description,
      diagnosisDate: response.diagnosis_date,
      notes: response.notes,
      createdAt: response.created_at,
      updatedAt: response.updated_at
    };
  }

  /**
   * Get all allergies for the authenticated patient
   */
  async getAllergies(): Promise<Allergy[]> {
    try {
      console.log('📊 Fetching allergies...');

      const response = await fetch(`${API_BASE_URL}/api/allergies/`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      const apiAllergies = await this.handleResponse<AllergyApiResponse[]>(response);
      const allergies = apiAllergies.map(allergy => this.transformFromApiResponse(allergy));

      console.log('✅ Allergies loaded successfully:', allergies.length, 'items');
      return allergies;
    } catch (error) {
      console.error('❌ Error fetching allergies:', error);
      throw error;
    }
  }

  /**
   * Create a new allergy
   */
  async createAllergy(data: AllergyFormData): Promise<Allergy> {
    try {
      console.log('📝 Creating allergy:', data.allergen);

      const apiRequest = this.transformToApiRequest(data);
      const response = await fetch(`${API_BASE_URL}/api/allergies/`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(apiRequest),
      });

      const apiAllergy = await this.handleResponse<AllergyApiResponse>(response);
      const allergy = this.transformFromApiResponse(apiAllergy);

      console.log('✅ Allergy created successfully:', allergy.allergen);
      return allergy;
    } catch (error) {
      console.error('❌ Error creating allergy:', error);
      throw error;
    }
  }

  /**
   * Update an existing allergy
   */
  async updateAllergy(id: number, data: AllergyFormData): Promise<Allergy> {
    try {
      console.log('📝 Updating allergy ID:', id, 'Allergen:', data.allergen);

      const apiRequest = this.transformToApiRequest(data);
      const response = await fetch(`${API_BASE_URL}/api/allergies/${id}`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(apiRequest),
      });

      const apiAllergy = await this.handleResponse<AllergyApiResponse>(response);
      const allergy = this.transformFromApiResponse(apiAllergy);

      console.log('✅ Allergy updated successfully:', allergy.allergen);
      return allergy;
    } catch (error) {
      console.error('❌ Error updating allergy:', error);
      throw error;
    }
  }

  /**
   * Delete an allergy
   */
  async deleteAllergy(id: number): Promise<void> {
    try {
      console.log('🗑️ Deleting allergy ID:', id);

      const response = await fetch(`${API_BASE_URL}/api/allergies/${id}`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      });

      await this.handleResponse(response);
      console.log('✅ Allergy deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting allergy:', error);
      throw error;
    }
  }

  /**
   * Get allergy by ID
   */
  async getAllergyById(id: number): Promise<Allergy> {
    try {
      console.log('🔍 Fetching allergy by ID:', id);

      const allergies = await this.getAllergies();
      const allergy = allergies.find(allergy => allergy.id === id);

      if (!allergy) {
        throw new Error(`Allergy with ID ${id} not found`);
      }

      console.log('✅ Allergy found:', allergy.allergen);
      return allergy;
    } catch (error) {
      console.error('❌ Error fetching allergy by ID:', error);
      throw error;
    }
  }

  /**
   * Get allergies summary for dashboard
   */
  async getAllergiesSummary(): Promise<{
    total: number;
    bySeverity: {
      leve: number;
      moderada: number;
      severa: number;
      critica: number;
    };
    recentlyAdded: number;
  }> {
    try {
      const allergies = await this.getAllergies();
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const summary = {
        total: allergies.length,
        bySeverity: {
          leve: allergies.filter(allergy => allergy.severityLevel === 'leve').length,
          moderada: allergies.filter(allergy => allergy.severityLevel === 'moderada').length,
          severa: allergies.filter(allergy => allergy.severityLevel === 'severa').length,
          critica: allergies.filter(allergy => allergy.severityLevel === 'critica').length,
        },
        recentlyAdded: allergies.filter(allergy =>
          new Date(allergy.createdAt) >= sevenDaysAgo
        ).length
      };

      console.log('📊 Allergies summary:', summary);
      return summary;
    } catch (error) {
      console.error('❌ Error generating allergies summary:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const allergiesAPI = new AllergiesAPIService();