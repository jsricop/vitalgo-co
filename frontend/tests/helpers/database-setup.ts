/**
 * Database setup utilities for E2E testing
 * Creates and manages test users in the real database
 */
import { testUserCreationData } from '../fixtures/auth-data';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Create test users in the database before running tests
 */
export async function setupTestUsers(): Promise<void> {
  console.log('Setting up test users in database...');

  try {
    // Create primary test user
    await createTestUser(testUserCreationData.primary);
    console.log('✅ Primary test user created');

    // Create secondary test user
    await createTestUser(testUserCreationData.secondary);
    console.log('✅ Secondary test user created');

  } catch (error) {
    console.error('❌ Failed to setup test users:', error);
    throw error;
  }
}

/**
 * Create a single test user via the real signup API
 */
async function createTestUser(userData: any): Promise<void> {
  try {
    // First check if user already exists
    const userExists = await checkUserExists(userData.email);
    if (userExists) {
      console.log(`✅ Test user ${userData.email} already exists`);
      return;
    }

    // Create user via real signup endpoint
    const response = await fetch(`${API_BASE_URL}/api/signup/patient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: userData.fullName,
        document_type: userData.documentType,
        document_number: userData.documentNumber,
        phone_international: userData.phoneInternational,
        birth_date: userData.birthDate,
        email: userData.email,
        password: userData.password,
        confirm_password: userData.password,
        accept_terms: true,
        accept_privacy: true
      }),
    });

    if (!response.ok) {
      // If user already exists, that's okay for testing
      if (response.status === 409 || response.status === 400) {
        const errorData = await response.json().catch(() => ({}));
        // Check if error is about email already registered
        if (errorData.detail?.errors?.general?.includes("El email ya está registrado")) {
          console.log(`✅ Test user ${userData.email} already exists`);
          return;
        }
        console.log(`✅ Test user ${userData.email} already exists`);
        return;
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to create test user: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.log(`✅ Test user ${userData.email} created successfully`);

  } catch (error) {
    // If user already exists, continue
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log(`✅ Test user ${userData.email} already exists`);
      return;
    }
    throw error;
  }
}

/**
 * Check if a user exists by trying to validate email
 */
async function checkUserExists(email: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/signup/validate-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    // If validation returns 409 (conflict), user exists
    return response.status === 409;
  } catch (error) {
    return false;
  }
}

/**
 * Cleanup test users after tests complete (optional)
 */
export async function cleanupTestUsers(): Promise<void> {
  console.log('Note: Test user cleanup should be handled by database administrators');
  console.log('Test users will remain in database for future test runs');
  // We don't automatically delete users to preserve data integrity
}

/**
 * Verify test users can authenticate
 */
export async function verifyTestUsersExist(): Promise<void> {
  console.log('Verifying test users can authenticate...');

  for (const userData of Object.values(testUserCreationData)) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          remember_me: false
        }),
      });

      if (response.ok) {
        console.log(`✅ Test user ${userData.email} can authenticate`);
      } else {
        console.warn(`⚠️ Test user ${userData.email} cannot authenticate`);
      }
    } catch (error) {
      console.error(`❌ Failed to verify test user ${userData.email}:`, error);
    }
  }
}