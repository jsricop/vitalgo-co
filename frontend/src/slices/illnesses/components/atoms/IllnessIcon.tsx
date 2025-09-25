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
      {/* Medical cross icon - represents health/illness management */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6V4m0 2v6m0-6h4m-4 0H8m4 0v6m0 0v6m0-6h4m-4 0H8m4 6H8a2 2 0 01-2-2v-4a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2h-4z"
      />
    </svg>
  );
};