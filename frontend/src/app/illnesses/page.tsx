/**
 * Illnesses Route - /illnesses
 * Next.js App Router page for standalone illnesses management
 */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enfermedades | VitalGo',
  description: 'Gestiona todas tus enfermedades y condiciones médicas. Mantén un registro completo de diagnósticos, tratamientos y seguimiento médico.',
  keywords: ['enfermedades', 'diagnóstico', 'condiciones médicas', 'tratamiento', 'historial médico', 'salud'],
  robots: 'noindex, nofollow',
};

// Following DEV_CONTEXT.md App Router pattern: export from illnesses slice
export { default } from '../../slices/illnesses/pages/IllnessesPage';