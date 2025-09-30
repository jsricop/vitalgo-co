/**
 * MedicalInfoSection Molecule Component
 * Displays blood type and other basic medical information
 */
import React from 'react';
import { PersonalPatientInfo } from '../../types/personalInfo';
import { getBloodTypeByValue } from '../../data/medicalData';

interface MedicalInfoSectionProps {
  personalInfo: PersonalPatientInfo | null;
}

export function MedicalInfoSection({ personalInfo }: MedicalInfoSectionProps) {
  const formatBloodTypeDisplay = (bloodType?: string) => {
    if (!bloodType) return 'No especificado';
    const bloodTypeOption = getBloodTypeByValue(bloodType);
    return bloodTypeOption?.label || bloodType;
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-150">
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
          <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h4 className="text-sm font-semibold text-vitalgo-dark ml-2">Información Médica</h4>
      </div>

      <div className="space-y-3">
        {/* Blood Type */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-vitalgo-dark-lighter">Tipo de Sangre</span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            {formatBloodTypeDisplay(personalInfo?.blood_type)}
          </span>
        </div>

        {/* Future medical fields placeholder */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center text-xs text-vitalgo-dark-lighter">
            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Información médica adicional próximamente
          </div>
        </div>
      </div>
    </div>
  );
}