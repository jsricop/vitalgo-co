/**
 * SurgeryIcon atom component
 * VitalGo brand-compliant surgery icon with size and color variants
 */
'use client';

import React from 'react';

interface SurgeryIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'default' | 'success' | 'warning' | 'error';
  className?: string;
  'data-testid'?: string;
}

export const SurgeryIcon: React.FC<SurgeryIconProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
  'data-testid': testId
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  const colorClasses = {
    primary: 'text-vitalgo-green',
    secondary: 'text-gray-500',
    default: 'text-gray-400',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
  };

  const iconClasses = `${sizeClasses[size]} ${colorClasses[color]} ${className}`;

  return (
    <svg
      className={iconClasses}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      data-testid={testId}
    >
      {/* Surgery scalpel icon */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12l4-4 8 8-4 4-8-8z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 18l3-3"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M5 16l2-2"
      />
    </svg>
  );
};