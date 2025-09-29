/**
 * Personal Profile API service
 * Handles CRUD operations for personal patient information using unified apiClient
 */
import { PersonalPatientInfo, PersonalPatientUpdate } from '../types/personalInfo';
import { apiClient } from '../../../shared/services/apiClient';

class PersonalProfileAPIService {
  /**
   * Get personal patient information from profile endpoint
   */
  async getPersonalPatientInfo(): Promise<PersonalPatientInfo> {
    try {
      console.log('📊 Fetching personal patient info...');

      const response = await apiClient.get<any>('/profile/extended');
      const data = response.data;

      // Transform snake_case to camelCase - extract personal info fields
      const personalInfo: PersonalPatientInfo = {
        biological_sex: data.biological_sex,
        gender: data.gender,
        birth_country: data.birth_country,
        birth_department: data.birth_department,
        birth_city: data.birth_city,
        residence_address: data.residence_address,
        residence_department: data.residence_department,
        residence_city: data.residence_city,
      };

      console.log('✅ Personal patient info loaded successfully:', personalInfo);
      return personalInfo;
    } catch (error) {
      console.error('❌ Error fetching personal patient info:', error);
      // Re-throw as standard Error for consistent error handling
      if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') {
        throw new Error((error as any).message);
      }
      throw error;
    }
  }

  /**
   * Update personal patient information
   */
  async updatePersonalPatientInfo(data: PersonalPatientUpdate): Promise<{ success: boolean; message: string }> {
    try {
      console.log('📝 Updating personal patient info:', data);

      // Data is already in snake_case format from our types
      const apiRequest = {
        biological_sex: data.biological_sex,
        gender: data.gender,
        birth_country: data.birth_country,
        birth_department: data.birth_department,
        birth_city: data.birth_city,
        residence_address: data.residence_address,
        residence_department: data.residence_department,
        residence_city: data.residence_city,
      };

      const response = await apiClient.put<{ success: boolean; message: string }>('/profile/complete', apiRequest);

      console.log('✅ Personal patient info updated successfully');
      return { success: true, message: 'Información personal actualizada exitosamente' };
    } catch (error) {
      console.error('❌ Error updating personal patient info:', error);
      // Re-throw as standard Error for consistent error handling
      if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') {
        throw new Error((error as any).message);
      }
      throw error;
    }
  }
}

// Export singleton instance
export const personalProfileApi = new PersonalProfileAPIService();