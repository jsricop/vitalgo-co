/**
 * RadioButtonField Atom Component
 * Reusable radio button group with support for "Otro" option
 */
import React from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioButtonFieldProps {
  label: string;
  name: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  otherOption?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
  layout?: 'vertical' | 'columns';
  'data-testid'?: string;
}

export function RadioButtonField({
  label,
  name,
  value,
  options,
  onChange,
  error,
  required = false,
  otherOption = false,
  otherValue = '',
  onOtherChange,
  layout = 'vertical',
  'data-testid': testId
}: RadioButtonFieldProps) {
  const isOtherSelected = value === 'OTRO';

  return (
    <fieldset className="w-full" data-testid={testId}>
      <legend className="text-sm font-medium text-vitalgo-dark mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </legend>

      <div className={layout === 'columns' ? 'grid grid-cols-2 gap-4 md:grid-cols-3' : 'space-y-3'}>
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center cursor-pointer group"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-vitalgo-green border-gray-300 focus:ring-vitalgo-green focus:ring-2"
              aria-describedby={error ? `${name}-error` : undefined}
            />
            <span className="ml-3 text-sm text-vitalgo-dark group-hover:text-vitalgo-green transition-colors">
              {option.label}
            </span>
          </label>
        ))}
      </div>

      {/* "Otro" Text Field */}
      {otherOption && isOtherSelected && onOtherChange && (
        <div className="mt-3 ml-7">
          <input
            type="text"
            value={otherValue}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder="Especifica..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vitalgo-green focus:border-vitalgo-green text-sm"
            aria-label={`Especifica ${label.toLowerCase()}`}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p
          id={`${name}-error`}
          className="mt-2 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </fieldset>
  );
}