/**
 * Authentication test data fixtures
 * Contains test credentials for real database users - NO MOCKUPS
 */

// Real test user credentials - must exist in database
export const validLoginCredentials = {
  email: 'test.patient@vitalgo.com',
  password: 'TestPassword123!',
  rememberMe: false
};

export const validLoginCredentialsWithRememberMe = {
  email: 'test.patient@vitalgo.com',
  password: 'TestPassword123!',
  rememberMe: true
};

// Test credentials for error scenarios - these should NOT exist in DB
export const invalidLoginCredentials = {
  wrongEmail: {
    email: 'nonexistent@email.com',
    password: 'TestPassword123!',
    rememberMe: false
  },
  wrongPassword: {
    email: 'test.patient@vitalgo.com',
    password: 'WrongPassword123!',
    rememberMe: false
  },
  invalidEmailFormat: {
    email: 'invalid-email-format',
    password: 'TestPassword123!',
    rememberMe: false
  },
  emptyFields: {
    email: '',
    password: '',
    rememberMe: false
  }
};

// Alternative test user for additional scenarios
export const alternativeValidCredentials = {
  email: 'test.patient2@vitalgo.com',
  password: 'TestPassword123!',
  rememberMe: false
};

/**
 * Database test user creation data
 * Use this for creating test users in database setup
 */
export const testUserCreationData = {
  primary: {
    email: 'test.patient@vitalgo.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Patient',
    fullName: 'Test Patient Primary',
    documentType: 'CC',
    documentNumber: '1234567890',
    phoneInternational: '+57 300 123 4567',
    birthDate: '1990-01-15',
    userType: 'patient'
  },
  secondary: {
    email: 'test.patient2@vitalgo.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Patient Two',
    fullName: 'Test Patient Secondary',
    documentType: 'CC',
    documentNumber: '0987654321',
    phoneInternational: '+57 300 987 6543',
    birthDate: '1985-06-20',
    userType: 'patient'
  }
};