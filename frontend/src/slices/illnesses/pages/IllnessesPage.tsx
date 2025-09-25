/**
 * Standalone Illnesses Page
 * Complete illnesses management page showing all illnesses (active, chronic, resolved)
 */
'use client';

import React, { useState } from 'react';
import { AuthGuard } from '../../../shared/components/guards/AuthGuard';
import { PatientNavbar } from '../../../shared/components/organisms/PatientNavbar';
import { IllnessForm } from '../components/molecules/IllnessForm';
import { IllnessCard } from '../components/molecules/IllnessCard';
import { IllnessIcon } from '../components/atoms/IllnessIcon';
import { useIllnesses } from '../hooks/useIllnesses';
import { useIllnessActions } from '../hooks/useIllnessActions';
import { illnessToFormData, getStatusCounts, filterIllnesses, sortIllnesses } from '../utils/illnessHelpers';
import { PatientIllnessDTO } from '../types';

interface IllnessesPageProps {
  'data-testid'?: string;
}

export default function IllnessesPage({
  'data-testid': testId = 'illnesses-page'
}: IllnessesPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingIllness, setEditingIllness] = useState<PatientIllnessDTO | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'activas' | 'cronicas' | 'curadas'>('all');

  const { illnesses, isLoading, error, refetch } = useIllnesses();
  const { createIllness, updateIllness, deleteIllness, isLoading: actionLoading } = useIllnessActions();

  // Filter and sort illnesses
  const filteredIllnesses = filterIllnesses(illnesses, filterStatus);
  const sortedIllnesses = sortIllnesses(filteredIllnesses, 'updatedAt', 'desc');

  const handleAddNew = () => {
    setEditingIllness(null);
    setShowForm(true);
  };

  const handleEdit = (illness: PatientIllnessDTO) => {
    setEditingIllness(illness);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingIllness) {
        await updateIllness(editingIllness.id, formData);
      } else {
        await createIllness(formData);
      }
      setShowForm(false);
      setEditingIllness(null);
      await refetch();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingIllness(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta enfermedad?')) {
      return;
    }

    try {
      await deleteIllness(id);
      await refetch();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleToggleCured = async (id: number, newStatus: 'activa' | 'curada') => {
    try {
      const illness = illnesses.find(ill => ill.id === id);
      if (illness) {
        const updatedData = {
          illnessName: illness.illnessName,
          diagnosisDate: illness.diagnosisDate,
          status: newStatus,
          isChronic: illness.isChronic,
          treatmentDescription: illness.treatmentDescription || '',
          cie10Code: illness.cie10Code || '',
          diagnosedBy: illness.diagnosedBy || '',
          notes: illness.notes || ''
        };
        await updateIllness(id, updatedData);
        await refetch();
      }
    } catch (error) {
      console.error('Toggle illness status error:', error);
    }
  };

  const statusCounts = getStatusCounts(illnesses);

  return (
    <AuthGuard requiredUserType="patient">
      <div className="min-h-screen bg-gray-50" data-testid={testId}>
        {/* Navigation */}
        <PatientNavbar />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <IllnessIcon
                  size="lg"
                  color="primary"
                  className="mr-4"
                  data-testid={`${testId}-header-icon`}
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Enfermedades
                  </h1>
                  <p className="text-gray-600">
                    Gestiona todas tus enfermedades y condiciones médicas. Mantén un registro completo de diagnósticos, tratamientos y seguimiento médico.
                  </p>
                </div>
              </div>

              <button
                onClick={handleAddNew}
                disabled={isLoading || actionLoading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-vitalgo-green rounded-lg hover:bg-vitalgo-green-light focus:outline-none focus:ring-2 focus:ring-vitalgo-green transition-colors duration-150 disabled:opacity-50"
                data-testid={`${testId}-add-button`}
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar Enfermedad
              </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-vitalgo-green">{statusCounts.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{statusCounts.activas}</div>
                <div className="text-sm text-gray-600">Activas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{statusCounts.cronicas}</div>
                <div className="text-sm text-gray-600">Crónicas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{statusCounts.curadas}</div>
                <div className="text-sm text-gray-600">Curadas</div>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Filtrar por estado:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filterStatus === 'all'
                      ? 'text-vitalgo-green bg-vitalgo-green/10'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Todos ({statusCounts.total})
                </button>
                <button
                  onClick={() => setFilterStatus('activas')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filterStatus === 'activas'
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Activas ({statusCounts.activas})
                </button>
                <button
                  onClick={() => setFilterStatus('cronicas')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filterStatus === 'cronicas'
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Crónicas ({statusCounts.cronicas})
                </button>
                <button
                  onClick={() => setFilterStatus('curadas')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filterStatus === 'curadas'
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Curadas ({statusCounts.curadas})
                </button>
              </div>
            </div>
          </div>

          {/* Illnesses List */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {error ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.464 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Error al cargar enfermedades
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={refetch}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-vitalgo-green rounded-lg hover:bg-vitalgo-green-light focus:outline-none focus:ring-2 focus:ring-vitalgo-green transition-colors duration-150"
                >
                  Intentar de nuevo
                </button>
              </div>
            ) : isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-24"></div>
                  </div>
                ))}
              </div>
            ) : sortedIllnesses.length > 0 ? (
              <div className="space-y-4">
                {sortedIllnesses.map((illness) => (
                  <IllnessCard
                    key={illness.id}
                    illness={illness}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleCured={handleToggleCured}
                    compact={false}
                    showActions={true}
                    data-testid={`${testId}-illness-${illness.id}`}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-20 h-20 bg-vitalgo-green-lightest rounded-full flex items-center justify-center mb-6">
                  <IllnessIcon
                    size="lg"
                    color="primary"
                    data-testid={`${testId}-empty-icon`}
                  />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {filterStatus === 'all' ? 'No hay enfermedades registradas' :
                   filterStatus === 'activas' ? 'No hay enfermedades activas' :
                   filterStatus === 'cronicas' ? 'No hay enfermedades crónicas' :
                   'No hay enfermedades curadas'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {filterStatus === 'all'
                    ? 'Comienza agregando tu primera enfermedad para llevar un mejor control de tu historial médico.'
                    : 'Cambia el filtro para ver otras enfermedades o agrega una nueva.'
                  }
                </p>
                {filterStatus === 'all' && (
                  <button
                    onClick={handleAddNew}
                    disabled={actionLoading}
                    className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-vitalgo-green rounded-lg hover:bg-vitalgo-green-light focus:outline-none focus:ring-2 focus:ring-vitalgo-green transition-colors duration-150 disabled:opacity-50"
                    data-testid={`${testId}-empty-add-button`}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Agregar primera enfermedad
                  </button>
                )}
              </div>
            )}
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <IllnessForm
              initialData={editingIllness ? illnessToFormData(editingIllness) : undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={actionLoading}
              data-testid={`${testId}-form`}
            />
          </div>
        </div>
      )}
    </AuthGuard>
  );
}