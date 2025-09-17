/**
 * Submit Button atom component
 */
import React from 'react';

interface SubmitButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  'data-testid'?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  disabled = false,
  loading = false,
  'data-testid': testId
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        disabled || loading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
      }`}
      data-testid={testId}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Procesando...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};