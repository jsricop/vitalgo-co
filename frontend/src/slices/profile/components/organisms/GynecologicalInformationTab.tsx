/**
 * GynecologicalInformationTab Organism Component
 * Displays and manages gynecological information for female patients
 */
'use client';

import React, { useState } from 'react';
import { TabContentProps, GynecologicalInfo, CONTRACEPTIVE_METHODS } from '../../types';
import { PersonalPatientUpdate } from '../../types/personalInfo';
import { usePersonalPatientInfo } from '../../hooks/usePersonalPatientInfo';
import { GynecologicalInfoEditModal } from '../molecules/GynecologicalInfoEditModal';

export function GynecologicalInformationTab({ 'data-testid': testId }: TabContentProps) {
  const { personalInfo, loading, error, updatePersonalInfo, refetch } = usePersonalPatientInfo();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Only show for female patients
  if (personalInfo?.biological_sex !== 'F') {
    return (
      <div className="bg-white rounded-b-xl border border-gray-200 p-6 mt-0 min-h-[400px]" data-testid={testId}>
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Información Ginecológica
            </h3>
            <p className="text-gray-600">
              Información de salud reproductiva y ginecológica.
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">Esta sección solo está disponible para pacientes de sexo biológico femenino</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = async (data: PersonalPatientUpdate) => {
    const result = await updatePersonalInfo(data);
    if (result.success) {
      setIsModalOpen(false);
      // Emit event to notify other components about the profile update
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      console.log('🔔 GynecologicalInformationTab: Profile updated event dispatched');
    }
    return result;
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'No especificado';

    // Handle date parsing to avoid timezone issues
    const date = dateString.includes('T')
      ? new Date(dateString)
      : new Date(dateString + 'T00:00:00');

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return 'Fecha inválida';
    }

    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Bogota'
    });
  };

  const getContraceptiveMethodLabel = (method: string | null | undefined) => {
    if (!method) return 'No especificado';
    const found = CONTRACEPTIVE_METHODS.find(m => m.value === method);
    return found?.label || method;
  };

  const getPregnancyStatusLabel = (isPregnant: boolean | null | undefined) => {
    if (isPregnant === null || isPregnant === undefined) return 'No especificado';
    return isPregnant ? 'Sí' : 'No';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-b-xl border border-gray-200 p-6 mt-0 min-h-[400px]" data-testid={testId}>
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Información Ginecológica
            </h3>
            <p className="text-gray-600">
              Información de salud reproductiva y ginecológica.
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-3 text-gray-600">Cargando información...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-b-xl border border-gray-200 p-6 mt-0 min-h-[400px]" data-testid={testId}>
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Información Ginecológica
            </h3>
            <p className="text-gray-600">
              Información de salud reproductiva y ginecológica.
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.464 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <button
                onClick={refetch}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-150"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!personalInfo) {
    return (
      <div className="bg-white rounded-b-xl border border-gray-200 p-6 mt-0 min-h-[400px]" data-testid={testId}>
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Información Ginecológica
            </h3>
            <p className="text-gray-600">
              Información de salud reproductiva y ginecológica.
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">No se encontró información ginecológica</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const gynecologicalData: GynecologicalInfo = {
    is_pregnant: personalInfo?.is_pregnant ?? null,
    pregnancy_weeks: personalInfo?.pregnancy_weeks ?? null,
    last_menstruation_date: personalInfo?.last_menstruation_date ?? null,
    pregnancies_count: personalInfo?.pregnancies_count ?? null,
    births_count: personalInfo?.births_count ?? null,
    cesareans_count: personalInfo?.cesareans_count ?? null,
    abortions_count: personalInfo?.abortions_count ?? null,
    contraceptive_method: personalInfo?.contraceptive_method ?? null,
  };

  // Check if information is complete
  const isComplete = !!(
    gynecologicalData.is_pregnant !== null ||
    gynecologicalData.last_menstruation_date ||
    gynecologicalData.pregnancies_count !== null ||
    gynecologicalData.births_count !== null ||
    gynecologicalData.cesareans_count !== null ||
    gynecologicalData.abortions_count !== null ||
    gynecologicalData.contraceptive_method
  );

  return (
    <>
      <div className="bg-white rounded-b-xl border border-gray-200 p-6 mt-0 min-h-[400px]" data-testid={testId}>
        {/* Header with Edit Button */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h3 className="text-xl font-semibold text-vitalgo-dark mb-2">
              Información Ginecológica
            </h3>
            <p className="text-vitalgo-dark-light">
              Tu información de salud reproductiva y ginecológica
            </p>
          </div>
          <button
            onClick={handleEditClick}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-150 shadow-sm"
            data-testid={`${testId}-edit-button`}
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
        </div>

        {/* Gynecological Information Cards */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6 shadow-sm">
          {/* Information Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Current Pregnancy Status Card */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-150">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <svg className="h-4 w-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="text-sm font-semibold text-vitalgo-dark ml-2">Estado de Embarazo</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-vitalgo-dark-lighter">¿Está embarazada?</span>
                  <span className="text-sm font-medium text-vitalgo-dark">{getPregnancyStatusLabel(gynecologicalData.is_pregnant)}</span>
                </div>
                {gynecologicalData.is_pregnant && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-vitalgo-dark-lighter">Semanas</span>
                    <span className="text-sm font-medium text-vitalgo-dark">{gynecologicalData.pregnancy_weeks || 'No especificado'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Menstrual Information Card */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-150">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-sm font-semibold text-vitalgo-dark ml-2">Información Menstrual</h4>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-vitalgo-dark-lighter block">Última menstruación</span>
                  <span className="text-sm font-medium text-vitalgo-dark">{formatDate(gynecologicalData.last_menstruation_date)}</span>
                </div>
              </div>
            </div>

            {/* Reproductive History Card */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-150">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-sm font-semibold text-vitalgo-dark ml-2">Historial Reproductivo</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-vitalgo-dark-lighter">Embarazos</span>
                  <span className="text-sm font-medium text-vitalgo-dark">{gynecologicalData.pregnancies_count ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-vitalgo-dark-lighter">Partos</span>
                  <span className="text-sm font-medium text-vitalgo-dark">{gynecologicalData.births_count ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-vitalgo-dark-lighter">Cesáreas</span>
                  <span className="text-sm font-medium text-vitalgo-dark">{gynecologicalData.cesareans_count ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-vitalgo-dark-lighter">Abortos</span>
                  <span className="text-sm font-medium text-vitalgo-dark">{gynecologicalData.abortions_count ?? 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Contraceptive Method Card */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-150">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-sm font-semibold text-vitalgo-dark ml-2">Anticoncepción</h4>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-vitalgo-dark-lighter block">Método actual</span>
                  <span className="text-sm font-medium text-vitalgo-dark">{getContraceptiveMethodLabel(gynecologicalData.contraceptive_method)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${isComplete ? 'bg-purple-500' : 'bg-yellow-500'}`}></div>
              <span className="text-sm text-vitalgo-dark-lighter">
                {isComplete ? 'Información disponible' : 'Información incompleta'}
              </span>
            </div>
            <div className="text-xs text-vitalgo-dark-lighter">
              Última actualización: Hoy
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-vitalgo-dark-lighter">
            💡 Mantén tu información ginecológica actualizada para un mejor cuidado de tu salud reproductiva
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      <GynecologicalInfoEditModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialData={personalInfo}
        isLoading={loading}
        data-testid={`${testId}-edit-modal`}
      />
    </>
  );
}