/**
 * Date Input atom component for birth date
 */
import React from 'react';

interface DateInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  autocomplete?: string;
  'data-testid'?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  required = false,
  error,
  autocomplete,
  'data-testid': testId
}) => {
  // Calculate max date (18 years ago) and min date (120 years ago)
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        id={id}
        name={name}
        type="date"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        min={formatDate(minDate)}
        max={formatDate(maxDate)}
        autoComplete={autocomplete}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
          error
            ? 'border-red-300 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500'
        }`}
        data-testid={testId}
        required={required}
      />

      {error && (
        <p className="text-sm text-red-600" data-testid={`${testId}-error`}>
          {error}
        </p>
      )}

      <p className="text-xs text-gray-500">
        Debe ser mayor de 18 años para registrarse
      </p>
    </div>
  );
};