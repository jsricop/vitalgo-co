/**
 * Login Page Route - /login
 * Next.js App Router page for user authentication
 */
import { Metadata } from 'next';
import { LoginPage, loginPageMetadata } from '../../slices/auth/components/pages/LoginPage';

// SEO Metadata
export const metadata: Metadata = loginPageMetadata;

export default function Login() {
  return <LoginPage />;
}