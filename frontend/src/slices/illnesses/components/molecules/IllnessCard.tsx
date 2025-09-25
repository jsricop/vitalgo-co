/**
 * IllnessCard molecule component
 * VitalGo brand-compliant card for displaying individual illness information
 * Follows exact same pattern as MedicationCard
 */
'use client';

import React from 'react';
import { IllnessCardProps } from '../../types';
import { IllnessIcon } from '../atoms/IllnessIcon';
import { IllnessStatus } from '../atoms/IllnessStatus';
import { IllnessActions } from '../atoms/IllnessActions';

// Helper functions
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateShort = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric'
  });
};

const getIllnessSummary = (illness: any): string => {
  const parts = [];
  if (illness.diagnosedBy) parts.push(`Diagnosticado por ${illness.diagnosedBy}`);
  if (illness.cie10Code) parts.push(`CIE-10: ${illness.cie10Code}`);
  if (illness.treatmentDescription) parts.push(illness.treatmentDescription);
  return parts.join(' • ') || 'Sin detalles adicionales';
};

export const IllnessCard: React.FC<IllnessCardProps> = ({
  illness,
  onEdit,
  onDelete,
  onToggleCured,
  showActions = true,
  compact = false,
  'data-testid': testId
}) => {
  const cardClasses = `
    bg-white rounded-xl border border-vitalgo-dark-lightest p-4
    hover:shadow-md transition-shadow duration-200
    ${compact ? 'p-3' : 'p-4'}
  `;

  const titleClasses = `
    font-semibold text-vitalgo-dark
    ${compact ? 'text-sm' : 'text-base'}
  `;

  const subtitleClasses = `
    text-vitalgo-dark-light
    ${compact ? 'text-xs' : 'text-sm'}
  `;

  const metadataClasses = `
    text-vitalgo-dark-lighter
    ${compact ? 'text-xs' : 'text-xs'}
  `;

  return (
    <div className={cardClasses} data-testid={testId}>
      {/* Header Section */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Illness Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <IllnessIcon
              size={compact ? 'md' : 'lg'}
              color="primary"
              data-testid={`${testId}-icon`}
            />
          </div>

          {/* Illness Info */}
          <div className="flex-1 min-w-0">
            <h3 className={`${titleClasses} truncate`} title={illness.illnessName}>
              {illness.illnessName}
            </h3>
            <p className={`${subtitleClasses} mt-1`}>
              Diagnosticada: {formatDate(illness.diagnosisDate)}
            </p>
            {illness.diagnosedBy && !compact && (
              <p className={`${metadataClasses} mt-1`}>
                Diagnosticado por: {illness.diagnosedBy}
              </p>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0 ml-3">
          <IllnessStatus
            illness={illness}
            size={compact ? 'sm' : 'md'}
            data-testid={`${testId}-status`}
          />
        </div>
      </div>

      {/* Treatment Information */}
      {!compact && illness.treatmentDescription && (
        <div className="mb-3">
          <p className={`${subtitleClasses} line-clamp-2`} title={illness.treatmentDescription}>
            <span className="font-medium">Tratamiento:</span> {illness.treatmentDescription}
          </p>
        </div>
      )}

      {/* CIE-10 Code */}
      {!compact && illness.cie10Code && (
        <div className="mb-3">
          <div className="flex items-center">
            <svg className="h-3 w-3 text-vitalgo-dark-lighter mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className={metadataClasses}>
              CIE-10: {illness.cie10Code}
            </span>
          </div>
        </div>
      )}

      {/* Notes Section */}
      {illness.notes && !compact && (
        <div className="mb-3">
          <p className={`${subtitleClasses} line-clamp-2`} title={illness.notes}>
            {illness.notes}
          </p>
        </div>
      )}

      {/* Footer Section */}
      <div className="flex items-center justify-between">
        {/* Last Updated */}
        <div className="flex items-center">
          <svg className="h-3 w-3 text-vitalgo-dark-lighter mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className={metadataClasses}>
            Actualizado: {formatDateShort(illness.updatedAt)}
          </span>
        </div>

        {/* Actions */}
        {showActions && (onEdit || onDelete || onToggleCured) && (
          <IllnessActions
            illness={illness}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleCured={onToggleCured}
            data-testid={`${testId}-actions`}
          />
        )}
      </div>

      {/* Compact Summary for very small cards */}
      {compact && (
        <div className="mt-2 pt-2 border-t border-vitalgo-dark-lightest">
          <p className={`${metadataClasses} truncate`} title={getIllnessSummary(illness)}>
            {getIllnessSummary(illness)}
          </p>
        </div>
      )}
    </div>
  );
};