/**
 * Dashboard API service
 * Handles all dashboard-related API calls with authentication
 */

import {
  DashboardData,
  PatientMedication,
  PatientAllergy,
  PatientSurgery,
  PatientIllness,
  MedicalDataFormData
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class DashboardAPIService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem('accessToken');

    // JWT TOKEN DEBUG: Frontend token analysis
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExp = payload.exp - currentTime;

        console.log('🔍 FRONTEND JWT DEBUG - Token Usage Analysis:');
        console.log(`   Current timestamp: ${currentTime}`);
        console.log(`   Token exp timestamp: ${payload.exp}`);
        console.log(`   Time until expiration: ${timeUntilExp} seconds`);
        console.log(`   Token valid: ${timeUntilExp > 0}`);
        console.log(`   Token payload:`, payload);

        if (timeUntilExp <= 0) {
          console.log('❌ FRONTEND JWT DEBUG - TOKEN ALREADY EXPIRED!');
        }
      } catch (e) {
        console.error('❌ FRONTEND JWT DEBUG - Token parsing failed:', e);
      }
    } else {
      console.log('❌ FRONTEND JWT DEBUG - No access token found');
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));

      // Only redirect to login for specific authentication failures
      if (response.status === 401 || response.status === 403) {
        // Check if this is a real authentication failure vs. other API errors
        const errorMessage = errorData.detail || '';
        const isAuthFailure = errorMessage.includes('Authentication required') ||
                             errorMessage.includes('Invalid token') ||
                             errorMessage.includes('Token expired') ||
                             errorMessage.includes('Session not found') ||
                             errorMessage.includes('Account is locked');

        if (isAuthFailure) {
          console.log('🚨 Authentication failure detected, redirecting to login:', errorMessage);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          console.warn(`⚠️ ${response.status} error but not an auth failure:`, errorMessage);
          // For 403 errors that aren't auth failures, show error but don't redirect
        }

        throw new Error(errorMessage || `HTTP ${response.status} - Access denied`);
      }

      // For other errors, don't redirect
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }
    return response.json();
  }

  async getDashboardData(): Promise<DashboardData> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse<DashboardData>(response);
  }

  // Medication CRUD
  async getMedications(): Promise<PatientMedication[]> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/medications`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse<PatientMedication[]>(response);
  }

  async createMedication(data: MedicalDataFormData): Promise<PatientMedication> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/medications`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<PatientMedication>(response);
  }

  async updateMedication(id: number, data: MedicalDataFormData): Promise<PatientMedication> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/medications/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<PatientMedication>(response);
  }

  async deleteMedication(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/medications/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    await this.handleResponse(response);
  }

  // Allergy CRUD
  async getAllergies(): Promise<PatientAllergy[]> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/allergies`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse<PatientAllergy[]>(response);
  }

  async createAllergy(data: MedicalDataFormData): Promise<PatientAllergy> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/allergies`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<PatientAllergy>(response);
  }

  async updateAllergy(id: number, data: MedicalDataFormData): Promise<PatientAllergy> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/allergies/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<PatientAllergy>(response);
  }

  async deleteAllergy(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/allergies/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    await this.handleResponse(response);
  }

  // Surgery CRUD
  async getSurgeries(): Promise<PatientSurgery[]> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/surgeries`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse<PatientSurgery[]>(response);
  }

  async createSurgery(data: MedicalDataFormData): Promise<PatientSurgery> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/surgeries`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<PatientSurgery>(response);
  }

  async updateSurgery(id: number, data: MedicalDataFormData): Promise<PatientSurgery> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/surgeries/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<PatientSurgery>(response);
  }

  async deleteSurgery(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/surgeries/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    await this.handleResponse(response);
  }

  // Illness CRUD
  async getIllnesses(): Promise<PatientIllness[]> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/illnesses`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse<PatientIllness[]>(response);
  }

  async createIllness(data: MedicalDataFormData): Promise<PatientIllness> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/illnesses`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<PatientIllness>(response);
  }

  async updateIllness(id: number, data: MedicalDataFormData): Promise<PatientIllness> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/illnesses/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<PatientIllness>(response);
  }

  async deleteIllness(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/illnesses/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    await this.handleResponse(response);
  }
}

export const dashboardAPI = new DashboardAPIService();