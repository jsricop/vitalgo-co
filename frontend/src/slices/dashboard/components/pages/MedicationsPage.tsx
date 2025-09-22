/**
 * Medications Page component
 * Dedicated page for managing patient medications
 */
'use client';

import React from 'react';
import { MedicalDataList } from '../organisms/MedicalDataList';
import { AuthGuard } from '../../../../shared/components/guards/AuthGuard';

interface MedicationsPageProps {
  'data-testid'?: string;
}

export const MedicationsPage: React.FC<MedicationsPageProps> = ({
  'data-testid': testId
}) => {
  return (
    <AuthGuard requiredUserType="patient">
      <div className="min-h-screen bg-gray-50" data-testid={testId}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <img
                  className="h-8 w-auto"
                  src="/logo.svg"
                  alt="VitalGo"
                />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  VitalGo
                </span>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex space-x-8">
                <a
                  href="/dashboard"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md"
                >
                  Dashboard
                </a>
                <a
                  href="/dashboard/medications"
                  className="text-vitalgo-green font-medium px-3 py-2 rounded-md"
                >
                  Medicamentos
                </a>
                <a
                  href="/dashboard/allergies"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md"
                >
                  Alergias
                </a>
                <a
                  href="/dashboard/surgeries"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md"
                >
                  Cirugías
                </a>
                <a
                  href="/dashboard/illnesses"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md"
                >
                  Enfermedades
                </a>
              </nav>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900">
                    <div className="h-8 w-8 bg-vitalgo-green rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">U</span>
                    </div>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Medicamentos
              </h1>
              <p className="text-gray-600">
                Gestiona tus medicamentos de forma segura. Mantén un registro actualizado de todos tus medicamentos activos, dosificación y frecuencia.
              </p>
            </div>

            <MedicalDataList
              type="medications"
              title="Medicamentos"
              emptyStateMessage="Comienza agregando tu primer medicamento para llevar un control completo de tu tratamiento médico."
              data-testid="medications-list"
            />
          </div>
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