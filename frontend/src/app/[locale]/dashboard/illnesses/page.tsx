/**
 * Illnesses Route - /dashboard/illnesses
 * Next.js App Router page for illnesses management
 */
import { Metadata } from 'next';
import { IllnessesPage } from '@/slices/dashboard/components/pages/IllnessesPage';

export const metadata: Metadata = {
  title: 'Enfermedades | VitalGo',
  description: 'Registra enfermedades diagnosticadas para mantener un historial médico completo.',
  keywords: ['enfermedades', 'diagnósticos', 'historial médico', 'patologías'],
  robots: 'noindex, nofollow',
};

export default function Illnesses() {
  return <IllnessesPage />;
}