/**
 * Dashboard Page component
 * Main dashboard page with authentication protection and layout
 */
'use client';

import React from 'react';
import { DashboardOverview } from '../organisms/DashboardOverview';
import { AuthGuard } from '../../../../shared/components/guards/AuthGuard';
import { AuthenticatedNavbar } from '../../../../shared/components/organisms/AuthenticatedNavbar';
import { useAuthUser } from '../../../../shared/hooks/useAuthUser';

interface DashboardPageProps {
  'data-testid'?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  'data-testid': testId
}) => {
  const { user, isLoading, logout, error } = useAuthUser()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-testid={testId}>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vitalgo-green"></div>
          <span className="text-gray-600">Cargando...</span>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-testid={testId}>
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Error de autenticación'}</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-vitalgo-green text-white px-4 py-2 rounded-md hover:bg-vitalgo-green/90"
          >
            Ir a Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard requiredUserType="patient">
      <div className="min-h-screen bg-gray-50" data-testid={testId}>
        {/* Authenticated Navbar with Dashboard Navigation */}
        <AuthenticatedNavbar
          user={user}
          onLogout={logout}
          showNavigation={true}
          data-testid="dashboard-navbar"
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardOverview data-testid="dashboard-overview" />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <p className="text-gray-500 text-sm">
                  © 2024 VitalGo. Todos los derechos reservados.
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Privacidad
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Términos
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Soporte
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
};