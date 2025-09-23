/**
 * Centralized localStorage service for consistent token and user data management
 *
 * This service implements the camelCase naming convention for localStorage keys
 * as defined in DEV_CONTEXT.md naming conventions.
 */

export interface UserData {
  id: string;
  email: string;
  userType: string;
  firstName?: string;
  lastName?: string;
  isVerified: boolean;
  profileCompleted: boolean;
  mandatoryFieldsCompleted: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Standard localStorage keys following camelCase convention
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  PREFERRED_LANGUAGE: 'preferredLanguage',
} as const;

/**
 * localStorage utility service for authentication and user data management
 */
export class LocalStorageService {

  // Token management
  static setAccessToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  static setTokens(tokens: AuthTokens): void {
    this.setAccessToken(tokens.accessToken);
    this.setRefreshToken(tokens.refreshToken);
  }

  static getTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: this.getAccessToken(),
      refreshToken: this.getRefreshToken(),
    };
  }

  static hasValidTokens(): boolean {
    const { accessToken, refreshToken } = this.getTokens();
    return !!(accessToken && refreshToken);
  }

  // User data management
  static setUser(userData: UserData): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  }

  static getUser(): UserData | null {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as UserData;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  }

  static hasUser(): boolean {
    return !!this.getUser();
  }

  // Language preference management
  static setPreferredLanguage(languageCode: string): void {
    localStorage.setItem(STORAGE_KEYS.PREFERRED_LANGUAGE, languageCode);
  }

  static getPreferredLanguage(): string | null {
    return localStorage.getItem(STORAGE_KEYS.PREFERRED_LANGUAGE);
  }

  // Authentication state management
  static isAuthenticated(): boolean {
    return this.hasValidTokens() && this.hasUser();
  }

  static clearAuthenticationData(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  static clearAllData(): void {
    this.clearAuthenticationData();
    localStorage.removeItem(STORAGE_KEYS.PREFERRED_LANGUAGE);
  }

  // Auto-login helper for signup flow
  static setAuthDataFromRegistration(response: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: any;
  }): void {
    // Map API response (snake_case) to frontend storage (camelCase)
    this.setTokens({
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expiresIn: response.expires_in,
    });

    // Map user object properties from snake_case to camelCase
    const userData: UserData = {
      id: response.user.id,
      email: response.user.email,
      userType: response.user.user_type,
      firstName: response.user.first_name,
      lastName: response.user.last_name,
      isVerified: response.user.is_verified,
      profileCompleted: response.user.profile_completed,
      mandatoryFieldsCompleted: response.user.mandatory_fields_completed,
    };

    this.setUser(userData);
  }

  // Utility for debugging authentication state
  static getAuthDebugInfo(): {
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    hasUser: boolean;
    isAuthenticated: boolean;
    accessTokenLength?: number;
    userType?: string;
  } {
    const { accessToken, refreshToken } = this.getTokens();
    const user = this.getUser();

    return {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasUser: !!user,
      isAuthenticated: this.isAuthenticated(),
      accessTokenLength: accessToken?.length,
      userType: user?.userType,
    };
  }
}

/**
 * Default export for convenient usage
 */
export default LocalStorageService;