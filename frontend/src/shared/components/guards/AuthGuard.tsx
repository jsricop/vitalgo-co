/**
 * Authentication Guard Component
 * Protects routes that require authentication
 */
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredUserType?: 'patient' | 'admin' | 'doctor';
  fallbackUrl?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredUserType,
  fallbackUrl = '/login'
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        console.log('🔍 AUTHGUARD CHECKPOINT 1: Starting authentication check');

        // Check for access token
        const accessToken = localStorage.getItem('accessToken');
        const userInfo = localStorage.getItem('user');

        console.log('🔍 AUTHGUARD CHECKPOINT 2: localStorage values', {
          hasAccessToken: !!accessToken,
          hasUserInfo: !!userInfo,
          accessTokenLength: accessToken?.length,
          currentPath: window.location.pathname
        });

        if (!accessToken) {
          console.log('🔍 AUTHGUARD CHECKPOINT 3: No access token found - setting unauthenticated');
          setIsAuthenticated(false);
          return;
        }

        // Parse user info if available
        let parsedUserInfo = null;
        if (userInfo) {
          try {
            parsedUserInfo = JSON.parse(userInfo);
            setUserType(parsedUserInfo.user_type);
          } catch (error) {
            console.error('Error parsing user info:', error);
          }
        }

        // Check token expiration (basic check)
        try {
          const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);

          if (tokenPayload.exp && tokenPayload.exp < currentTime) {
            // Token expired
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            return;
          }
        } catch (error) {
          // Invalid token format
          console.error('Invalid token format:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          return;
        }

        console.log('🔍 AUTHGUARD CHECKPOINT 4: Token validation passed - setting authenticated');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('🔍 AUTHGUARD CHECKPOINT ERROR: Authentication check failed', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    console.log('🔍 AUTHGUARD CHECKPOINT 5: Effect triggered', {
      isAuthenticated,
      userType,
      requiredUserType,
      currentPath: window.location.pathname
    });

    if (isAuthenticated === false) {
      // Don't redirect if we already have tokens in localStorage
      const hasTokens = localStorage.getItem('accessToken') && localStorage.getItem('user');
      if (hasTokens) {
        console.log('🔍 AUTHGUARD CHECKPOINT 5.5: Tokens found, retrying authentication check');
        // Force re-check authentication with fresh localStorage data
        setTimeout(() => {
          setIsAuthenticated(null); // Reset to trigger re-check
        }, 100);
        return;
      }

      console.log('🔍 AUTHGUARD CHECKPOINT 6: Redirecting to login due to unauthenticated state');
      router.replace(fallbackUrl);
      return;
    }

    if (isAuthenticated === true && requiredUserType && userType !== requiredUserType) {
      // User type doesn't match requirement
      console.warn(`🔍 AUTHGUARD CHECKPOINT 7: Access denied: required ${requiredUserType}, got ${userType}`);
      router.replace('/unauthorized');
      return;
    }

    if (isAuthenticated === true) {
      console.log('🔍 AUTHGUARD CHECKPOINT 8: User authenticated, allowing access');
    }
  }, [isAuthenticated, userType, requiredUserType, router, fallbackUrl]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vitalgo-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Show loading state while redirecting
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  // User is authenticated, render protected content
  return <>{children}</>;
};