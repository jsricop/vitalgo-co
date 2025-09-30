/**
 * EmergencyContactSection Molecule Component
 * Displays emergency contact information
 */
import React from 'react';
import { PersonalPatientInfo } from '../../types/personalInfo';
import { getEmergencyContactRelationshipByValue, formatPhoneNumber } from '../../data/medicalData';

interface EmergencyContactSectionProps {
  personalInfo: PersonalPatientInfo | null;
}

export function EmergencyContactSection({ personalInfo }: EmergencyContactSectionProps) {
  const formatRelationshipDisplay = (relationship?: string) => {
    if (!relationship) return 'No especificado';
    const relationshipOption = getEmergencyContactRelationshipByValue(relationship);
    return relationshipOption?.label || relationship;
  };

  const hasEmergencyContact = personalInfo?.emergency_contact_name ||
                             personalInfo?.emergency_contact_phone;

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-150 mt-4">
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
          <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h4 className="text-sm font-semibold text-vitalgo-dark ml-2">Contacto de Emergencia</h4>
      </div>

      {hasEmergencyContact ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name and Relationship */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-vitalgo-dark-lighter">Nombre Completo</span>
              <span className="text-sm font-medium text-vitalgo-dark">
                {personalInfo?.emergency_contact_name || 'No especificado'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-vitalgo-dark-lighter">Parentesco</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {formatRelationshipDisplay(personalInfo?.emergency_contact_relationship)}
              </span>
            </div>
          </div>

          {/* Phones */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-vitalgo-dark-lighter">Teléfono Principal</span>
              <div className="flex items-center text-sm font-medium text-vitalgo-dark font-mono">
                <svg className="h-3 w-3 text-vitalgo-dark-lighter mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {personalInfo?.emergency_contact_phone ?
                  formatPhoneNumber(personalInfo.emergency_contact_phone) :
                  'No especificado'
                }
              </div>
            </div>

            {personalInfo?.emergency_contact_phone_alt && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-vitalgo-dark-lighter">Teléfono Alternativo</span>
                <div className="flex items-center text-sm font-medium text-vitalgo-dark font-mono">
                  <svg className="h-3 w-3 text-vitalgo-dark-lighter mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {formatPhoneNumber(personalInfo.emergency_contact_phone_alt)}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-vitalgo-dark">Sin contacto de emergencia</h3>
          <p className="text-xs text-vitalgo-dark-lighter mt-1">
            No hay información de contacto de emergencia configurada.
          </p>
        </div>
      )}
    </div>
  );
}