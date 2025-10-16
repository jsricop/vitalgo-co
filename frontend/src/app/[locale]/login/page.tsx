/**
 * Login Page Route - /login
 * Next.js App Router page for user authentication
 */
import { Metadata } from 'next';
import { LoginPage } from '@/slices/auth/components/pages/LoginPage';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Iniciar Sesión | VitalGo',
  description: 'Accede a tu cuenta de VitalGo para gestionar tu información médica de forma segura.',
  keywords: 'VitalGo, login, iniciar sesión, acceso, cuenta médica',
  robots: 'noindex, nofollow', // Don't index login pages
};

export default function Login() {
  return <LoginPage />;
}