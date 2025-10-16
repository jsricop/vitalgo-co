/**
 * Login Email Input atom component
 * Specialized email input for authentication with validation
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import { FieldValidationState } from '../../../signup/types';

interface LoginEmailInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  validation?: FieldValidationState;
  disabled?: boolean;
  'data-testid'?: string;
}

export const LoginEmailInput: React.FC<LoginEmailInputProps> = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  validation,
  disabled = false,
  'data-testid': testId
}) => {
  const t = useTranslations('auth');

  const getInputClasses = () => {
    let classes = "w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white";

    if (disabled) {
      classes += " bg-gray-50 cursor-not-allowed";
    } else if (validation?.isValidating) {
      classes += " border-blue-300 focus:ring-blue-500";
    } else if (validation?.isValid === true) {
      classes += " border-vitalgo-green focus:ring-vitalgo-green/20";
    } else if (validation?.isValid === false) {
      classes += " border-red-300 focus:ring-red-500";
    } else {
      classes += " border-gray-300 focus:ring-vitalgo-green/20 focus:border-vitalgo-green";
    }

    return classes;
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {t('email')}
        <span className="text-red-500 ml-1">*</span>
      </label>

      <div className="relative">
        <input
          id={id}
          name={name}
          type="email"
          placeholder={t('emailPlaceholder')}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={getInputClasses()}
          data-testid={testId}
          required
          autoComplete="email"
        />

        {/* Email icon */}
        <div className="absolute left-4 top-3.5 pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        </div>

        {/* Validation icons */}
        {validation?.isValidating && (
          <div className="absolute right-3 top-3.5">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}

        {validation?.isValid === true && (
          <div className="absolute right-3 top-3.5">
            <svg className="h-4 w-4 text-vitalgo-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {validation?.isValid === false && (
          <div className="absolute right-3 top-3.5">
            <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Error message */}
      {validation?.error && (
        <p className="text-sm text-red-600" data-testid={`${testId}-error`}>
          {validation.error}
        </p>
      )}

      {/* Success message */}
      {validation?.isValid === true && !validation.error && (
        <p className="text-sm text-vitalgo-green">
          {t('emailValid')}
        </p>
      )}
    </div>
  );
};