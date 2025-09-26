/**
 * Profile Page component
 * Tabbed profile page with authentication protection and layout
 */
'use client';

import React, { useState } from 'react';
import { AuthGuard } from '../../../shared/components/guards/AuthGuard';
import { PatientNavbar } from '../../../shared/components/organisms/PatientNavbar';
import { TabNavigation } from '../components/molecules/TabNavigation';
import { BasicInformationTab } from '../components/organisms/BasicInformationTab';
import { PersonalInformationTab } from '../components/organisms/PersonalInformationTab';
import { MedicalInformationTab } from '../components/organisms/MedicalInformationTab';
import { GynecologicalInformationTab } from '../components/organisms/GynecologicalInformationTab';
import { ProfileTab } from '../types';

interface ProfilePageProps {
  'data-testid'?: string;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  'data-testid': testId
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('basic');

  const handleTabChange = (tab: ProfileTab) => {
    setActiveTab(tab);
    // Scroll to top when tab changes for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicInformationTab data-testid="profile-basic-tab-content" />;
      case 'personal':
        return <PersonalInformationTab data-testid="profile-personal-tab-content" />;
      case 'medical':
        return <MedicalInformationTab data-testid="profile-medical-tab-content" />;
      case 'gynecological':
        return <GynecologicalInformationTab data-testid="profile-gynecological-tab-content" />;
      default:
        return <BasicInformationTab data-testid="profile-basic-tab-content" />;
    }
  };

  return (
    <AuthGuard requiredUserType="patient">
      <div className="min-h-screen bg-gray-50" data-testid={testId}>
        {/* Patient Navbar with integrated auth and navigation */}
        <PatientNavbar data-testid="profile-navbar" />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-vitalgo-green rounded-lg flex items-center justify-center mr-4">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Mi Perfil
                  </h1>
                  <p className="text-gray-600">
                    Gestiona tu información personal y médica de forma segura.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <TabNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
            data-testid="profile-tab-navigation"
          />

          {/* Tab Content */}
          {renderTabContent()}
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