/**
 * Dashboard API service
 * Handles all dashboard-related API calls with authentication
 */

import {
  DashboardData
} from '../types';
import { LocalStorageService } from '../../../shared/services/local-storage-service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class DashboardAPIService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = LocalStorageService.getAccessToken();

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
          LocalStorageService.clearAuthenticationData();
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

  // ALL MEDICAL CRUD OPERATIONS REMOVED - Now handled by dedicated slices:
  // - Medications: frontend/src/slices/medications/services/medicationsApi.ts -> /api/medications
  // - Allergies: Use dedicated allergies slice -> /api/allergies
  // - Surgeries: Use dedicated surgeries slice -> /api/surgeries
  // - Illnesses: Use dedicated illnesses slice -> /api/illnesses
  // Dashboard only handles summary/statistics data
}

export const dashboardAPI = new DashboardAPIService();