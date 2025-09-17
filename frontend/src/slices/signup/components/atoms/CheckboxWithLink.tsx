/**
 * Checkbox with Link atom component for legal acceptances
 */
import React from 'react';

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
  'data-testid': testId
}) => {
  return (
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
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
          data-testid={`${testId}-link`}
        >
          {linkText}
        </a>
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    </div>
  );
};