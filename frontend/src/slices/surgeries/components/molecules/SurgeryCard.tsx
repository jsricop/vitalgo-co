/**
 * SurgeryCard molecule component
 * VitalGo brand-compliant card for displaying individual surgery information
 */
'use client';

import React from 'react';
import { SurgeryCardProps } from '../../types';
import { SurgeryIcon } from '../atoms/SurgeryIcon';
import { formatDateShort } from '../../utils/surgeryHelpers';

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

// Helper function to create surgery summary
const getSurgerySummary = (surgery: any): string => {
  const parts = [];
  if (surgery.hospitalName) {
    parts.push(`Hospital: ${surgery.hospitalName}`);
  }
  if (surgery.surgeonName) {
    parts.push(`Cirujano: ${surgery.surgeonName}`);
  }
  if (surgery.durationHours) {
    parts.push(`Duración: ${surgery.durationHours}h`);
  }
  return parts.join(' • ') || 'Sin detalles adicionales';
};

export const SurgeryCard: React.FC<SurgeryCardProps> = ({
  surgery,
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
          {/* Surgery Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <SurgeryIcon
              size={compact ? 'md' : 'lg'}
              color="primary"
              data-testid={`${testId}-icon`}
            />
          </div>

          {/* Surgery Info */}
          <div className="flex-1 min-w-0">
            <h3 className={`${titleClasses} truncate`} title={surgery.procedureName}>
              {surgery.procedureName}
            </h3>
            <p className={`${subtitleClasses} mt-1`}>
              {formatDate(surgery.surgeryDate)}
              {surgery.hospitalName && ` • ${surgery.hospitalName}`}
            </p>
          </div>
        </div>
      </div>

      {/* Surgery Details */}
      {!compact && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {surgery.surgeonName && (
              <div className="flex items-center">
                <svg className="h-3 w-3 text-vitalgo-dark-lighter mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className={metadataClasses}>
                  Dr. {surgery.surgeonName}
                </span>
              </div>
            )}
            {surgery.anesthesiaType && (
              <div className="flex items-center">
                <svg className="h-3 w-3 text-vitalgo-dark-lighter mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <span className={metadataClasses}>
                  {surgery.anesthesiaType}
                </span>
              </div>
            )}
            {surgery.durationHours && (
              <div className="flex items-center">
                <svg className="h-3 w-3 text-vitalgo-dark-lighter mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={metadataClasses}>
                  {surgery.durationHours}h de duración
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes Section */}
      {surgery.notes && !compact && (
        <div className="mb-3">
          <p className={`${subtitleClasses} line-clamp-2`} title={surgery.notes}>
            <span className="font-medium">Notas:</span> {surgery.notes}
          </p>
        </div>
      )}

      {/* Complications Section */}
      {surgery.complications && !compact && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className={`${subtitleClasses} line-clamp-2 text-red-700`} title={surgery.complications}>
            <span className="font-medium">Complicaciones:</span> {surgery.complications}
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
            Actualizado: {formatDateShort(surgery.updatedAt)}
          </span>
        </div>

        {/* Actions - Using the exact pattern from SurgeriesCard that user likes */}
        {showActions && (onEdit || onDelete) && (
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(surgery)}
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
                onClick={() => onDelete(surgery.id)}
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
          <p className={`${metadataClasses} truncate`} title={getSurgerySummary(surgery)}>
            {getSurgerySummary(surgery)}
          </p>
        </div>
      )}
    </div>
  );
};