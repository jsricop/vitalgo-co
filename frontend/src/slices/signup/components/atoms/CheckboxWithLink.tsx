'use client';
/**
 * Checkbox with Link atom component for legal acceptances
 */
import React, { useState } from 'react';
import { LegalModal, LegalDocumentType } from '../../../legal/components/molecules/LegalModal';

interface CheckboxWithLinkProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  text: string;
  linkText: string;
  linkUrl: string;
  required?: boolean;
  'data-testid'?: string;
  enableAcceptButton?: boolean;
}

export const CheckboxWithLink: React.FC<CheckboxWithLinkProps> = ({
  id,
  name,
  checked,
  onChange,
  text,
  linkText,
  linkUrl,
  required = false,
  'data-testid': testId,
  enableAcceptButton = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determine document type based on URL
  const getDocumentType = (): LegalDocumentType => {
    if (linkUrl.includes('terminos') || linkUrl.includes('terms')) {
      return 'terms';
    }
    if (linkUrl.includes('privacidad') || linkUrl.includes('privacy')) {
      return 'privacy';
    }
    return 'terms'; // default
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleAccept = () => {
    // Create a synthetic event to trigger the onChange handler
    const syntheticEvent = {
      target: {
        checked: true,
        name,
        type: 'checkbox',
        value: 'on'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex items-start space-x-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          data-testid={testId}
          required={required}
        />

        <label htmlFor={id} className="text-sm text-gray-700 leading-5">
          {text}{' '}
          <button
            type="button"
            onClick={handleLinkClick}
            className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            data-testid={`${testId}-link`}
          >
            {linkText}
          </button>
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      <LegalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        documentType={getDocumentType()}
        data-testid={`${testId}-modal`}
        onAccept={enableAcceptButton ? handleAccept : undefined}
      />
    </>
  );
};