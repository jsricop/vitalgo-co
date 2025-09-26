/**
 * IllnessIcon atom component
 * VitalGo brand-compliant medical cross icon for illnesses
 */
'use client';

import React from 'react';
import { IllnessIconProps } from '../../types';

export const IllnessIcon: React.FC<IllnessIconProps> = ({
  size = 'md',
  color = 'primary',
  'data-testid': testId
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  // Color classes following VitalGo brand
  const colorClasses = {
    primary: 'text-vitalgo-green',
    secondary: 'text-vitalgo-dark-light',
    danger: 'text-red-600',
    success: 'text-green-600',
  };

  const className = `${sizeClasses[size]} ${colorClasses[color]} flex-shrink-0`;

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      data-testid={testId}
    >
      {/* Medical document/chart icon - represents medical records and illness documentation */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
};