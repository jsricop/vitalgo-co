/**
 * Emergency Access Page Component
 * Public page for accessing patient emergency information via QR code
 */
'use client';

import { useEffect } from 'react';
import { useEmergencyData } from '../../hooks/useEmergencyData';
import { EmergencyBadge } from '../atoms/EmergencyBadge';
import { MinimalNavbar } from '@/shared/components/organisms/MinimalNavbar';
import { MinimalFooter } from '@/shared/components/organisms/MinimalFooter';

interface EmergencyAccessPageProps {
  qrUuid: string;
  'data-testid'?: string;
}

export function EmergencyAccessPage({
  qrUuid,
  'data-testid': testId
}: EmergencyAccessPageProps) {
  const { emergencyData, isLoading, error, fetchEmergencyData, clearError } = useEmergencyData();

  useEffect(() => {
    if (qrUuid) {
      fetchEmergencyData(qrUuid);
    }
  }, [qrUuid, fetchEmergencyData]);

  const handleRetry = () => {
    clearError();
    fetchEmergencyData(qrUuid);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col" data-testid={testId}>
        <MinimalNavbar
          backText="Volver"
          backUrl="/"
          showLogo={true}
        />
        <main className="flex-1 bg-red-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Cargando información de emergencia...
                </h2>
                <p className="text-gray-600">Accediendo a datos médicos del paciente</p>
              </div>
            </div>
          </div>
        </main>
        <MinimalFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col" data-testid={testId}>
        <MinimalNavbar
          backText="Volver"
          backUrl="/"
          showLogo={true}
        />
        <main className="flex-1 bg-red-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-red-500 text-6xl mb-4">❌</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Código QR no encontrado
                </h2>
                <p className="text-gray-600 mb-6">
                  {error}
                </p>
                <button
                  onClick={handleRetry}
                  className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </main>
        <MinimalFooter />
      </div>
    );
  }

  if (!emergencyData) {
    return (
      <div className="min-h-screen flex flex-col" data-testid={testId}>
        <MinimalNavbar
          backText="Volver"
          backUrl="/"
          showLogo={true}
        />
        <main className="flex-1 bg-red-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Sin datos de emergencia
                </h2>
                <p className="text-gray-600">
                  No se encontró información médica para este código QR
                </p>
              </div>
            </div>
          </div>
        </main>
        <MinimalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" data-testid={testId}>
      <MinimalNavbar
        backText="Volver"
        backUrl="/"
        showLogo={true}
      />
      <main className="flex-1 bg-red-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-8">
            <EmergencyBadge />
            <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
              Información Médica de Emergencia
            </h1>
            <p className="text-gray-600">
              Datos médicos críticos del paciente
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">

            {/* Patient Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">👤</span>
                Información del Paciente
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {emergencyData.fullName}
                  </p>
                </div>

                {emergencyData.bloodType && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Sangre
                    </label>
                    <p className="text-lg font-semibold text-red-600">
                      {emergencyData.bloodType}
                    </p>
                  </div>
                )}

                {emergencyData.emergencyContact && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contacto de Emergencia
                    </label>
                    <p className="text-lg text-gray-900">
                      {emergencyData.emergencyContact}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">⚕️</span>
                Información Médica
              </h2>

              <div className="space-y-6">

                {/* Critical Allergies */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🚨 Alergias Críticas
                  </label>
                  {emergencyData.criticalAllergies.length > 0 ? (
                    <div className="space-y-1">
                      {emergencyData.criticalAllergies.map((allergy, index) => (
                        <div
                          key={index}
                          className="bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm"
                        >
                          {allergy}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Sin alergias críticas registradas</p>
                  )}
                </div>

                {/* Current Medications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💊 Medicamentos Actuales
                  </label>
                  {emergencyData.currentMedications.length > 0 ? (
                    <div className="space-y-1">
                      {emergencyData.currentMedications.map((medication, index) => (
                        <div
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm"
                        >
                          {medication}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Sin medicamentos actuales registrados</p>
                  )}
                </div>

                {/* Chronic Conditions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏥 Condiciones Crónicas
                  </label>
                  {emergencyData.chronicConditions.length > 0 ? (
                    <div className="space-y-1">
                      {emergencyData.chronicConditions.map((condition, index) => (
                        <div
                          key={index}
                          className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm"
                        >
                          {condition}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Sin condiciones crónicas registradas</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              <span className="text-xl mr-2">ℹ️</span>
              Información Importante
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                • Esta información está destinada únicamente para uso médico de emergencia
              </p>
              <p>
                • Los datos mostrados pueden no estar completos o actualizados
              </p>
              <p>
                • Siempre consulte al paciente si está consciente antes de tomar decisiones médicas
              </p>
              <p>
                • Para información médica completa, contacte al médico tratante del paciente
              </p>
            </div>
          </div>
        </div>
      </main>
      <MinimalFooter />
    </div>
  );
}