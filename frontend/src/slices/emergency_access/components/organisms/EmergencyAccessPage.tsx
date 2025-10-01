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

interface EmergencyAccessPageProps {
  qrCode: string;
}

export const EmergencyAccessPage: React.FC<EmergencyAccessPageProps> = ({ qrCode }) => {
  const { data, loading, error, refetch } = useEmergencyData(qrCode);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-semibold">Cargando información de emergencia...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full p-8">
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
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
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No se encontró información</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-red-600 text-white rounded-lg p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">🚨 Acceso de Emergencia</h1>
              <p className="text-red-100">
                Información médica del paciente • Solo para uso de paramédicos
              </p>
            </div>
            <button
              onClick={refetch}
              className="bg-white text-red-600 px-4 py-2 rounded hover:bg-red-50 transition font-semibold"
            >
              Actualizar
            </button>
          </div>
        </div>

        {/* Critical Alert - Pregnancy */}
        {data.isPregnant && (
          <div className="bg-pink-100 border-2 border-pink-500 rounded-lg p-6 mb-6">
            <p className="text-pink-800 font-bold text-xl text-center">
              ⚠️ PACIENTE EMBARAZADA
              {data.pregnancyWeeks && ` - ${data.pregnancyWeeks} SEMANAS`}
            </p>
          </div>
        )}

        {/* Critical Alert - Allergies */}
        {data.allergies.length > 0 && (
          <div className="bg-red-100 border-2 border-red-600 rounded-lg p-6 mb-6">
            <p className="text-red-800 font-bold text-xl mb-2">⚠️ ALERGIAS REGISTRADAS</p>
            <div className="grid gap-2">
              {data.allergies.map((allergy, index) => (
                <p key={index} className="text-red-700 font-semibold">
                  • {allergy.allergen} ({allergy.severityLevel})
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Information Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BasicInfoCard data={data} />
          <PersonalInfoCard data={data} />
        </div>

        <div className="mt-6">
          <MedicalInfoCard data={data} />
        </div>

        {data.biologicalSex === 'F' && (
          <div className="mt-6">
            <GynecologicalInfoCard data={data} />
          </div>
        )}

        {/* Footer Disclaimer */}
        <div className="mt-8 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
          <p className="text-yellow-800 text-sm text-center">
            ⚠️ Esta información es confidencial y solo debe ser utilizada en situaciones de emergencia.
            El acceso no autorizado está prohibido y puede tener consecuencias legales.
          </p>
        </div>
      </div>
    </div>
  );
};
