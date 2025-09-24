/**
 * MedicationsCard molecule component
 * Dashboard integration card for medication management with CRUD functionality
 * Replaces the "Medicamentos Recientes" section in dashboard
 */
'use client';

import React, { useState } from 'react';
import { MedicationsCardProps, Medication } from '../../types';
import { MedicationCard } from './MedicationCard';
import { MedicationForm } from './MedicationForm';
import { MedicationIcon } from '../atoms/MedicationIcon';
import { useMedications } from '../../hooks/useMedications';
import { useMedicationActions } from '../../hooks/useMedicationActions';
import { medicationToFormData } from '../../utils/medicationHelpers';

export const MedicationsCard: React.FC<MedicationsCardProps> = ({
  maxItems = 3,
  showAddButton = true,
  onNavigateToFull,
  onAddNew,
  className = '',
  'data-testid': testId
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);

  const { medications, loading, error, refetch } = useMedications();
  const { createMedication, updateMedication, deleteMedication, isLoading: actionLoading } = useMedicationActions();

  // Get recent medications for display
  const recentMedications = medications
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, maxItems);

  const handleAddNew = () => {
    setEditingMedication(null);
    setShowForm(true);
    if (onAddNew) {
      onAddNew();
    }
  };

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingMedication) {
        await updateMedication(editingMedication.id, formData);
      } else {
        await createMedication(formData);
      }
      setShowForm(false);
      setEditingMedication(null);
      await refetch();
    } catch (error) {
      // Error is handled by the hook
      console.error('Form submission error:', error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingMedication(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMedication(id);
      await refetch();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      const medication = medications.find(med => med.id === id);
      if (medication) {
        const updatedData = {
          ...medicationToFormData(medication),
          isActive
        };
        await updateMedication(id, updatedData);
        await refetch();
      }
    } catch (error) {
      console.error('Toggle active error:', error);
    }
  };

  const handleViewAll = () => {
    if (onNavigateToFull) {
      onNavigateToFull();
    }
  };

  if (error) {
    return (
      <div className={`bg-white rounded-xl border border-red-200 p-6 ${className}`} data-testid={testId}>
        <div className="flex items-center">
          <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.464 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-red-800 font-medium">Error al cargar medicamentos</h3>
        </div>
        <p className="text-red-600 mt-1 text-sm">{error}</p>
        <button
          onClick={refetch}
          className="mt-3 text-sm font-medium text-vitalgo-green hover:text-vitalgo-green-light"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  // Show form overlay
  if (showForm) {
    return (
      <div className={`bg-white rounded-xl border border-vitalgo-dark-lightest ${className}`} data-testid={testId}>
        <MedicationForm
          initialData={editingMedication ? medicationToFormData(editingMedication) : {}}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={actionLoading}
          mode={editingMedication ? 'edit' : 'create'}
          data-testid={`${testId}-form`}
        />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-vitalgo-dark-lightest p-6 ${className}`} data-testid={testId}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <MedicationIcon
              size="lg"
              color="primary"
              className="mr-3"
              data-testid={`${testId}-header-icon`}
            />
            <div>
              <h2 className="text-lg font-semibold text-vitalgo-dark">
                Medicamentos
              </h2>
              <p className="text-sm text-vitalgo-dark-light">
                Gestiona tus medicamentos
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {showAddButton && (
              <button
                onClick={handleAddNew}
                disabled={loading || actionLoading}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-vitalgo-green rounded-lg hover:bg-vitalgo-green-light focus:outline-none focus:ring-2 focus:ring-vitalgo-green transition-colors duration-150 disabled:opacity-50"
                data-testid={`${testId}-add-button`}
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar
              </button>
            )}

            {onNavigateToFull && medications.length > 0 && (
              <button
                onClick={handleViewAll}
                className="text-sm font-medium text-vitalgo-green hover:text-vitalgo-green-light transition-colors duration-150"
                data-testid={`${testId}-view-all-button`}
              >
                Ver todos ({medications.length})
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(maxItems)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-20"></div>
              </div>
            ))}
          </div>
        ) : recentMedications.length > 0 ? (
          <div className="space-y-4">
            {recentMedications.map((medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
                compact={true}
                showActions={true}
                data-testid={`${testId}-medication-${medication.id}`}
              />
            ))}

            {/* Summary Footer */}
            {medications.length > maxItems && (
              <div className="pt-4 border-t border-vitalgo-dark-lightest">
                <p className="text-sm text-vitalgo-dark-light text-center">
                  Mostrando {maxItems} de {medications.length} medicamentos
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-vitalgo-green-lightest rounded-full flex items-center justify-center mb-4">
              <MedicationIcon
                size="xl"
                color="primary"
                data-testid={`${testId}-empty-icon`}
              />
            </div>
            <h3 className="text-lg font-medium text-vitalgo-dark mb-2">
              No hay medicamentos registrados
            </h3>
            <p className="text-vitalgo-dark-light mb-4">
              Comienza agregando tu primer medicamento para llevar un mejor control de tu tratamiento.
            </p>
            {showAddButton && (
              <button
                onClick={handleAddNew}
                disabled={actionLoading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-vitalgo-green rounded-lg hover:bg-vitalgo-green-light focus:outline-none focus:ring-2 focus:ring-vitalgo-green transition-colors duration-150 disabled:opacity-50"
                data-testid={`${testId}-empty-add-button`}
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar primer medicamento
              </button>
            )}
          </div>
        )}
    </div>
  );
};