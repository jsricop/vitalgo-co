/**
 * MedicationStatus atom component
 * VitalGo brand-compliant status badge for medications
 */
'use client';

import React from 'react';
import { Medication } from '../../types';
import { getMedicationStatus } from '../../utils/medicationHelpers';

interface MedicationStatusProps {
  medication: Medication;
  size?: 'sm' | 'md';
  className?: string;
  'data-testid'?: string;
}

export const MedicationStatus: React.FC<MedicationStatusProps> = ({
  medication,
  size = 'md',
  className = '',
  'data-testid': testId
}) => {
  const status = getMedicationStatus(medication);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  // VitalGo brand-compliant color scheme
  const getStatusClasses = () => {
    switch (status.text) {
      case 'Activo':
        return 'bg-vitalgo-green-lightest text-vitalgo-dark border-vitalgo-green-lighter';
      case 'Inactivo':
        return 'bg-vitalgo-dark-lightest text-vitalgo-dark-light border-vitalgo-dark-lighter';
      case 'Expirado':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Por vencer':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border font-medium
        ${sizeClasses[size]}
        ${getStatusClasses()}
        ${className}
      `}
      data-testid={testId}
      title={`Estado: ${status.text}`}
    >
      {/* Status indicator dot */}
      <span
        className={`
          inline-block w-2 h-2 rounded-full mr-1
          ${status.text === 'Activo' ? 'bg-vitalgo-green' : ''}
          ${status.text === 'Inactivo' ? 'bg-vitalgo-dark-lighter' : ''}
          ${status.text === 'Expirado' ? 'bg-red-500' : ''}
          ${status.text === 'Por vencer' ? 'bg-yellow-500' : ''}
        `}
        aria-hidden="true"
      />
      {status.text}
    </span>
  );
};