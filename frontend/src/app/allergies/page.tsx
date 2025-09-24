/**
 * Allergies Route - /allergies
 * Next.js App Router page for standalone allergies management
 */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alergias | VitalGo',
  description: 'Gestiona todas tus alergias de forma segura. Mantén un registro completo de alergias por nivel de severidad.',
  keywords: ['alergias', 'reacciones alérgicas', 'severidad', 'historial médico', 'alérgenos'],
  robots: 'noindex, nofollow',
};

// Following DEV_CONTEXT.md App Router pattern: export from allergies slice
export { default } from '../../slices/allergies/pages/AllergiesPage';