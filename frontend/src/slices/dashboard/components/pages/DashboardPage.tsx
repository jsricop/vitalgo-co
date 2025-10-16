/**
 * Dashboard Page component
 * Main dashboard page with authentication protection and layout
 */
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { DashboardOverview } from '../organisms/DashboardOverview';
import { AuthGuard } from '../../../../shared/components/guards/AuthGuard';
import { PatientNavbar } from '../../../../shared/components/organisms/PatientNavbar';

interface DashboardPageProps {
  'data-testid'?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  'data-testid': testId
}) => {
  const t = useTranslations('common');
  return (
    <AuthGuard requiredUserType="patient">
      <div className="min-h-screen bg-gray-50" data-testid={testId}>
        {/* Patient Navbar with integrated auth and navigation */}
        <PatientNavbar data-testid="dashboard-navbar" />

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
                  © 2024 VitalGo. {t('allRightsReserved')}
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  {t('privacyPolicy')}
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  {t('termsAndConditions')}
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  {t('support')}
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
};