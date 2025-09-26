/**
 * Allergies API service
 * Handles all allergy-related API calls using unified authentication
 * Converts between camelCase (frontend) and snake_case (backend)
 */

import {
  Allergy,
  AllergyFormData,
  CreateAllergyRequest,
  AllergyApiResponse
} from '../types';
import { apiClient } from '../../../shared/services/apiClient';

class AllergiesAPIService {
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

      const response = await apiClient.get<AllergyApiResponse[]>('/allergies/');
      const allergies = response.data.map(allergy => this.transformFromApiResponse(allergy));

      console.log('✅ Allergies loaded successfully:', allergies.length, 'items');
      return allergies;
    } catch (error) {
      console.error('❌ Error fetching allergies:', error);
      // Re-throw as standard Error for consistent error handling
      if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') {
        throw new Error((error as any).message);
      }
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
      const response = await apiClient.post<AllergyApiResponse>('/allergies/', apiRequest);
      const allergy = this.transformFromApiResponse(response.data);

      console.log('✅ Allergy created successfully:', allergy.allergen);
      return allergy;
    } catch (error) {
      console.error('❌ Error creating allergy:', error);
      // Re-throw as standard Error for consistent error handling
      if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') {
        throw new Error((error as any).message);
      }
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
      const response = await apiClient.put<AllergyApiResponse>(`/allergies/${id}`, apiRequest);
      const allergy = this.transformFromApiResponse(response.data);

      console.log('✅ Allergy updated successfully:', allergy.allergen);
      return allergy;
    } catch (error) {
      console.error('❌ Error updating allergy:', error);
      // Re-throw as standard Error for consistent error handling
      if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') {
        throw new Error((error as any).message);
      }
      throw error;
    }
  }

  /**
   * Delete an allergy
   */
  async deleteAllergy(id: number): Promise<void> {
    try {
      console.log('🗑️ Deleting allergy ID:', id);

      await apiClient.delete(`/allergies/${id}`);
      console.log('✅ Allergy deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting allergy:', error);
      // Re-throw as standard Error for consistent error handling
      if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') {
        throw new Error((error as any).message);
      }
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