'use client';
/**
 * Login Form organism component
 * Complete login form with validation, error handling, and API integration
 */
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginCredentialsForm } from '../molecules/LoginCredentialsForm';
import { LoginOptionsForm } from '../molecules/LoginOptionsForm';
import { LoginButton } from '../atoms/LoginButton';
import { LoginLegalText } from '../atoms/LoginLegalText';
import { LoginForm as LoginFormType, LoginErrorResponse, FieldValidationState } from '../../types';
import { authApiClient } from '../../services/authApiClient';

interface LoginFormProps {
  onSuccess?: (redirectUrl?: string) => void;
  onError?: (error: string) => void;
  'data-testid'?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onError,
  'data-testid': testId
}) => {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<LoginFormType>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [emailValidation, setEmailValidation] = useState<FieldValidationState>({
    isValidating: false,
    isValid: null,
    error: null
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Validation helpers
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Event handlers
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, email: value }));
    setGeneralError(null);

    // Real-time email validation
    if (value.length > 0) {
      setEmailValidation({
        isValidating: false,
        isValid: validateEmail(value),
        error: validateEmail(value) ? null : 'Ingresa un email válido'
      });
    } else {
      setEmailValidation({
        isValidating: false,
        isValid: null,
        error: null
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, password: value }));
    setPasswordError(null);
    setGeneralError(null);
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, rememberMe: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setGeneralError(null);
    setPasswordError(null);

    // Validate form
    if (!formData.email || !formData.password) {
      setGeneralError('Por favor completa todos los campos');
      return;
    }

    if (!validateEmail(formData.email)) {
      setEmailValidation(prev => ({
        ...prev,
        isValid: false,
        error: 'Ingresa un email válido'
      }));
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApiClient.login(formData);

      // Successful login - Add comprehensive debugging checkpoints
      console.log('🔍 LOGIN SUCCESS CHECKPOINT 1: API Response received', {
        hasOnSuccess: !!onSuccess,
        redirectUrl: response.redirectUrl,
        fullResponse: response
      });

      if (onSuccess) {
        console.log('🔍 LOGIN SUCCESS CHECKPOINT 2: Using onSuccess callback');
        onSuccess(response.redirectUrl);
      } else {
        // Default redirect behavior
        const redirectUrl = response.redirectUrl || '/dashboard';
        console.log('🔍 LOGIN SUCCESS CHECKPOINT 3: Using router.push', {
          redirectUrl,
          routerType: typeof router,
          routerMethods: Object.getOwnPropertyNames(router)
        });

        try {
          // Add a delay to ensure localStorage is available and stable
          console.log('🔍 LOGIN SUCCESS CHECKPOINT 3.5: Adding delay to ensure localStorage stability');
          await new Promise(resolve => setTimeout(resolve, 250));

          await router.push(redirectUrl);
          console.log('🔍 LOGIN SUCCESS CHECKPOINT 4: router.push completed successfully');
        } catch (routerError) {
          console.error('🔍 LOGIN SUCCESS CHECKPOINT 4 ERROR: router.push failed', {
            error: routerError,
            redirectUrl
          });
          // Fallback: Try window.location
          console.log('🔍 LOGIN SUCCESS CHECKPOINT 5: Attempting window.location fallback');
          window.location.href = redirectUrl;
        }
      }

    } catch (error) {
      console.error('Login error:', error);

      // Handle login error responses
      if (error && typeof error === 'object' && 'success' in error) {
        const loginError = error as LoginErrorResponse;

        if (loginError.attemptsRemaining !== undefined && loginError.attemptsRemaining !== null) {
          setGeneralError(
            `${loginError.message}. Intentos restantes: ${loginError.attemptsRemaining}`
          );
        } else if (loginError.retryAfter) {
          const minutes = Math.ceil(loginError.retryAfter / 60);
          setGeneralError(
            `${loginError.message} Intenta en ${minutes} minutos.`
          );
        } else {
          setGeneralError(loginError.message);
        }
      } else if (error instanceof Error) {
        setGeneralError(error.message);
      } else {
        setGeneralError('Error de conexión. Verifica tu internet.');
      }

      if (onError && error instanceof Error) {
        onError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto" data-testid={testId}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo */}
        <div className="text-center mb-6">
          <img
            src="/assets/images/logos/logos-blue-light-background.png"
            alt="VitalGo Logo"
            className="mx-auto h-12 object-contain"
          />
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Iniciar sesión
          </h2>
          <p className="text-sm text-gray-600">
            Accede a tu cuenta de VitalGo
          </p>
        </div>

        {/* General error message */}
        {generalError && (
          <div
            className="bg-red-50 border border-red-200 rounded-lg p-4"
            data-testid="login-error-message"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{generalError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Credentials Form */}
        <LoginCredentialsForm
          email={formData.email}
          password={formData.password}
          onEmailChange={handleEmailChange}
          onPasswordChange={handlePasswordChange}
          emailValidation={emailValidation}
          passwordError={passwordError || undefined}
          disabled={isLoading}
          data-testid="login-credentials-form"
        />

        {/* Options Form */}
        <LoginOptionsForm
          rememberMe={formData.rememberMe}
          onRememberMeChange={handleRememberMeChange}
          disabled={isLoading}
          data-testid="login-options-form"
        />

        {/* Submit Button */}
        <LoginButton
          loading={isLoading}
          disabled={isLoading || !formData.email || !formData.password}
          data-testid="login-submit-button"
        />

        {/* Sign up link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <a
              href="/signup/paciente"
              className="text-vitalgo-green hover:text-vitalgo-green/80 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-vitalgo-green/20 rounded-sm"
            >
              Regístrate aquí
            </a>
          </p>
        </div>

        {/* Legal acceptance text */}
        <LoginLegalText data-testid="login-legal-text" />
      </form>
    </div>
  );
};