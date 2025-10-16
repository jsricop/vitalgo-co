/**
 * Allergies Route - /dashboard/allergies
 * Next.js App Router page for allergies management
 */
import { Metadata } from 'next';
import { AllergiesPage } from '@/slices/dashboard/components/pages/AllergiesPage';

export const metadata: Metadata = {
  title: 'Alergias | VitalGo',
  description: 'Registra y gestiona tus alergias conocidas para mantener un historial médico completo.',
  keywords: ['alergias', 'reacciones alérgicas', 'historial médico', 'salud'],
  robots: 'noindex, nofollow',
};

export default function Allergies() {
  return <AllergiesPage />;
}