/**
 * Test fixtures for patient registration data
 * Used across E2E tests for consistent test data
 */

export const validPatientData = {
  fullName: 'María Elena González Pérez',
  documentType: 'cedula_ciudadania',
  documentNumber: '12345678',
  phoneInternational: '+57 300 123 4567',
  birthDate: '1990-05-15',
  email: 'maria.gonzalez@example.com',
  password: 'SecurePass123!',
  confirmPassword: 'SecurePass123!'
};

export const invalidPatientData = {
  shortName: {
    fullName: 'María',
    documentNumber: '12345678',
    phoneInternational: '+57 300 123 4567',
    birthDate: '1990-05-15',
    email: 'short@example.com',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!'
  },
  invalidEmail: {
    fullName: 'Pedro José Ramírez Silva',
    documentNumber: '87654321',
    phoneInternational: '+57 301 987 6543',
    birthDate: '1985-08-20',
    email: 'invalid-email',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!'
  },
  passwordMismatch: {
    fullName: 'Ana Carolina López Torres',
    documentNumber: '11223344',
    phoneInternational: '+57 302 555 7890',
    birthDate: '1992-12-03',
    email: 'ana.lopez@example.com',
    password: 'SecurePass123!',
    confirmPassword: 'DifferentPass123!'
  },
  weakPassword: {
    fullName: 'Carlos Alberto Mendez Cruz',
    documentNumber: '99887766',
    phoneInternational: '+57 303 111 2233',
    birthDate: '1988-03-25',
    email: 'carlos.mendez@example.com',
    password: '123456',
    confirmPassword: '123456'
  },
  underage: {
    fullName: 'Sofía Isabella Morales Ruiz',
    documentNumber: '55443322',
    phoneInternational: '+57 304 444 5566',
    birthDate: '2010-01-01', // Makes person under 18
    email: 'sofia.morales@example.com',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!'
  }
};

export const documentTypes = [
  { id: 'cedula_ciudadania', name: 'Cédula de Ciudadanía' },
  { id: 'cedula_extranjeria', name: 'Cédula de Extranjería' },
  { id: 'pasaporte', name: 'Pasaporte' },
  { id: 'tarjeta_identidad', name: 'Tarjeta de Identidad' },
  { id: 'permiso_especial', name: 'Permiso Especial de Permanencia' },
  { id: 'salvoconducto', name: 'Salvoconducto' },
  { id: 'otros', name: 'Otros' }
];