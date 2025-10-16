/**
 * Standalone Surgeries Page
 * Complete surgeries management page showing all surgeries with filtering and statistics
 */
'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AuthGuard } from '../../../shared/components/guards/AuthGuard';
import { PatientNavbar } from '../../../shared/components/organisms/PatientNavbar';
import { SurgeryForm } from '../components/molecules/SurgeryForm';
import { SurgeryCard } from '../components/molecules/SurgeryCard';
import { SurgeryIcon } from '../components/atoms/SurgeryIcon';
import { useSurgeries } from '../hooks/useSurgeries';
import { useSurgeryActions } from '../hooks/useSurgeryActions';
import { Surgery } from '../types';

interface SurgeriesPageProps {
  'data-testid'?: string;
}

// Helper function to convert surgery to form data
const surgeryToFormData = (surgery: Surgery) => ({
  procedureName: surgery.procedureName,
  surgeryDate: surgery.surgeryDate,
  hospitalName: surgery.hospitalName,
  surgeonName: surgery.surgeonName,
  anesthesiaType: surgery.anesthesiaType,
  durationHours: surgery.durationHours,
  notes: surgery.notes,
  complications: surgery.complications
});

export default function SurgeriesPage({
  'data-testid': testId = 'surgeries-page'
}: SurgeriesPageProps) {
  const t = useTranslations('surgeries');
  const tCommon = useTranslations('common');

  const [showForm, setShowForm] = useState(false);
  const [editingSurgery, setEditingSurgery] = useState<Surgery | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'recent' | 'with_complications'>('all');

  const { surgeries, loading, error, refetch } = useSurgeries();
  const { createSurgery, updateSurgery, deleteSurgery, isLoading: actionLoading } = useSurgeryActions();

  // Filter surgeries based on type
  const filteredSurgeries = surgeries.filter(surgery => {
    if (filterType === 'all') return true;
    if (filterType === 'recent') {
      // Consider recent if within last year
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return new Date(surgery.surgeryDate) >= oneYearAgo;
    }
    if (filterType === 'with_complications') {
      return surgery.complications && surgery.complications.trim().length > 0;
    }
    return true;
  });

  // Sort surgeries by surgery date (most recent first) and then by update date
  const sortedSurgeries = filteredSurgeries.sort((a, b) => {
    const dateDiff = new Date(b.surgeryDate).getTime() - new Date(a.surgeryDate).getTime();
    if (dateDiff !== 0) return dateDiff;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const handleAddNew = () => {
    setEditingSurgery(null);
    setShowForm(true);
  };

  const handleEdit = (surgery: Surgery) => {
    setEditingSurgery(surgery);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingSurgery) {
        await updateSurgery(editingSurgery.id, formData);
      } else {
        await createSurgery(formData);
      }
      setShowForm(false);
      setEditingSurgery(null);
      await refetch();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingSurgery(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSurgery(id);
      await refetch();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const getSurgeryCounts = () => {
    const total = surgeries.length;
    const recent = surgeries.filter(surgery => {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return new Date(surgery.surgeryDate) >= oneYearAgo;
    }).length;
    const withComplications = surgeries.filter(surgery =>
      surgery.complications && surgery.complications.trim().length > 0
    ).length;
    const thisYear = surgeries.filter(surgery =>
      new Date(surgery.surgeryDate).getFullYear() === new Date().getFullYear()
    ).length;

    return { total, recent, withComplications, thisYear };
  };

  const surgeryCounts = getSurgeryCounts();

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
                <SurgeryIcon
                  size="xl"
                  color="primary"
                  className="mr-4"
                  data-testid={`${testId}-header-icon`}
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {t('title')}
                  </h1>
                  <p className="text-gray-600">
                    {t('subtitle')}
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
                {t('addButton')}
              </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-vitalgo-green">{surgeryCounts.total}</div>
                <div className="text-sm text-gray-600">{t('stats.total')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{surgeryCounts.recent}</div>
                <div className="text-sm text-gray-600">{t('stats.recent')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{surgeryCounts.withComplications}</div>
                <div className="text-sm text-gray-600">{t('stats.withComplications')}</div>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium text-gray-700">{t('filters.label')}</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filterType === 'all'
                      ? 'text-vitalgo-green bg-vitalgo-green/10'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {t('filters.all', { count: surgeryCounts.total })}
                </button>
                <button
                  onClick={() => setFilterType('recent')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filterType === 'recent'
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {t('filters.recent', { count: surgeryCounts.recent })}
                </button>
                <button
                  onClick={() => setFilterType('with_complications')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filterType === 'with_complications'
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {t('filters.withComplications', { count: surgeryCounts.withComplications })}
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
                  <span>{t('loading')}</span>
                </div>
              </div>
            ) : error ? (
              /* Error State */
              <div className="flex flex-col items-center justify-center py-16">
                <svg className="h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('error.title')}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {error}
                </p>
                <button
                  onClick={() => refetch()}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-vitalgo-green rounded-lg hover:bg-vitalgo-green-light focus:outline-none focus:ring-2 focus:ring-vitalgo-green transition-colors duration-150"
                  data-testid={`${testId}-retry-button`}
                >
                  {tCommon('actions.retry')}
                </button>
              </div>
            ) : sortedSurgeries.length === 0 ? (
              /* Empty State */
              <div className="text-center py-16">
                <SurgeryIcon size="xl" color="default" className="mx-auto mb-6 opacity-50" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {filterType === 'all'
                    ? t('empty.all.title')
                    : filterType === 'recent'
                    ? t('empty.recent.title')
                    : t('empty.withComplications.title')
                  }
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {filterType === 'all'
                    ? t('empty.all.description')
                    : t('empty.filtered.description')
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
                  {t('empty.all.action')}
                </button>
              </div>
            ) : (
              /* Surgeries List */
              <div className="p-6">
                <div className="space-y-4">
                  {sortedSurgeries.map((surgery) => (
                    <SurgeryCard
                      key={surgery.id}
                      surgery={surgery}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      compact={false}
                      data-testid={`${testId}-surgery-${surgery.id}`}
                    />
                  ))}
                </div>

                {/* Results Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-600">
                    {t('results.showing', {
                      shown: sortedSurgeries.length,
                      total: surgeries.length
                    })}
                    {filterType !== 'all' && ` ${t('results.withFilter')}`}
                  </p>
                </div>
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
                  {tCommon('footer.copyright')}
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  {tCommon('footer.privacy')}
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  {tCommon('footer.terms')}
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  {tCommon('footer.support')}
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
            <SurgeryForm
              initialData={editingSurgery ? surgeryToFormData(editingSurgery) : {}}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={actionLoading}
              mode={editingSurgery ? 'edit' : 'create'}
              data-testid={`${testId}-form`}
            />
          </div>
        </div>
      )}
    </AuthGuard>
  );
}