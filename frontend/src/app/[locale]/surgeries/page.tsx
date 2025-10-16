/**
 * Surgeries Route - /surgeries
 * Next.js App Router page for standalone surgeries management
 */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cirugías | VitalGo',
  description: 'Gestiona todas tus cirugías de forma segura. Mantén un registro completo de procedimientos quirúrgicos.',
  keywords: ['cirugías', 'procedimientos', 'operaciones', 'historial médico', 'quirófano'],
  robots: 'noindex, nofollow',
};

// Following DEV_CONTEXT.md App Router pattern: export from surgeries slice
export { default } from '@/slices/surgeries/pages/SurgeriesPage';