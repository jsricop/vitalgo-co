/**
 * Medications Route - /medications
 * Next.js App Router page for standalone medications management
 */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Medicamentos | VitalGo',
  description: 'Gestiona todos tus medicamentos de forma segura. Mantén un registro completo de medicamentos activos e inactivos.',
  keywords: ['medicamentos', 'farmacia', 'dosificación', 'tratamiento médico', 'historial médico'],
  robots: 'noindex, nofollow',
};

// Following DEV_CONTEXT.md App Router pattern: export from medications slice
export { default } from '@/slices/medications/pages/MedicationsPage';