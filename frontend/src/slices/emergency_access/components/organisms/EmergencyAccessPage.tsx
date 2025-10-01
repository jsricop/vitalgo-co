/**
 * EmergencyAccessPage Component
 * Main page for paramedic emergency access to patient data
 */
'use client';

import React from 'react';
import { useEmergencyData } from '../../hooks/useEmergencyData';
import {
  BasicInfoCard,
  PersonalInfoCard,
  MedicalInfoCard,
  GynecologicalInfoCard,
} from '../molecules/EmergencyInfoCard';
import { Logo } from '@/shared/components/atoms/Logo';
import { MinimalFooter } from '@/shared/components/organisms/MinimalFooter';

interface EmergencyAccessPageProps {
  qrCode: string;
}

export const EmergencyAccessPage: React.FC<EmergencyAccessPageProps> = ({ qrCode }) => {
  const { data, loading, error, refetch } = useEmergencyData(qrCode);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-vitalgo-green mx-auto"></div>
          <p className="mt-4 text-vitalgo-dark font-semibold">Cargando información de emergencia...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full p-8">
          <div className="bg-white border border-gray-200 border-l-4 border-l-red-500 rounded-lg shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-3">Error</h2>
            <p className="text-gray-700 mb-4">{error.message}</p>
            {error.status === 404 && (
              <p className="text-sm text-gray-600 mb-4">
                El código QR no corresponde a ningún paciente registrado.
              </p>
            )}
            {error.status === 403 && (
              <p className="text-sm text-gray-600 mb-4">
                Solo usuarios paramédicos pueden acceder a esta información.
              </p>
            )}
            <button
              onClick={refetch}
              className="bg-vitalgo-green text-white px-6 py-3 rounded-lg hover:bg-vitalgo-green-light transition-colors font-medium"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">No se encontró información</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <Logo isAuthenticated={false} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white border border-gray-200 border-l-4 border-l-vitalgo-green rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-vitalgo-dark mb-2 flex items-center gap-3">
                <span className="text-4xl">🚨</span>
                Acceso de Emergencia
              </h1>
              <p className="text-gray-600">
                Información médica del paciente • Solo para uso de paramédicos
              </p>
            </div>
            <button
              onClick={refetch}
              className="bg-vitalgo-green text-white px-6 py-3 rounded-lg hover:bg-vitalgo-green-light transition-colors font-medium"
            >
              Actualizar
            </button>
          </div>
        </div>

        {/* Critical Alert - Pregnancy */}
        {data.isPregnant && (
          <div className="bg-red-50 border border-gray-200 border-l-4 border-l-red-500 rounded-lg shadow-sm p-6 mb-6">
            <p className="text-red-700 font-bold text-xl text-center flex items-center justify-center gap-2">
              <span className="text-2xl">⚠️</span>
              PACIENTE EMBARAZADA
              {data.pregnancyWeeks && ` - ${data.pregnancyWeeks} SEMANAS`}
            </p>
          </div>
        )}

        {/* Critical Alert - Allergies */}
        {data.allergies.length > 0 && (
          <div className="bg-red-50 border border-gray-200 border-l-4 border-l-red-500 rounded-lg shadow-sm p-6 mb-6">
            <p className="text-red-700 font-bold text-xl mb-4 flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              ALERGIAS REGISTRADAS
            </p>
            <div className="space-y-2">
              {data.allergies.map((allergy, index) => (
                <p key={index} className="text-red-700 font-semibold text-lg">
                  • {allergy.allergen} ({allergy.severityLevel})
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Basic & Personal Info Cards - Two columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <BasicInfoCard data={data} />
          <PersonalInfoCard data={data} />
        </div>

        {/* Medical Information - Full Width */}
        <div className="space-y-6">
          <MedicalInfoCard data={data} />

          {data.biologicalSex === 'F' && (
            <GynecologicalInfoCard data={data} />
          )}
        </div>

          {/* Footer Disclaimer */}
          <div className="mt-8 bg-white border border-gray-200 border-l-4 border-l-yellow-500 rounded-lg shadow-sm p-5">
            <p className="text-gray-700 text-sm text-center flex items-center justify-center gap-2">
              <span className="text-yellow-600 text-lg">⚠️</span>
              <span>
                Esta información es confidencial y solo debe ser utilizada en situaciones de emergencia.
                El acceso no autorizado está prohibido y puede tener consecuencias legales.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <MinimalFooter />
    </div>
  );
};
