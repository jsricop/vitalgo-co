/**
 * Create test users in database before running E2E tests
 * This script ensures test users exist in the real database
 */

// Use native fetch (available in Node.js 18+)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const testUsers = [
  {
    email: 'test.patient@vitalgo.com',
    password: 'TestPassword123!',
    full_name: 'Test Patient Primary',
    document_type: 'CC',
    document_number: '1234567890',
    phone_international: '+57 300 123 4567',
    birth_date: '1990-01-15'
  },
  {
    email: 'test.patient2@vitalgo.com',
    password: 'TestPassword123!',
    full_name: 'Test Patient Secondary',
    document_type: 'CC',
    document_number: '0987654321',
    phone_international: '+57 300 987 6543',
    birth_date: '1985-06-20'
  }
];

async function createTestUser(userData) {
  try {
    console.log(`Creating test user: ${userData.email}`);

    const response = await fetch(`${API_BASE_URL}/api/signup/patient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: userData.full_name,
        document_type: userData.document_type,
        document_number: userData.document_number,
        phone_international: userData.phone_international,
        birth_date: userData.birth_date,
        email: userData.email,
        password: userData.password,
        confirm_password: userData.password,
        accept_terms: true,
        accept_privacy: true
      }),
    });

    if (response.ok) {
      console.log(`✅ Test user ${userData.email} created successfully`);
    } else if (response.status === 409) {
      console.log(`✅ Test user ${userData.email} already exists`);
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ Failed to create test user ${userData.email}:`, errorData);
    }
  } catch (error) {
    console.error(`❌ Error creating test user ${userData.email}:`, error.message);
  }
}

async function verifyTestUser(userData) {
  try {
    console.log(`Verifying test user: ${userData.email}`);

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
      return true;
    } else {
      console.warn(`⚠️ Test user ${userData.email} cannot authenticate`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error verifying test user ${userData.email}:`, error.message);
    return false;
  }
}

async function setupTestUsers() {
  console.log('🔄 Setting up test users in database...');
  console.log(`API Base URL: ${API_BASE_URL}`);

  try {
    // Create all test users
    for (const userData of testUsers) {
      await createTestUser(userData);
    }

    console.log('\n🔍 Verifying test users can authenticate...');

    // Verify all test users
    let allUsersValid = true;
    for (const userData of testUsers) {
      const isValid = await verifyTestUser(userData);
      if (!isValid) {
        allUsersValid = false;
      }
    }

    if (allUsersValid) {
      console.log('\n✅ All test users are ready for E2E testing');
      process.exit(0);
    } else {
      console.error('\n❌ Some test users failed verification');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Failed to setup test users:', error);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupTestUsers();
}

module.exports = { setupTestUsers };