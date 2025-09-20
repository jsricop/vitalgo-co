/**
 * Remember Me Checkbox atom component
 * Checkbox for login persistence with VitalGo styling
 */
import React from 'react';

interface RememberMeCheckboxProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  'data-testid'?: string;
}

export const RememberMeCheckbox: React.FC<RememberMeCheckboxProps> = ({
  id,
  name,
  checked,
  onChange,
  disabled = false,
  'data-testid': testId
}) => {
  return (
    <div className="flex items-center">
      <div className="relative">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="h-4 w-4 text-vitalgo-green border-gray-300 rounded focus:ring-vitalgo-green/20 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
          data-testid={testId}
        />

        {/* Custom checkmark for better cross-browser consistency */}
        {checked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      <label
        htmlFor={id}
        className={`ml-2 text-sm text-gray-700 select-none ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        Mantener sesión iniciada
      </label>
    </div>
  );
};