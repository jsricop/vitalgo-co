/**
 * QRLandingPage Component
 * Smart landing page for QR code scans
 * Handles authentication routing for emergency access
 */
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/contexts/AuthContext';
import { EmergencyAccessPage } from './EmergencyAccessPage';

interface QRLandingPageProps {
  qrCode: string;
}

export const QRLandingPage: React.FC<QRLandingPageProps> = ({ qrCode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return;

    // Not authenticated - redirect to login with return URL
    if (!isAuthenticated || !user) {
      const returnUrl = `/qr/${qrCode}`;
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}&userType=paramedic`);
      return;
    }

    // Authenticated but not a paramedic - show error
    if (user.userType !== 'paramedic') {
      // Will render access denied message below
      return;
    }

    // Authenticated as paramedic - continue to emergency access page
  }, [isAuthenticated, isLoading, user, qrCode, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-semibold">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show message while redirecting
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full p-8">
          <div className="bg-white border-2 border-blue-500 rounded-lg p-6 text-center shadow-lg">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-blue-600 mb-2">Acceso Restringido</h2>
            <p className="text-gray-700 mb-4">
              Esta información requiere autenticación como paramédico.
            </p>
            <p className="text-sm text-gray-600">
              Redirigiendo al inicio de sesión...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated but not a paramedic
  if (user.userType !== 'paramedic') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full p-8">
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 text-center shadow-lg">
            <div className="text-6xl mb-4">⛔</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Acceso Denegado</h2>
            <p className="text-gray-700 mb-4">
              Solo usuarios paramédicos pueden acceder a información de emergencia.
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Tu tipo de usuario actual: <strong>{user.userType}</strong>
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Ir al Dashboard
              </button>
              <button
                onClick={() => {
                  // Logout and redirect to login
                  router.push('/login?userType=paramedic');
                }}
                className="w-full bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition"
              >
                Iniciar sesión como paramédico
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated as paramedic - show emergency access page
  return <EmergencyAccessPage qrCode={qrCode} />;
};
