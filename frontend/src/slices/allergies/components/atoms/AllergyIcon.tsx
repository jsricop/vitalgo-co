/**
 * AllergyIcon atom component
 * VitalGo brand-compliant allergy/warning icon
 */
'use client';

import React from 'react';

interface AllergyIconProps {
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

export const AllergyIcon: React.FC<AllergyIconProps> = ({
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
      aria-label="Alergia"
    >
      {/* Allergy/Warning icon */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.464 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z"
      />
    </svg>
  );
};