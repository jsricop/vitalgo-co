/**
 * Authentication Guard Component
 * Protects routes that require authentication - simplified to use AuthContext only
 */
'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

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
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  console.log('🔍 AUTHGUARD: Detailed state check', {
    timestamp: new Date().toISOString(),
    currentPath: pathname,
    isAuthenticated,
    isLoading,
    userType: user?.userType,
    requiredUserType,
    hasUser: !!user,
    fullUser: user,
    // Check localStorage directly for debugging
    localStorageState: typeof window !== 'undefined' ? {
      hasAccessToken: !!localStorage.getItem('accessToken'),
      hasRefreshToken: !!localStorage.getItem('refreshToken'),
      hasUser: !!localStorage.getItem('user'),
      accessTokenLength: localStorage.getItem('accessToken')?.length,
      userFromStorage: localStorage.getItem('user')
    } : null
  });

  // Handle authentication redirect - moved to useEffect to avoid setState during render
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('❌ AUTHGUARD: CRITICAL - Not authenticated, redirecting:', {
        timestamp: new Date().toISOString(),
        currentPath: pathname,
        fallbackUrl,
        authContextState: {
          isAuthenticated,
          isLoading,
          hasUser: !!user,
          userType: user?.userType
        },
        possibleCauses: {
          noTokensInStorage: typeof window !== 'undefined' ?
            !localStorage.getItem('accessToken') || !localStorage.getItem('refreshToken') : 'unknown',
          noUserInStorage: typeof window !== 'undefined' ?
            !localStorage.getItem('user') : 'unknown',
          authContextNotInitialized: isLoading,
          userTypeIssue: user && user.userType !== 'patient'
        }
      });
      router.replace(fallbackUrl);
    }
  }, [isLoading, isAuthenticated, router, fallbackUrl, pathname, user]);

  // Handle user type mismatch redirect - moved to useEffect to avoid setState during render
  useEffect(() => {
    if (!isLoading && isAuthenticated && requiredUserType && user?.userType !== requiredUserType) {
      console.error('❌ AUTHGUARD: USER TYPE MISMATCH - Access denied', {
        timestamp: new Date().toISOString(),
        currentPath: pathname,
        required: requiredUserType,
        actual: user?.userType,
        fullUser: user,
        isUserDefined: !!user,
        redirectingTo: '/unauthorized'
      });
      router.replace('/unauthorized');
    }
  }, [isLoading, isAuthenticated, requiredUserType, user, router, pathname]);

  // Show loading state while authentication is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vitalgo-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting for user type mismatch
  if (requiredUserType && user?.userType !== requiredUserType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-4">Acceso Denegado</div>
          <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  console.log('🔍 AUTHGUARD: Authentication successful, rendering children', {
    timestamp: new Date().toISOString(),
    currentPath: pathname,
    userId: user?.id,
    userType: user?.userType
  });

  // User is authenticated and authorized, render protected content
  return <>{children}</>;
};