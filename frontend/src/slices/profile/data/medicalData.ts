/**
 * Medical information data constants for RF002 Medical Information section
 * Contains all dropdown options and constants needed for the medical information form
 */

export interface MedicalOption {
  value: string;
  label: string;
}

// EPS (Colombian Health Insurance) options
export const epsOptions: MedicalOption[] = [
  { value: "COMPENSAR", label: "Compensar" },
  { value: "FAMISANAR", label: "Famisanar" },
  { value: "SANITAS", label: "Sanitas" },
  { value: "SURA", label: "Sura" },
  { value: "NUEVA_EPS", label: "Nueva EPS" },
  { value: "ALIANSALUD", label: "Aliansalud" },
  { value: "MEDIMAS", label: "Medimás" },
  { value: "COOSALUD", label: "Coosalud" },
  { value: "MUTUAL_SER", label: "Mutual Ser" },
  { value: "SALUD_TOTAL", label: "Salud Total" },
  { value: "CAFESALUD", label: "Cafesalud" },
  { value: "CRUZ_BLANCA", label: "Cruz Blanca" },
  { value: "GOLDEN_GROUP", label: "Golden Group" },
  { value: "SALUDVIDA", label: "Saludvida" },
  { value: "CAPITAL_SALUD", label: "Capital Salud" },
  { value: "OTRO", label: "Otro" }
];

// Blood type options
export const bloodTypeOptions: MedicalOption[] = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" }
];

// Complementary plan options
export const complementaryPlanOptions: MedicalOption[] = [
  { value: "MEDICINA_PREPAGADA", label: "Medicina Prepagada" },
  { value: "PLAN_COMPLEMENTARIO", label: "Plan Complementario" },
  { value: "POLIZA_SALUD", label: "Póliza de Salud" },
  { value: "PLAN_EMPRESARIAL", label: "Plan Empresarial" },
  { value: "SEGURO_VIDA", label: "Seguro de Vida con Cobertura Médica" },
  { value: "OTRO", label: "Otro" }
];

// Emergency contact relationship options
export const emergencyContactRelationshipOptions: MedicalOption[] = [
  { value: "MADRE", label: "Madre" },
  { value: "PADRE", label: "Padre" },
  { value: "ESPOSO", label: "Esposo(a)" },
  { value: "HERMANO", label: "Hermano(a)" },
  { value: "HIJO", label: "Hijo(a)" },
  { value: "ABUELO", label: "Abuelo(a)" },
  { value: "TIO", label: "Tío(a)" },
  { value: "PRIMO", label: "Primo(a)" },
  { value: "AMIGO", label: "Amigo(a)" },
  { value: "PAREJA", label: "Pareja" },
  { value: "OTRO", label: "Otro familiar" }
];

// Common occupations in Colombian context
export const occupationSuggestions: string[] = [
  // Professional
  "Médico(a)",
  "Enfermero(a)",
  "Ingeniero(a)",
  "Abogado(a)",
  "Contador(a)",
  "Arquitecto(a)",
  "Psicólogo(a)",
  "Profesor(a)",
  "Administrador(a)",
  "Economista",

  // Technical
  "Técnico en Sistemas",
  "Técnico en Salud",
  "Técnico Industrial",
  "Auxiliar de Enfermería",
  "Auxiliar Administrativo",

  // Service Industry
  "Comerciante",
  "Vendedor(a)",
  "Mesero(a)",
  "Conductor",
  "Seguridad",
  "Recepcionista",

  // Independent
  "Trabajador Independiente",
  "Empresario(a)",
  "Consultor(a)",
  "Freelancer",

  // Other
  "Estudiante",
  "Pensionado(a)",
  "Ama de Casa",
  "Desempleado(a)"
];

// Utility functions
export const getEpsByValue = (value: string): MedicalOption | undefined => {
  return epsOptions.find(eps => eps.value === value);
};

export const getBloodTypeByValue = (value: string): MedicalOption | undefined => {
  return bloodTypeOptions.find(bloodType => bloodType.value === value);
};

export const getComplementaryPlanByValue = (value: string): MedicalOption | undefined => {
  return complementaryPlanOptions.find(plan => plan.value === value);
};

export const getEmergencyContactRelationshipByValue = (value: string): MedicalOption | undefined => {
  return emergencyContactRelationshipOptions.find(relationship => relationship.value === value);
};

export const searchOccupations = (searchTerm: string): string[] => {
  const term = searchTerm.toLowerCase();
  return occupationSuggestions.filter(occupation =>
    occupation.toLowerCase().includes(term)
  );
};

// Validation helpers
export const isOtherValueRequired = (selectedValue: string): boolean => {
  return selectedValue === "OTRO";
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  // Colombian phone number validation (10 digits)
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  // Format Colombian phone number: 300 123 4567
  const cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phoneNumber;
};