/**
 * MedicalInformationTab Organism Component
 * Empty state for medical information (future development)
 */
import { TabContentProps } from '../../types';

export function MedicalInformationTab({ 'data-testid': testId }: TabContentProps) {
  return (
    <div className="bg-white rounded-b-xl border border-gray-200 p-6 mt-0 min-h-[400px]" data-testid={testId}>
      <div className="flex items-center justify-center h-full min-h-[350px]">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-vitalgo-green bg-opacity-10 rounded-full flex items-center justify-center mb-6">
            <svg className="h-10 w-10 text-vitalgo-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Información Médica
          </h3>
          <p className="text-gray-600 mb-4 max-w-md">
            En esta sección podrás gestionar tu información médica general, antecedentes familiares, signos vitales y otros datos relevantes para tu atención médica.
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