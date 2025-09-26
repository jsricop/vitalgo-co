/**
 * PersonalInformationTab Organism Component
 * Empty state for personal information (future development)
 */
import { TabContentProps } from '../../types';

export function PersonalInformationTab({ 'data-testid': testId }: TabContentProps) {
  return (
    <div className="bg-white rounded-b-xl border border-gray-200 p-6 mt-0 min-h-[400px]" data-testid={testId}>
      <div className="flex items-center justify-center h-full min-h-[350px]">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-vitalgo-green bg-opacity-10 rounded-full flex items-center justify-center mb-6">
            <svg className="h-10 w-10 text-vitalgo-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Información Personal
          </h3>
          <p className="text-gray-600 mb-4 max-w-md">
            Esta sección se desarrollará próximamente para gestionar información personal adicional como dirección, contactos de emergencia y preferencias.
          </p>
          <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-vitalgo-green bg-vitalgo-green bg-opacity-10 rounded-lg">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            En desarrollo
          </div>
        </div>
      </div>
    </div>
  );
}