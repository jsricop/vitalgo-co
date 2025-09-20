'use client';
/**
 * Login Password Input atom component
 * Specialized password input for authentication without strength indicator
 */
import React, { useState } from 'react';

interface LoginPasswordInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  'data-testid'?: string;
}

export const LoginPasswordInput: React.FC<LoginPasswordInputProps> = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  disabled = false,
  error,
  'data-testid': testId
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const getInputClasses = () => {
    let classes = "w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white";

    if (disabled) {
      classes += " bg-gray-50 cursor-not-allowed";
    } else if (error) {
      classes += " border-red-300 focus:ring-red-500";
    } else {
      classes += " border-gray-300 focus:ring-vitalgo-green/20 focus:border-vitalgo-green";
    }

    return classes;
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        Contraseña
        <span className="text-red-500 ml-1">*</span>
      </label>

      <div className="relative">
        {/* Password lock icon */}
        <div className="absolute left-3 top-3.5 pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          placeholder="Ingresa tu contraseña"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={getInputClasses()}
          data-testid={testId}
          required
          autoComplete="current-password"
        />

        {/* Show/hide password toggle */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
          data-testid={`${testId}-toggle`}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {showPassword ? (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600" data-testid={`${testId}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};