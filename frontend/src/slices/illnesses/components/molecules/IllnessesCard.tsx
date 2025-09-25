/**
 * IllnessesCard molecule component - MAIN DASHBOARD CARD
 * VitalGo brand-compliant card for displaying patient illnesses with inline CRUD
 * Follows exact same structure as MedicationsCard, AllergiesCard, SurgeriesCard
 */
'use client';

import React, { useState } from 'react';
import { IllnessesCardProps, PatientIllnessDTO, IllnessFormData } from '../../types';
import { useIllnesses } from '../../hooks/useIllnesses';
import { useIllnessActions } from '../../hooks/useIllnessActions';
import { IllnessCard } from './IllnessCard';
import { IllnessForm } from './IllnessForm';
import { IllnessIcon } from '../atoms/IllnessIcon';

export const IllnessesCard: React.FC<IllnessesCardProps> = ({
  maxItems = 3,
  showAddButton = true,
  onNavigateToFull,
  className = '',
  'data-testid': testId = 'illnesses-card'
}) => {
  // State management
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIllness, setEditingIllness] = useState<PatientIllnessDTO | null>(null);

  // Hooks
  const { illnesses, isLoading, error, refetch } = useIllnesses();
  const {
    createIllness,
    updateIllness,
    deleteIllness,
    isLoading: isActionsLoading
  } = useIllnessActions();

  // Handlers
  const handleAddClick = () => {
    setShowAddForm(true);
    setEditingIllness(null);
  };

  const handleEditClick = (illness: PatientIllnessDTO) => {
    setEditingIllness(illness);
    setShowAddForm(false);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingIllness(null);
  };

  const handleCreateIllness = async (data: IllnessFormData) => {
    try {
      await createIllness(data);
      setShowAddForm(false);
      refetch(); // Refresh the list
    } catch (error) {
      console.error('Failed to create illness:', error);
      throw error; // Re-throw to let form handle error display
    }
  };

  const handleUpdateIllness = async (data: IllnessFormData) => {
    if (!editingIllness) return;

    try {
      await updateIllness(editingIllness.id, data);
      setEditingIllness(null);
      refetch(); // Refresh the list
    } catch (error) {
      console.error('Failed to update illness:', error);
      throw error; // Re-throw to let form handle error display
    }
  };

  const handleDeleteIllness = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta enfermedad?')) {
      return;
    }

    try {
      await deleteIllness(id);
      setEditingIllness(null);
      refetch(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete illness:', error);
      // Could show a toast notification here
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
        refetch(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to toggle illness status:', error);
      // Could show a toast notification here
    }
  };

  // Sort illnesses by updated date (most recent first)
  const sortedIllnesses = [...illnesses].sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  // Limit items for dashboard display
  const displayedIllnesses = sortedIllnesses.slice(0, maxItems);
  const hasMoreItems = sortedIllnesses.length > maxItems;

  const cardClasses = `bg-white rounded-xl border border-gray-200 shadow-sm ${className}`;

  return (
    <div className={cardClasses} data-testid={testId}>
      {/* Card Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <IllnessIcon size="lg" color="primary" />
          <div>
            <h2 className="text-lg font-semibold text-vitalgo-dark">
              Enfermedades
            </h2>
            <p className="text-sm text-vitalgo-dark-light">
              {illnesses.length} {illnesses.length === 1 ? 'enfermedad registrada' : 'enfermedades registradas'}
            </p>
          </div>
        </div>
        {showAddButton && !showAddForm && !editingIllness && (
          <button
            onClick={handleAddClick}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-vitalgo-green rounded-lg hover:bg-vitalgo-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vitalgo-green transition-colors duration-200"
            data-testid={`${testId}-add-button`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Agregar
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Loading State */}
        {isLoading && illnesses.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-vitalgo-green"></div>
            <span className="ml-2 text-sm text-gray-600">Cargando enfermedades...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className="text-red-600 text-sm mb-2">Error al cargar las enfermedades</div>
            <button
              onClick={() => refetch()}
              className="text-xs text-vitalgo-green hover:text-vitalgo-green-dark"
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* Add Form */}
        {showAddForm && (
          <div className="mb-6">
            <IllnessForm
              onSubmit={handleCreateIllness}
              onCancel={handleCancelForm}
              isLoading={isActionsLoading}
              data-testid={`${testId}-add-form`}
            />
          </div>
        )}

        {/* Edit Form */}
        {editingIllness && (
          <div className="mb-6">
            <IllnessForm
              initialData={editingIllness}
              onSubmit={handleUpdateIllness}
              onCancel={handleCancelForm}
              isLoading={isActionsLoading}
              data-testid={`${testId}-edit-form`}
            />
          </div>
        )}

        {/* Illnesses List */}
        {!isLoading && !error && illnesses.length === 0 && !showAddForm ? (
          <div className="text-center py-8">
            <IllnessIcon size="lg" color="secondary" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay enfermedades registradas</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza agregando la primera enfermedad del paciente.
            </p>
            {showAddButton && (
              <button
                onClick={handleAddClick}
                className="mt-3 inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-vitalgo-green rounded-lg hover:bg-vitalgo-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vitalgo-green"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar Enfermedad
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayedIllnesses.map((illness, index) => (
              <IllnessCard
                key={illness.id}
                illness={illness}
                onEdit={handleEditClick}
                onDelete={handleDeleteIllness}
                onToggleCured={handleToggleCured}
                showActions={!showAddForm && !editingIllness}
                compact={false}
                data-testid={`${testId}-illness-${index}`}
              />
            ))}
          </div>
        )}

        {/* Show More Link */}
        {hasMoreItems && onNavigateToFull && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={onNavigateToFull}
              className="w-full text-center text-sm text-vitalgo-green hover:text-vitalgo-green-dark font-medium"
              data-testid={`${testId}-show-more`}
            >
              Ver todas las enfermedades ({sortedIllnesses.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};