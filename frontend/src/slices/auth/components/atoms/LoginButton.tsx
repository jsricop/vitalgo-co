/**
 * Login Button atom component
 * Specialized submit button for login with VitalGo branding
 */
import React from 'react';

interface LoginButtonProps {
  disabled?: boolean;
  loading?: boolean;
  'data-testid'?: string;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  disabled = false,
  loading = false,
  'data-testid': testId
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isDisabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-vitalgo-green hover:bg-vitalgo-green/90 focus:ring-vitalgo-green/20 shadow-sm hover:shadow-md'
      }`}
      data-testid={testId}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          <span>Iniciando sesión...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center space-x-2">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          <span>Iniciar sesión</span>
        </div>
      )}
    </button>
  );
};