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
  const borderColor = variant === 'critical' ? 'border-red-500' : 'border-gray-300';
  const headerBg = variant === 'critical' ? 'bg-red-50' : 'bg-gray-50';

  return (
    <div className={`bg-white rounded-lg shadow-md border-2 ${borderColor} overflow-hidden`}>
      <div className={`${headerBg} px-6 py-4 border-b border-gray-200`}>
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {icon && <span>{icon}</span>}
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
    <div className="flex py-2 border-b border-gray-100 last:border-0">
      <span className="font-semibold text-gray-700 w-1/3">{label}:</span>
      <span className={`text-gray-900 w-2/3 ${critical ? 'text-red-600 font-bold' : ''}`}>
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

  return (
    <InfoCard title="Información Básica" icon="👤">
      <InfoRow label="Nombre Completo" value={data.fullName} />
      <InfoRow label="Tipo de Documento" value={data.documentType} />
      <InfoRow label="Número de Documento" value={data.documentNumber} />
      <InfoRow label="Fecha de Nacimiento" value={data.birthDate} />
      <InfoRow label="Edad" value={`${calculateAge(data.birthDate)} años`} />
      <InfoRow label="Sexo Biológico" value={data.biologicalSex} />
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
          <div className="mt-4 pt-4 border-t-2 border-gray-200">
            <h3 className="font-bold text-gray-800 mb-2">Contacto de Emergencia</h3>
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
          <h3 className="font-bold text-red-600 text-lg mb-3 flex items-center gap-2">
            ⚠️ ALERGIAS
          </h3>
          {data.allergies.map((allergy, index) => (
            <div key={index} className="mb-3 p-3 bg-red-50 rounded border-l-4 border-red-500">
              <p className="font-bold text-red-700">{allergy.allergen}</p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Severidad:</span> {allergy.severityLevel}
              </p>
              {allergy.reactionDescription && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold">Reacción:</span> {allergy.reactionDescription}
                </p>
              )}
              {allergy.notes && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold">Notas:</span> {allergy.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Active Medications */}
      {data.medications.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-blue-600 text-lg mb-3">💊 Medicamentos Activos</h3>
          {data.medications.map((med, index) => (
            <div key={index} className="mb-3 p-3 bg-blue-50 rounded border-l-4 border-blue-500">
              <p className="font-bold text-blue-700">{med.medicationName}</p>
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
          ))}
        </div>
      )}

      {/* Chronic Illnesses */}
      {data.illnesses.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-purple-600 text-lg mb-3">🩺 Enfermedades</h3>
          {data.illnesses.map((illness, index) => (
            <div key={index} className="mb-3 p-3 bg-purple-50 rounded border-l-4 border-purple-500">
              <p className="font-bold text-purple-700">
                {illness.illnessName}
                {illness.isChronic && <span className="text-xs ml-2 text-red-600">(CRÓNICA)</span>}
              </p>
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
          ))}
        </div>
      )}

      {/* Surgeries */}
      {data.surgeries.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-gray-600 text-lg mb-3">🔪 Cirugías</h3>
          {data.surgeries.map((surgery, index) => (
            <div key={index} className="mb-3 p-3 bg-gray-50 rounded border-l-4 border-gray-400">
              <p className="font-bold text-gray-700">{surgery.procedureName}</p>
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
          ))}
        </div>
      )}

      {!hasMedicalData && (
        <p className="text-gray-500 text-center py-4">No hay información médica registrada</p>
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
        <div className="mb-4 p-3 bg-pink-50 rounded border-l-4 border-pink-500">
          <p className="font-bold text-pink-700 text-lg">⚠️ EMBARAZADA</p>
          {data.pregnancyWeeks && (
            <p className="text-sm text-gray-700 mt-1">
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
