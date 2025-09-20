/**
 * Forgot Password Link atom component
 * Link component for password recovery with VitalGo styling
 */
import React from 'react';
import Link from 'next/link';

interface ForgotPasswordLinkProps {
  disabled?: boolean;
  'data-testid'?: string;
}

export const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({
  disabled = false,
  'data-testid': testId
}) => {
  if (disabled) {
    return (
      <span
        className="text-sm text-gray-400 cursor-not-allowed"
        data-testid={testId}
      >
        ¿Olvidaste tu contraseña?
      </span>
    );
  }

  return (
    <Link
      href="/forgot-password"
      className="text-sm text-vitalgo-green hover:text-vitalgo-green/80 transition-colors focus:outline-none focus:ring-2 focus:ring-vitalgo-green/20 rounded-sm"
      data-testid={testId}
    >
      ¿Olvidaste tu contraseña?
    </Link>
  );
};