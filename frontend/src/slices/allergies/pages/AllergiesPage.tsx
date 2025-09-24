/**
 * Standalone Allergies Page
 * Complete allergies management page showing all allergies (all severity levels)
 */
'use client';

import React, { useState } from 'react';
import { AuthGuard } from '../../../shared/components/guards/AuthGuard';
import { PatientNavbar } from '../../../shared/components/organisms/PatientNavbar';
import { AllergyForm } from '../components/molecules/AllergyForm';
import { AllergyCard } from '../components/molecules/AllergyCard';
import { AllergyIcon } from '../components/atoms/AllergyIcon';
import { useAllergies } from '../hooks/useAllergies';
import { useAllergyActions } from '../hooks/useAllergyActions';
import { Allergy, SeverityLevel } from '../types';

interface AllergiesPageProps {
  'data-testid'?: string;
}

// Helper function to convert allergy to form data
const allergyToFormData = (allergy: Allergy) => ({
  allergen: allergy.allergen,
  severityLevel: allergy.severityLevel,
  reactionDescription: allergy.reactionDescription,
  diagnosisDate: allergy.diagnosisDate,
  notes: allergy.notes
});

export default function AllergiesPage({
  'data-testid': testId = 'allergies-page'
}: AllergiesPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAllergy, setEditingAllergy] = useState<Allergy | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<'all' | SeverityLevel>('all');

  const { allergies, loading, error, refetch } = useAllergies();
  const { createAllergy, updateAllergy, deleteAllergy, isLoading: actionLoading } = useAllergyActions();

  // Filter allergies based on severity
  const filteredAllergies = allergies.filter(allergy => {
    if (filterSeverity === 'all') return true;
    return allergy.severityLevel === filterSeverity;
  });

  // Sort allergies by severity (critical first) and then by update date
  const severityOrder: Record<SeverityLevel, number> = {
    'critica': 0,
    'severa': 1,
    'moderada': 2,
    'leve': 3
  };

  const sortedAllergies = filteredAllergies.sort((a, b) => {
    const severityDiff = severityOrder[a.severityLevel as SeverityLevel] - severityOrder[b.severityLevel as SeverityLevel];
    if (severityDiff !== 0) return severityDiff;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const handleAddNew = () => {
    setEditingAllergy(null);
    setShowForm(true);
  };

  const handleEdit = (allergy: Allergy) => {
    setEditingAllergy(allergy);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingAllergy) {
        await updateAllergy(editingAllergy.id, formData);
      } else {
        await createAllergy(formData);
      }
      setShowForm(false);
      setEditingAllergy(null);
      await refetch();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAllergy(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAllergy(id);
      await refetch();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const getSeverityCounts = () => {
    const leve = allergies.filter(allergy => allergy.severityLevel === 'leve').length;
    const moderada = allergies.filter(allergy => allergy.severityLevel === 'moderada').length;
    const severa = allergies.filter(allergy => allergy.severityLevel === 'severa').length;
    const critica = allergies.filter(allergy => allergy.severityLevel === 'critica').length;
    return { leve, moderada, severa, critica, total: allergies.length };
  };

  const severityCounts = getSeverityCounts();


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
                <AllergyIcon
                  size="xl"
                  color="warning"
                  className="mr-4"
                  data-testid={`${testId}-header-icon`}
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Alergias
                  </h1>
                  <p className="text-gray-600">
                    Gestiona todas tus alergias de forma segura. Mantén un registro completo de alergias por nivel de severidad.
                  </p>
                </div>
              </div>

              <button
                onClick={handleAddNew}
                disabled={loading || actionLoading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-vitalgo-green rounded-lg hover:bg-vitalgo-green-light focus:outline-none focus:ring-2 focus:ring-vitalgo-green transition-colors duration-150 disabled:opacity-50"
                data-testid={`${testId}-add-button`}
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar Alergia
              </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-vitalgo-green">{severityCounts.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{severityCounts.critica}</div>
                <div className="text-sm text-gray-600">Críticas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{severityCounts.severa}</div>
                <div className="text-sm text-gray-600">Severas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{severityCounts.moderada}</div>
                <div className="text-sm text-gray-600">Moderadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{severityCounts.leve}</div>
                <div className="text-sm text-gray-600">Leves</div>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Filtrar por severidad:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterSeverity('all')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filterSeverity === 'all'
                      ? 'text-vitalgo-green bg-vitalgo-green/10'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Todas ({severityCounts.total})
                </button>
                <button
                  onClick={() => setFilterSeverity('critica')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filterSeverity === 'critica'
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Críticas ({severityCounts.critica})
                </button>
                <button
                  onClick={() => setFilterSeverity('severa')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filterSeverity === 'severa'
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Severas ({severityCounts.severa})
                </button>
                <button
                  onClick={() => setFilterSeverity('moderada')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filterSeverity === 'moderada'
                      ? 'text-yellow-600 bg-yellow-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Moderadas ({severityCounts.moderada})
                </button>
                <button
                  onClick={() => setFilterSeverity('leve')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filterSeverity === 'leve'
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Leves ({severityCounts.leve})
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl border border-gray-200">
            {loading ? (
              /* Loading State */
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center space-x-3 text-vitalgo-dark-light">
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Cargando alergias...</span>
                </div>
              </div>
            ) : error ? (
              /* Error State */
              <div className="flex flex-col items-center justify-center py-16">
                <svg className="h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Error al cargar alergias
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {error}
                </p>
                <button
                  onClick={() => refetch()}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-vitalgo-green rounded-lg hover:bg-vitalgo-green-light focus:outline-none focus:ring-2 focus:ring-vitalgo-green transition-colors duration-150"
                  data-testid={`${testId}-retry-button`}
                >
                  Intentar de nuevo
                </button>
              </div>
            ) : sortedAllergies.length === 0 ? (
              /* Empty State */
              <div className="text-center py-16">
                <AllergyIcon size="xl" color="default" className="mx-auto mb-6 opacity-50" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {filterSeverity === 'all'
                    ? 'Sin alergias registradas'
                    : `Sin alergias ${filterSeverity === 'leve' ? 'leves' : filterSeverity === 'moderada' ? 'moderadas' : filterSeverity === 'severa' ? 'severas' : 'críticas'}`
                  }
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {filterSeverity === 'all'
                    ? 'Agrega información sobre tus alergias para un mejor seguimiento médico'
                    : `No tienes alergias registradas con severidad ${filterSeverity}`
                  }
                </p>
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-vitalgo-green rounded-lg hover:bg-vitalgo-green-light focus:outline-none focus:ring-2 focus:ring-vitalgo-green transition-colors duration-150"
                  data-testid={`${testId}-empty-add-button`}
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Agregar primera alergia
                </button>
              </div>
            ) : (
              /* Allergies List */
              <div className="p-6">
                <div className="space-y-4">
                  {sortedAllergies.map((allergy) => (
                    <AllergyCard
                      key={allergy.id}
                      allergy={allergy}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      compact={false}
                      data-testid={`${testId}-allergy-${allergy.id}`}
                    />
                  ))}
                </div>

                {/* Results Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-600">
                    Mostrando {sortedAllergies.length} de {allergies.length} alergia{allergies.length !== 1 ? 's' : ''}
                    {filterSeverity !== 'all' && ` con severidad ${filterSeverity}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <AllergyForm
              initialData={editingAllergy ? allergyToFormData(editingAllergy) : {}}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={actionLoading}
              mode={editingAllergy ? 'edit' : 'create'}
              data-testid={`${testId}-form`}
            />
          </div>
        </div>
      )}
    </AuthGuard>
  );
}