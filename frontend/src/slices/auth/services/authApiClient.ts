/**
 * Authentication API Client
 * Handles all API calls to the backend authentication endpoints
 */

import { LoginForm, LoginResponse, LoginErrorResponse, User, AuthApiClient } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class AuthApiClientImpl implements AuthApiClient {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 401) {
        // Clear invalid tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }

      throw new Error(errorData.detail?.message || errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async login(credentials: LoginForm): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          remember_me: credentials.rememberMe
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle specific error responses from backend
        if (response.status === 401) {
          const error: LoginErrorResponse = {
            success: false,
            message: errorData.detail?.message || errorData.message || 'Email o contraseña incorrectos',
            attemptsRemaining: errorData.detail?.attempts_remaining || errorData.attempts_remaining,
            retryAfter: errorData.detail?.retry_after || errorData.retry_after
          };
          throw error;
        }

        if (response.status === 429) {
          const error: LoginErrorResponse = {
            success: false,
            message: errorData.detail || 'Demasiados intentos. Intenta más tarde.',
            retryAfter: 900 // 15 minutes
          };
          throw error;
        }

        throw new Error(errorData.detail || 'Error en el servidor');
      }

      const data = await response.json();

      // Store tokens and user data
      localStorage.setItem('accessToken', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refreshToken', data.refresh_token);
      }
      localStorage.setItem('user', JSON.stringify(data.user));

      return {
        success: true,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenType: data.token_type || 'bearer',
        expiresIn: data.expires_in,
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          userType: data.user.user_type,
          isVerified: data.user.is_verified,
          profileCompleted: data.user.profile_completed,
          mandatoryFieldsCompleted: data.user.mandatory_fields_completed
        },
        redirectUrl: data.redirect_url
      };
    } catch (error) {
      // Re-throw LoginErrorResponse objects
      if (error && typeof error === 'object' && 'success' in error) {
        throw error;
      }

      // Handle network errors
      throw {
        success: false,
        message: 'Error de conexión. Verifica tu internet.',
      } as LoginErrorResponse;
    }
  }

  async logout(logoutAll: boolean = false): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout?logout_all=${logoutAll}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      const data = await this.handleResponse<{ success: boolean; message: string }>(response);

      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      return data;
    } catch (error) {
      // Always clear local storage on logout attempt
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      return { success: true, message: 'Logout exitoso' };
    }
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await this.handleResponse<any>(response);

    // Update stored tokens
    localStorage.setItem('accessToken', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('refreshToken', data.refresh_token);
    }
    localStorage.setItem('user', JSON.stringify(data.user));

    return {
      success: true,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      tokenType: data.token_type || 'bearer',
      expiresIn: data.expires_in,
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        userType: data.user.user_type,
        isVerified: data.user.is_verified,
        profileCompleted: data.user.profile_completed,
        mandatoryFieldsCompleted: data.user.mandatory_fields_completed
      },
      redirectUrl: data.redirect_url
    };
  }

  async validateToken(): Promise<{ valid: boolean; user?: User }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      const data = await this.handleResponse<{ valid: boolean; user?: any }>(response);

      if (data.valid && data.user) {
        return {
          valid: true,
          user: {
            id: data.user.user_id,
            email: data.user.email,
            firstName: data.user.first_name,
            lastName: data.user.last_name,
            userType: data.user.user_type,
            isVerified: data.user.is_verified,
            profileCompleted: data.user.profile_completed,
            mandatoryFieldsCompleted: data.user.mandatory_fields_completed
          }
        };
      }

      return { valid: false };
    } catch (error) {
      return { valid: false };
    }
  }

  async getCurrentUser(): Promise<{ success: boolean; user: User }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await this.handleResponse<{ success: boolean; user: any }>(response);

    return {
      success: data.success,
      user: {
        id: data.user.user_id,
        email: data.user.email,
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        userType: data.user.user_type,
        isVerified: data.user.is_verified,
        profileCompleted: data.user.profile_completed,
        mandatoryFieldsCompleted: data.user.mandatory_fields_completed
      }
    };
  }
}

export const authApiClient = new AuthApiClientImpl();