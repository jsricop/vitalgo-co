/**
 * MedicalInformationTab Organism Component
 * Displays and manages medical patient information (EPS, occupation, blood type, emergency contact)
 */
'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { TabContentProps } from '../../types';
import { usePersonalPatientInfo } from '../../hooks/usePersonalPatientInfo';
import { MedicalInfoEditModal } from '../molecules/MedicalInfoEditModal';
import { MedicalSecuritySection } from '../molecules/MedicalSecuritySection';
import { MedicalInfoSection } from '../molecules/MedicalInfoSection';
import { EmergencyContactSection } from '../molecules/EmergencyContactSection';

export function MedicalInformationTab({ 'data-testid': testId }: TabContentProps) {
  const t = useTranslations('profile.medical');
  const tCommon = useTranslations('common');
  const { personalInfo, loading, error, updatePersonalInfo, refetch } = usePersonalPatientInfo();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = async (data: any) => {
    const result = await updatePersonalInfo(data);
    if (result.success) {
      setIsModalOpen(false);
    }
    return result;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-b-xl border border-gray-200 p-6 mt-0 min-h-[400px]" data-testid={testId}>
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('title')}
            </h3>
            <p className="text-gray-600">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vitalgo-green"></div>
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
              {t('title')}
            </h3>
            <p className="text-gray-600">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">{t('connectionError')}</h3>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
              <div className="mt-6">
                <button
                  onClick={refetch}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-vitalgo-green hover:bg-vitalgo-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vitalgo-green"
                >
                  {tCommon('retry')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-b-xl border border-gray-200 p-6 mt-0 min-h-[400px]" data-testid={testId}>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('title')}
            </h3>
            <p className="text-gray-600">
              {t('subtitle')}
            </p>
          </div>
          <button
            onClick={handleEditClick}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-vitalgo-green rounded-lg hover:bg-vitalgo-green-light focus:outline-none focus:ring-2 focus:ring-vitalgo-green transition-colors duration-150 shadow-sm"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {tCommon('edit')}
          </button>
        </div>

        {/* CV-Style Medical Profile Card */}
        <div className="bg-gradient-to-br from-vitalgo-green/5 to-blue-50 rounded-xl border border-vitalgo-green/10 p-6 shadow-sm">
          {/* Information Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Medical Security Section */}
            <MedicalSecuritySection personalInfo={personalInfo} />

            {/* Medical Info Section */}
            <MedicalInfoSection personalInfo={personalInfo} />
          </div>

          {/* Emergency Contact Section - Full Width */}
          <EmergencyContactSection personalInfo={personalInfo} />

          {/* Status Badge */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-vitalgo-dark-lighter">{t('protectedInfo')}</span>
            </div>
            <div className="text-xs text-vitalgo-dark-lighter">
              {t('lastUpdate', { date: t('today') })}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-vitalgo-dark-lighter">
            {t('keepUpdated')}
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <MedicalInfoEditModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          initialData={personalInfo || {}}
        />
      )}
    </div>
  );
}