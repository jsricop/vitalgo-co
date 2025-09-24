/**
 * MedicationIcon atom component
 * VitalGo brand-compliant pill/medication icon
 */
'use client';

import React from 'react';

interface MedicationIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  'data-testid'?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8'
};

const colorClasses = {
  default: 'text-gray-600',
  primary: 'text-vitalgo-green',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600'
};

export const MedicationIcon: React.FC<MedicationIconProps> = ({
  size = 'md',
  className = '',
  color = 'default',
  'data-testid': testId
}) => {
  const baseClasses = `${sizeClasses[size]} ${colorClasses[color]} ${className}`;

  return (
    <svg
      className={baseClasses}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      data-testid={testId}
      aria-label="Medicamento"
    >
      {/* Pill/Medication icon */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
      />
    </svg>
  );
};