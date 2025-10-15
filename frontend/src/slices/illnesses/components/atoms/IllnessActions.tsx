/**
 * IllnessActions atom component
 * Action buttons for edit and delete operations
 */
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { IllnessActionsProps } from '../../types';

export const IllnessActions: React.FC<IllnessActionsProps> = ({
  illness,
  onEdit,
  onDelete,
  onToggleCured,
  'data-testid': testId
}) => {
  const t = useTranslations('illnesses');

  if (!onEdit && !onDelete && !onToggleCured) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2" data-testid={testId}>
      {onEdit && (
        <button
          onClick={() => onEdit(illness)}
          className="inline-flex items-center text-xs font-medium text-vitalgo-green hover:text-vitalgo-green-light transition-colors duration-150"
          data-testid={`${testId}-edit-button`}
        >
          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {t('actions.edit')}
        </button>
      )}
      {onToggleCured && (
        <button
          onClick={() => {
            const newStatus = illness.status === 'curada' ? 'activa' : 'curada';
            onToggleCured(illness.id, newStatus);
          }}
          className={`inline-flex items-center text-xs font-medium transition-colors duration-150 ${
            illness.status === 'curada'
              ? 'text-blue-600 hover:text-blue-700'
              : 'text-green-600 hover:text-green-700'
          }`}
          data-testid={`${testId}-toggle-button`}
        >
          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {illness.status === 'curada' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            )}
          </svg>
          {illness.status === 'curada' ? t('actions.active') : t('actions.cured')}
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => onDelete(illness.id)}
          className="inline-flex items-center text-xs font-medium text-red-600 hover:text-red-700 transition-colors duration-150"
          data-testid={`${testId}-delete-button`}
        >
          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {t('actions.delete')}
        </button>
      )}
    </div>
  );
};