/**
 * Profile Route - /profile
 * Next.js App Router page for authenticated patient profile
 */
import { Metadata } from 'next';
import { ProfilePage } from '../../slices/profile/pages/ProfilePage';

// SEO Metadata for the profile page
export const metadata: Metadata = {
  title: 'Mi Perfil | VitalGo',
  description: 'Gestiona tu información personal y médica. Accede a tus datos de contacto, información médica y configuración de cuenta.',
  keywords: ['perfil médico', 'datos personales', 'información médica', 'configuración cuenta'],
  robots: 'noindex, nofollow', // Private page, should not be indexed
};

export default function Profile() {
  return <ProfilePage />;
}