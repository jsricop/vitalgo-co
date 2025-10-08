/**
 * Dashboard Route - /dashboard
 * Next.js App Router page for authenticated patient dashboard
 */
import { Metadata } from 'next';
import { DashboardPage } from '../../slices/dashboard/components/pages/DashboardPage';

// SEO Metadata for the dashboard page
export const metadata: Metadata = {
  title: 'Panel de Control Médico | VitalGo',
  description: 'Gestiona tu información médica de forma segura. Accede a tus medicamentos, alergias, cirugías y historial médico.',
  keywords: ['panel de control médico', 'expediente digital', 'información médica', 'medicamentos', 'alergias'],
  robots: 'noindex, nofollow', // Private page, should not be indexed
};

export default function Dashboard() {
  return <DashboardPage />;
}