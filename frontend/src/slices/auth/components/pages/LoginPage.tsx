/**
 * Login Page template component
 * Complete login page with minimal layout and VitalGo branding
 */
import React from 'react';
import { Metadata } from 'next';
import { MinimalNavbar } from '../../../../shared/components/organisms/MinimalNavbar';
import { MinimalFooter } from '../../../../shared/components/organisms/MinimalFooter';
import { LoginForm } from '../organisms/LoginForm';

interface LoginPageProps {
  onSuccess?: (redirectUrl?: string) => void;
  onError?: (error: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onError
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Minimal Navigation */}
      <MinimalNavbar
        backText="Volver al inicio"
        backUrl="/"
        showLogo={true}
      />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Login Form */}
          <div className="bg-white shadow-lg rounded-lg px-8 py-10">
            <LoginForm
              onSuccess={onSuccess}
              onError={onError}
              data-testid="login-page-form"
            />
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <MinimalFooter />
    </div>
  );
};

// Metadata for SEO (for use in page.tsx)
export const loginPageMetadata: Metadata = {
  title: 'Iniciar Sesión | VitalGo',
  description: 'Accede a tu cuenta de VitalGo para gestionar tu información médica de forma segura.',
  keywords: 'VitalGo, login, iniciar sesión, acceso, cuenta médica',
  robots: 'noindex, nofollow', // Don't index login pages
};