/**
 * Emergency Info Card Components
 * Display patient emergency information for paramedic access
 */
'use client';

import React from 'react';
import type {
  EmergencyData,
  EmergencyMedication,
  EmergencyAllergy,
  EmergencySurgery,
  EmergencyIllness,
} from '../../types';

interface InfoCardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  variant?: 'default' | 'critical';
}

const InfoCard: React.FC<InfoCardProps> = ({ title, icon, children, variant = 'default' }) => {
  const borderColor = variant === 'critical' ? 'border-l-red-500' : 'border-l-vitalgo-green';

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 ${borderColor} overflow-hidden`}>
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-vitalgo-dark flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          {title}
        </h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

interface InfoRowProps {
  label: string;
  value?: string | number | null;
  critical?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, critical }) => {
  if (!value) return null;

  return (
    <div className="flex py-3 border-b border-gray-50 last:border-0">
      <span className="font-medium text-gray-600 w-1/3">{label}:</span>
      <span className={`text-gray-900 w-2/3 ${critical ? 'text-red-600 font-bold' : 'font-medium'}`}>
        {value}
      </span>
    </div>
  );
};

export const BasicInfoCard: React.FC<{ data: EmergencyData }> = ({ data }) => {
  const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getBiologicalSexLabel = (sex?: string): string | undefined => {
    if (!sex) return undefined;
    const sexMap: { [key: string]: string } = {
      'F': 'Femenino',
      'M': 'Masculino',
      'I': 'Intersexual'
    };
    return sexMap[sex] || sex;
  };

  const getGenderLabel = (gender?: string): string | undefined => {
    if (!gender) return undefined;
    const genderMap: { [key: string]: string } = {
      'MASCULINO': 'Masculino',
      'FEMENINO': 'Femenino',
      'NO_BINARIO': 'No binario',
      'PREFIERO_NO_DECIR': 'Prefiero no decir',
      'OTRO': 'Otro'
    };
    return genderMap[gender] || gender;
  };

  return (
    <InfoCard title="Información Básica" icon="👤">
      <InfoRow label="Nombre Completo" value={data.fullName} />
      <InfoRow label="Tipo de Documento" value={data.documentType} />
      <InfoRow label="Número de Documento" value={data.documentNumber} />
      <InfoRow label="Fecha de Nacimiento" value={data.birthDate} />
      <InfoRow label="Edad" value={`${calculateAge(data.birthDate)} años`} />
      <InfoRow label="Sexo Biológico" value={getBiologicalSexLabel(data.biologicalSex)} />
      <InfoRow label="Género" value={getGenderLabel(data.gender)} />
    </InfoCard>
  );
};

export const PersonalInfoCard: React.FC<{ data: EmergencyData }> = ({ data }) => {
  return (
    <InfoCard title="Información Personal" icon="📋">
      <InfoRow label="Tipo de Sangre" value={data.bloodType} critical={true} />
      <InfoRow label="EPS" value={data.eps} />
      <InfoRow label="Ocupación" value={data.occupation} />
      <InfoRow label="Dirección" value={data.residenceAddress} />
      <InfoRow label="Ciudad" value={data.residenceCity} />
      <InfoRow label="País" value={data.residenceCountry} />

      {(data.emergencyContactName || data.emergencyContactPhone) && (
        <>
          <div className="mt-4 pt-4 border-t border-vitalgo-green/20">
            <h3 className="font-bold text-vitalgo-dark mb-3 flex items-center gap-2">
              <span className="text-xl">📞</span>
              Contacto de Emergencia
            </h3>
          </div>
          <InfoRow label="Nombre" value={data.emergencyContactName} />
          <InfoRow label="Relación" value={data.emergencyContactRelationship} />
          <InfoRow label="Teléfono" value={data.emergencyContactPhone} critical={true} />
          <InfoRow label="Teléfono Alternativo" value={data.emergencyContactPhoneAlt} />
        </>
      )}
    </InfoCard>
  );
};

export const MedicalInfoCard: React.FC<{ data: EmergencyData }> = ({ data }) => {
  const hasMedicalData =
    data.medications.length > 0 ||
    data.allergies.length > 0 ||
    data.surgeries.length > 0 ||
    data.illnesses.length > 0;

  return (
    <InfoCard title="Información Médica" icon="🏥" variant="critical">
      {/* Allergies - Most Critical */}
      {data.allergies.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-red-600 text-lg mb-4 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            ALERGIAS
          </h3>
          {data.allergies.map((allergy, index) => (
            <div key={index} className="mb-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              <p className="font-bold text-red-700 text-lg mb-2">{allergy.allergen}</p>
              <div className="space-y-1">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Severidad:</span> {allergy.severityLevel}
                </p>
                {allergy.reactionDescription && (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Reacción:</span> {allergy.reactionDescription}
                  </p>
                )}
                {allergy.notes && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Notas:</span> {allergy.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Medications */}
      {data.medications.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-vitalgo-dark text-lg mb-4 flex items-center gap-2">
            <span className="text-2xl">💊</span>
            Medicamentos Activos
          </h3>
          {data.medications.map((med, index) => (
            <div key={index} className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
              <p className="font-bold text-vitalgo-dark text-base mb-2">{med.medicationName}</p>
              <div className="space-y-1">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Dosis:</span> {med.dosage}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Frecuencia:</span> {med.frequency}
                </p>
                {med.prescribedBy && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Prescrito por:</span> {med.prescribedBy}
                  </p>
                )}
                {med.notes && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Notas:</span> {med.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chronic Illnesses */}
      {data.illnesses.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-vitalgo-dark text-lg mb-4 flex items-center gap-2">
            <span className="text-2xl">🩺</span>
            Enfermedades
          </h3>
          {data.illnesses.map((illness, index) => (
            <div key={index} className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
              <p className="font-bold text-vitalgo-dark text-base mb-2">
                {illness.illnessName}
                {illness.isChronic && <span className="text-xs ml-2 px-2 py-1 bg-red-100 text-red-600 rounded-full">(CRÓNICA)</span>}
              </p>
              <div className="space-y-1">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Estado:</span> {illness.status}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Fecha de diagnóstico:</span> {illness.diagnosisDate}
                </p>
                {illness.cie10Code && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Código CIE-10:</span> {illness.cie10Code}
                  </p>
                )}
                {illness.treatmentDescription && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Tratamiento:</span> {illness.treatmentDescription}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Surgeries */}
      {data.surgeries.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-vitalgo-dark text-lg mb-4 flex items-center gap-2">
            <span className="text-2xl">🔪</span>
            Cirugías
          </h3>
          {data.surgeries.map((surgery, index) => (
            <div key={index} className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
              <p className="font-bold text-vitalgo-dark text-base mb-2">{surgery.procedureName}</p>
              <div className="space-y-1">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Fecha:</span> {surgery.surgeryDate}
                </p>
                {surgery.hospitalName && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Hospital:</span> {surgery.hospitalName}
                  </p>
                )}
                {surgery.complications && (
                  <p className="text-sm text-red-600 mt-1">
                    <span className="font-semibold">Complicaciones:</span> {surgery.complications}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!hasMedicalData && (
        <p className="text-gray-500 text-center py-8">No hay información médica registrada</p>
      )}
    </InfoCard>
  );
};

export const GynecologicalInfoCard: React.FC<{ data: EmergencyData }> = ({ data }) => {
  // Only render if patient is female
  if (data.biologicalSex !== 'F') {
    return null;
  }

  const hasGynecologicalData =
    data.isPregnant !== null &&
    data.isPregnant !== undefined ||
    data.pregnancyWeeks ||
    data.lastMenstruationDate ||
    data.pregnanciesCount !== null &&
    data.pregnanciesCount !== undefined ||
    data.contraceptiveMethod;

  if (!hasGynecologicalData) {
    return null;
  }

  return (
    <InfoCard title="Información Ginecológica" icon="🤰" variant={data.isPregnant ? 'critical' : 'default'}>
      {data.isPregnant && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
          <p className="font-bold text-red-700 text-lg flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            EMBARAZADA
          </p>
          {data.pregnancyWeeks && (
            <p className="text-sm text-gray-700 mt-2">
              <span className="font-semibold">Semanas de gestación:</span> {data.pregnancyWeeks}
            </p>
          )}
        </div>
      )}

      <InfoRow label="Fecha de Última Menstruación" value={data.lastMenstruationDate} />
      <InfoRow label="Embarazos Previos" value={data.pregnanciesCount} />
      <InfoRow label="Partos" value={data.birthsCount} />
      <InfoRow label="Cesáreas" value={data.cesareansCount} />
      <InfoRow label="Abortos" value={data.abortionsCount} />
      <InfoRow label="Método Anticonceptivo" value={data.contraceptiveMethod} />
    </InfoCard>
  );
};
