/**
 * Medications Route - /dashboard/medications
 * Next.js App Router page for medications management
 */
import { Metadata } from 'next';
import { MedicationsPage } from '../../../slices/dashboard/components/pages/MedicationsPage';

export const metadata: Metadata = {
  title: 'Medicamentos | VitalGo',
  description: 'Gestiona tus medicamentos de forma segura. Mantén un registro actualizado de todos tus medicamentos activos.',
  keywords: ['medicamentos', 'farmacia', 'dosificación', 'tratamiento médico'],
  robots: 'noindex, nofollow',
};

export default function Medications() {
  return <MedicationsPage />;
}