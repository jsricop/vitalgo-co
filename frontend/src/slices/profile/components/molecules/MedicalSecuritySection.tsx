/**
 * MedicalSecuritySection Molecule Component
 * Displays EPS, occupation, and additional insurance information
 */
import React from 'react';
import { PersonalPatientInfo } from '../../types/personalInfo';
import { getEpsByValue, getComplementaryPlanByValue } from '../../data/medicalData';

interface MedicalSecuritySectionProps {
  personalInfo: PersonalPatientInfo | null;
}

export function MedicalSecuritySection({ personalInfo }: MedicalSecuritySectionProps) {
  const formatEpsDisplay = (eps?: string, epsOther?: string) => {
    if (!eps) return 'No especificado';
    if (eps === 'OTRO' && epsOther) {
      return epsOther;
    }
    const epsOption = getEpsByValue(eps);
    return epsOption?.label || eps;
  };

  const formatComplementaryPlanDisplay = (plan?: string, planOther?: string) => {
    if (!plan) return 'No especificado';
    if (plan === 'OTRO' && planOther) {
      return planOther;
    }
    const planOption = getComplementaryPlanByValue(plan);
    return planOption?.label || plan;
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-150">
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 bg-vitalgo-green/10 rounded-lg flex items-center justify-center">
          <svg className="h-4 w-4 text-vitalgo-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h4 className="text-sm font-semibold text-vitalgo-dark ml-2">Seguridad Social y Ocupación</h4>
      </div>

      <div className="space-y-3">
        {/* EPS */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-vitalgo-dark-lighter">EPS</span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-vitalgo-green/10 text-vitalgo-green">
            {formatEpsDisplay(personalInfo?.eps, personalInfo?.eps_other)}
          </span>
        </div>

        {/* Occupation */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-vitalgo-dark-lighter">Ocupación</span>
          <span className="text-sm font-medium text-vitalgo-dark">
            {personalInfo?.occupation || 'No especificado'}
          </span>
        </div>

        {/* Additional Insurance */}
        {personalInfo?.additional_insurance && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-vitalgo-dark-lighter">Seguro Adicional</span>
            <span className="text-sm font-medium text-vitalgo-dark">
              {personalInfo.additional_insurance}
            </span>
          </div>
        )}

        {/* Complementary Plan */}
        {personalInfo?.complementary_plan && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-vitalgo-dark-lighter">Plan Complementario</span>
            <span className="text-sm font-medium text-vitalgo-dark">
              {formatComplementaryPlanDisplay(personalInfo.complementary_plan, personalInfo?.complementary_plan_other)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}