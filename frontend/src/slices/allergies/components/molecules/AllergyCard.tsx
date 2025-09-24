/**
 * AllergyCard molecule component
 * VitalGo brand-compliant card for displaying individual allergy information
 */
'use client';

import React from 'react';
import { AllergyCardProps } from '../../types';
import { AllergyIcon } from '../atoms/AllergyIcon';
import { SeverityBadge } from '../atoms/SeverityBadge';
import { formatDateShort } from '../../../medications/utils/medicationHelpers';

// Helper function to format dates
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'No especificada';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Fecha inválida';
  }
};

// Helper function to create allergy summary
const getAllergySummary = (allergy: any): string => {
  const parts = [];
  if (allergy.reactionDescription) {
    parts.push(`Reacción: ${allergy.reactionDescription.substring(0, 50)}${allergy.reactionDescription.length > 50 ? '...' : ''}`);
  }
  if (allergy.diagnosisDate) {
    parts.push(`Diagnóstico: ${formatDate(allergy.diagnosisDate)}`);
  }
  return parts.join(' • ') || 'Sin detalles adicionales';
};

export const AllergyCard: React.FC<AllergyCardProps> = ({
  allergy,
  onEdit,
  onDelete,
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
          {/* Allergy Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <AllergyIcon
              size={compact ? 'md' : 'lg'}
              color="warning"
              data-testid={`${testId}-icon`}
            />
          </div>

          {/* Allergy Info */}
          <div className="flex-1 min-w-0">
            <h3 className={`${titleClasses} truncate`} title={allergy.allergen}>
              {allergy.allergen}
            </h3>
            {allergy.reactionDescription && (
              <p className={`${subtitleClasses} mt-1 line-clamp-2`} title={allergy.reactionDescription}>
                {allergy.reactionDescription}
              </p>
            )}
          </div>
        </div>

        {/* Severity Badge */}
        <div className="flex-shrink-0 ml-3">
          <SeverityBadge
            severityLevel={allergy.severityLevel as any}
            size={compact ? 'sm' : 'md'}
            data-testid={`${testId}-severity`}
          />
        </div>
      </div>

      {/* Date Information */}
      {!compact && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {allergy.diagnosisDate && (
              <div className="flex items-center">
                <svg className="h-3 w-3 text-vitalgo-dark-lighter mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={metadataClasses}>
                  Diagnóstico: {formatDate(allergy.diagnosisDate)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes Section */}
      {allergy.notes && !compact && (
        <div className="mb-3">
          <p className={`${subtitleClasses} line-clamp-2`} title={allergy.notes}>
            <span className="font-medium">Notas:</span> {allergy.notes}
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
            Actualizado: {formatDateShort(allergy.updatedAt)}
          </span>
        </div>

        {/* Actions - Using the same pattern from SurgeriesCard that user likes */}
        {showActions && (onEdit || onDelete) && (
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(allergy)}
                className="inline-flex items-center text-xs font-medium text-vitalgo-green hover:text-vitalgo-green-light transition-colors duration-150"
                data-testid={`${testId}-edit-button`}
              >
                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(allergy.id)}
                className="inline-flex items-center text-xs font-medium text-red-600 hover:text-red-700 transition-colors duration-150"
                data-testid={`${testId}-delete-button`}
              >
                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>

      {/* Compact Summary for very small cards */}
      {compact && (
        <div className="mt-2 pt-2 border-t border-vitalgo-dark-lightest">
          <p className={`${metadataClasses} truncate`} title={getAllergySummary(allergy)}>
            {getAllergySummary(allergy)}
          </p>
        </div>
      )}
    </div>
  );
};