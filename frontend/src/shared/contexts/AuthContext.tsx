/**
 * AuthContext - Single source of truth for authentication state
 * Centralizes all authentication logic to prevent race conditions
 */
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApiClient } from '../../slices/auth/services/authApiClient';
import { LocalStorageService } from '../services/local-storage-service';
import type { LoginForm, User } from '../../slices/auth/types';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginForm) => Promise<string | undefined>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRedirect, setLastRedirect] = useState<string | null>(null);
  const router = useRouter();

  // Initialize authentication state
  const initializeAuth = useCallback(async () => {
    const initStartTime = Date.now();
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 AUTH CONTEXT INIT: Starting authentication initialization', {
        timestamp: new Date().toISOString(),
        startTime: initStartTime,
        currentPath: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
      });

      // For debugging: Log current localStorage state
      if (typeof window !== 'undefined') {
        const debugInfo = LocalStorageService.getAuthDebugInfo();
        console.log('🔍 AUTH CONTEXT INIT: Current localStorage state', debugInfo);
      }

      // Check for stored tokens
      const accessToken = LocalStorageService.getAccessToken();
      const storedUser = LocalStorageService.getUser();

      console.log('🔍 AUTH CONTEXT INIT: Token and user check', {
        timestamp: new Date().toISOString(),
        hasAccessToken: !!accessToken,
        accessTokenLength: accessToken?.length,
        hasStoredUser: !!storedUser,
        storedUserType: storedUser?.userType,
        localStorage: LocalStorageService.getAuthDebugInfo()
      });

      if (!accessToken) {
        console.log('❌ AUTH CONTEXT INIT: No access token found - setting unauthenticated', {
          timestamp: new Date().toISOString(),
          hasStoredUser: !!storedUser,
          localStorage: LocalStorageService.getAuthDebugInfo()
        });
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Validate token expiration
      try {
        console.log('🔍 AUTH CONTEXT INIT: Starting token validation', {
          timestamp: new Date().toISOString(),
          tokenPreview: accessToken.substring(0, 50) + '...'
        });

        const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        console.log('🔍 AUTH CONTEXT INIT: Token payload analysis', {
          timestamp: new Date().toISOString(),
          tokenExp: tokenPayload.exp,
          currentTime: currentTime,
          timeDiff: tokenPayload.exp - currentTime,
          timeUntilExp: `${Math.floor((tokenPayload.exp - currentTime) / 60)} minutes`,
          tokenPayload: tokenPayload,
          isExpired: tokenPayload.exp < currentTime
        });

        if (tokenPayload.exp && tokenPayload.exp < currentTime) {
          console.error('❌ AUTH CONTEXT INIT: TOKEN EXPIRED - clearing authentication', {
            timestamp: new Date().toISOString(),
            tokenExp: tokenPayload.exp,
            currentTime: currentTime,
            timeDiff: tokenPayload.exp - currentTime,
            expiredBy: `${Math.floor((currentTime - tokenPayload.exp) / 60)} minutes ago`
          });
          LocalStorageService.clearAuthenticationData();
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        console.log('✅ AUTH CONTEXT INIT: Token is valid and not expired');
      } catch (tokenError) {
        console.error('❌ AUTH CONTEXT: INVALID TOKEN FORMAT - clearing auth', {
          timestamp: new Date().toISOString(),
          error: tokenError,
          tokenPreview: accessToken?.substring(0, 50) + '...',
          tokenLength: accessToken?.length
        });
        LocalStorageService.clearAuthenticationData();
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Use stored user data if available
      if (storedUser) {
        console.log('✅ AUTH CONTEXT INIT: Using stored user data - SETTING AUTHENTICATED', {
          timestamp: new Date().toISOString(),
          userId: storedUser.id,
          userType: storedUser.userType,
          isVerified: storedUser.isVerified,
          fullStoredUser: storedUser,
          aboutToSetAuthenticated: true
        });
        setUser(storedUser);
        setIsAuthenticated(true);
        console.log('✅ AUTH CONTEXT INIT: User and authentication state SET - should be authenticated now');
      } else {
        // Fetch user data from API
        console.log('🔍 AUTH CONTEXT: Fetching user data from API');
        try {
          const response = await authApiClient.getCurrentUser();
          if (response.success && response.user) {
            const userData = response.user;
            setUser(userData);
            setIsAuthenticated(true);

            // Store user data for future use
            LocalStorageService.setAuthDataFromRegistration({
              access_token: accessToken,
              refresh_token: LocalStorageService.getRefreshToken() || '',
              expires_in: 1800,
              user: userData
            });
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (apiError) {
          console.error('🔍 AUTH CONTEXT: API fetch failed', apiError);
          LocalStorageService.clearAuthenticationData();
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('🔍 AUTH CONTEXT: Initialization error', error);
      setError('Error initializing authentication');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      const initEndTime = Date.now();
      const initDuration = initEndTime - initStartTime;
      console.log('🔍 AUTH CONTEXT INIT: Completed authentication initialization', {
        timestamp: new Date().toISOString(),
        duration: `${initDuration}ms`,
        finalState: { isAuthenticated, isLoading: false, hasUser: !!user }
      });
      setIsLoading(false);
    }
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginForm): Promise<string | undefined> => {
    const loginStartTime = Date.now();
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 AUTH CONTEXT LOGIN: Starting login process', {
        timestamp: new Date().toISOString(),
        email: credentials.email,
        startTime: loginStartTime
      });

      const response = await authApiClient.login(credentials);

      console.log('🔍 AUTH CONTEXT LOGIN: Login successful', {
        timestamp: new Date().toISOString(),
        userId: response.user.id,
        userType: response.user.userType,
        redirectUrl: response.redirectUrl,
        duration: `${Date.now() - loginStartTime}ms`
      });

      // Update authentication state
      setUser(response.user);
      setIsAuthenticated(true);

      return response.redirectUrl;
    } catch (error) {
      console.error('🔍 AUTH CONTEXT: Login failed', error);
      setError(error instanceof Error ? error.message : 'Login failed');
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('🔍 AUTH CONTEXT: Starting logout process');

      // Call API logout
      await authApiClient.logout(false);
    } catch (error) {
      console.error('🔍 AUTH CONTEXT: Logout API error (continuing)', error);
    } finally {
      // Always clear local state and redirect
      LocalStorageService.clearAuthenticationData();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      setIsLoading(false);

      // Prevent rapid successive redirects
      const now = Date.now();
      const redirectKey = '/login';
      if (lastRedirect === redirectKey && (now - parseInt(localStorage.getItem('lastRedirectTime') || '0')) < 1000) {
        console.log('🔍 AUTH CONTEXT LOGOUT: Preventing rapid redirect to login');
        return;
      }

      setLastRedirect(redirectKey);
      localStorage.setItem('lastRedirectTime', now.toString());

      console.log('🔍 AUTH CONTEXT LOGOUT: Logout completed, redirecting to login', {
        timestamp: new Date().toISOString(),
        currentPath: window.location.pathname
      });
      router.replace('/login');
    }
  }, [router]);

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};