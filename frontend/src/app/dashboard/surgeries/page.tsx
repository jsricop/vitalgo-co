/**
 * Surgeries Route - /dashboard/surgeries
 * Next.js App Router page for surgeries management
 */
import { Metadata } from 'next';
import { SurgeriesPage } from '../../../slices/dashboard/components/pages/SurgeriesPage';

export const metadata: Metadata = {
  title: 'Cirugías | VitalGo',
  description: 'Mantén un registro completo de todas tus cirugías y procedimientos médicos.',
  keywords: ['cirugías', 'procedimientos médicos', 'historial quirúrgico', 'intervenciones'],
  robots: 'noindex, nofollow',
};

export default function Surgeries() {
  return <SurgeriesPage />;
}