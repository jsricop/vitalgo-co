/**
 * IllnessStatus atom component
 * Displays illness status badges with color coding
 */
'use client';

import React from 'react';
import { IllnessStatusProps } from '../../types';

export const IllnessStatus: React.FC<IllnessStatusProps> = ({
  illness,
  size = 'md',
  'data-testid': testId
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  // Status configuration with VitalGo brand colors
  const statusConfig = {
    activa: {
      label: 'Activa',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
    },
    en_tratamiento: {
      label: 'En Tratamiento',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
    },
    curada: {
      label: 'Curada',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
    },
    cronica: {
      label: 'Crónica',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
      borderColor: 'border-orange-200',
    },
  };

  const config = statusConfig[illness.status];

  // Fallback for unknown status
  if (!config) {
    console.warn('Unknown illness status:', illness.status);
    return (
      <span
        className={`inline-flex items-center font-medium rounded-full border bg-gray-100 text-gray-800 border-gray-200 ${sizeClasses[size]}`}
        data-testid={testId}
      >
        {illness.status}
      </span>
    );
  }

  const badgeClasses = `
    inline-flex items-center font-medium rounded-full border
    ${config.bgColor} ${config.textColor} ${config.borderColor}
    ${sizeClasses[size]}
  `;

  // Add chronic indicator if applicable
  const label = illness.isChronic && illness.status !== 'cronica'
    ? `${config.label} • Crónica`
    : config.label;

  return (
    <span
      className={badgeClasses}
      title={illness.isChronic ? `${config.label} (Condición crónica)` : config.label}
      data-testid={testId}
    >
      {/* Chronic indicator dot */}
      {illness.isChronic && illness.status !== 'cronica' && (
        <span className="w-1.5 h-1.5 bg-current rounded-full mr-1 opacity-60" />
      )}
      {label}
    </span>
  );
};