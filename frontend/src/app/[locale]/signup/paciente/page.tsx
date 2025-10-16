/**
 * Next.js App Router page for /signup/paciente
 */
import PatientSignupPage from '@/slices/signup/components/pages/PatientSignupPage';

export default function Page() {
  return <PatientSignupPage />;
}

export const metadata = {
  title: 'Registro de Paciente | VitalGo',
  description: 'Crea tu cuenta como paciente en VitalGo para acceder a tus expedientes médicos digitales',
};