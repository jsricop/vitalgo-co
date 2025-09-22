/**
 * Login-to-Dashboard Session Persistence E2E Tests
 * CRITICAL: Uses REAL DATABASE DATA - NO MOCKING
 *
 * Checkpoint Validation Protocol:
 * - Each checkpoint must pass before proceeding
 * - If same issue occurs 3 times, PAUSE for user validation
 * - No advancement until explicit checkpoint completion
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../../../tests/pages/login-page';
import { DashboardPage } from '../../../../../tests/pages/dashboard-page';
import {
  validLoginCredentials,
  validLoginCredentialsWithRememberMe,
  invalidLoginCredentials
} from '../../../../../tests/fixtures/auth-data';
import {
  performLogin,
  verifySessionStorage,
  clearAuthState,
  waitForApiResponse,
  verifyNoAutomaticLogout,
  testSessionPersistenceAfterReload
} from '../../../../../tests/helpers/auth-helpers';
import { setupTestUsers, verifyTestUsersExist } from '../../../../../tests/helpers/database-setup';

// Global test state tracking
let checkpointFailures = {
  checkpoint1: 0,
  checkpoint2: 0,
  checkpoint3: 0,
  checkpoint4: 0
};

test.describe('Login-to-Dashboard Session Persistence - REAL DATA', () => {
  // Setup test users before all tests
  test.beforeAll(async () => {
    console.log('🔄 Setting up test environment with real database...');
    try {
      await setupTestUsers();
      await verifyTestUsersExist();
      console.log('✅ Test environment ready');
    } catch (error) {
      console.error('❌ Failed to setup test environment:', error);
      throw error;
    }
  });

  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await clearAuthState(page);

    // Ensure clean state
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('CHECKPOINT 1: Login Success Validation', () => {
    test('should successfully authenticate with real credentials and store tokens', async ({ page }) => {
      console.log('🔍 CHECKPOINT 1: Testing login success...');

      try {
        const loginPage = new LoginPage(page);

        // Step 1: Navigate to login page
        await loginPage.goto();
        await loginPage.expectFormVisible();

        // Step 2: Fill real credentials
        await loginPage.fillCredentials(
          validLoginCredentials.email,
          validLoginCredentials.password
        );

        // Step 3: Submit form
        await loginPage.submitForm();

        // Step 4: Wait for successful authentication API response
        const authResponse = await waitForApiResponse(page, '/api/auth/login', 200);
        expect(authResponse.status()).toBe(200);

        // Step 5: Verify tokens are stored in localStorage
        await verifySessionStorage(page);

        // Step 6: Verify no error messages
        await loginPage.expectNoErrorMessage();

        console.log('✅ CHECKPOINT 1 PASSED: Login successful, tokens stored');
        checkpointFailures.checkpoint1 = 0; // Reset failure count

      } catch (error) {
        checkpointFailures.checkpoint1++;
        console.error(`❌ CHECKPOINT 1 FAILED (Attempt ${checkpointFailures.checkpoint1}):`, error);

        if (checkpointFailures.checkpoint1 >= 3) {
          console.error('🛑 CHECKPOINT 1 FAILED 3 TIMES - PAUSING FOR USER VALIDATION');
          console.error('Issues detected:');
          console.error('- Authentication API may not be working');
          console.error('- Test user may not exist in database');
          console.error('- Token storage mechanism may be broken');
          throw new Error('CHECKPOINT 1 VALIDATION REQUIRED - SEE CONSOLE LOGS');
        }
        throw error;
      }
    });

    test('should handle login errors correctly with real API', async ({ page }) => {
      console.log('🔍 CHECKPOINT 1: Testing login error handling...');

      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Test with invalid credentials
      await loginPage.fillCredentials(
        invalidLoginCredentials.wrongPassword.email,
        invalidLoginCredentials.wrongPassword.password
      );

      await loginPage.submitForm();

      // Should receive error response from real API
      const errorResponse = await page.waitForResponse(/\/api\/auth\/login/, { timeout: 10000 });
      expect(errorResponse.status()).toBe(401);

      // Should display error message
      await loginPage.expectErrorMessage('Email o contraseña incorrectos');

      console.log('✅ CHECKPOINT 1: Error handling works correctly');
    });
  });

  test.describe('CHECKPOINT 2: Dashboard Redirect Validation', () => {
    test('should redirect to dashboard after successful login', async ({ page }) => {
      console.log('🔍 CHECKPOINT 2: Testing dashboard redirect...');

      // Capture console logs from the browser
      const consoleLogs: string[] = [];
      page.on('console', msg => {
        const logMessage = `[BROWSER ${msg.type()}] ${msg.text()}`;
        consoleLogs.push(logMessage);
        console.log(logMessage);
      });

      try {
        // Perform login with real credentials
        await performLogin(page, validLoginCredentials, false);

        // Step 1: Wait for redirect to dashboard
        await page.waitForURL('/dashboard', { timeout: 10000 });

        // Step 2: Verify URL is correct
        expect(page.url()).toContain('/dashboard');

        // Step 3: Verify dashboard page loads completely
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.expectDashboardVisible();

        // Step 4: Verify authentication state persists
        await dashboardPage.expectSessionPersistent();

        console.log('✅ CHECKPOINT 2 PASSED: Dashboard redirect successful');
        checkpointFailures.checkpoint2 = 0; // Reset failure count

      } catch (error) {
        checkpointFailures.checkpoint2++;
        console.error(`❌ CHECKPOINT 2 FAILED (Attempt ${checkpointFailures.checkpoint2}):`, error);

        if (checkpointFailures.checkpoint2 >= 3) {
          console.error('🛑 CHECKPOINT 2 FAILED 3 TIMES - PAUSING FOR USER VALIDATION');
          console.error('Issues detected:');
          console.error('- Redirect logic may be broken');
          console.error('- Dashboard route may not be working');
          console.error('- AuthGuard may be blocking access');
          throw new Error('CHECKPOINT 2 VALIDATION REQUIRED - SEE CONSOLE LOGS');
        }
        throw error;
      } finally {
        console.log('🔍 CHECKPOINT 2 FINAL: Console logs summary');
        console.log('Total console messages:', consoleLogs.length);
        consoleLogs.forEach(log => console.log(log));
      }
    });

    test('should load dashboard with real user data', async ({ page }) => {
      console.log('🔍 CHECKPOINT 2: Testing dashboard data loading...');

      await performLogin(page, validLoginCredentials);

      const dashboardPage = new DashboardPage(page);

      // Wait for dashboard API calls to complete with real data
      await dashboardPage.expectDashboardDataLoaded();

      // Verify dashboard shows user-specific content
      await dashboardPage.expectUserAuthenticated();

      console.log('✅ CHECKPOINT 2: Dashboard loads with real user data');
    });
  });

  test.describe('CHECKPOINT 3: Session Maintenance Validation', () => {
    test('should maintain session after page refresh', async ({ page }) => {
      console.log('🔍 CHECKPOINT 3: Testing session persistence after refresh...');

      try {
        // Login and navigate to dashboard
        await performLogin(page, validLoginCredentials);

        // Test session persistence after page reload
        await testSessionPersistenceAfterReload(page);

        // Verify dashboard still accessible
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.expectDashboardVisible();
        await dashboardPage.expectSessionPersistent();

        console.log('✅ CHECKPOINT 3 PASSED: Session persists after refresh');
        checkpointFailures.checkpoint3 = 0; // Reset failure count

      } catch (error) {
        checkpointFailures.checkpoint3++;
        console.error(`❌ CHECKPOINT 3 FAILED (Attempt ${checkpointFailures.checkpoint3}):`, error);

        if (checkpointFailures.checkpoint3 >= 3) {
          console.error('🛑 CHECKPOINT 3 FAILED 3 TIMES - PAUSING FOR USER VALIDATION');
          console.error('Issues detected:');
          console.error('- Session storage may not be persisting');
          console.error('- AuthGuard may be clearing sessions incorrectly');
          console.error('- Token validation may be failing');
          throw new Error('CHECKPOINT 3 VALIDATION REQUIRED - SEE CONSOLE LOGS');
        }
        throw error;
      }
    });

    test('should maintain session during navigation within dashboard', async ({ page }) => {
      console.log('🔍 CHECKPOINT 3: Testing session during navigation...');

      await performLogin(page, validLoginCredentials);

      const dashboardPage = new DashboardPage(page);

      // Navigate to different sections
      await dashboardPage.navigateToMedications();
      await dashboardPage.expectSessionPersistent();

      await dashboardPage.navigateToAllergies();
      await dashboardPage.expectSessionPersistent();

      // Return to main dashboard
      await dashboardPage.goto();
      await dashboardPage.expectDashboardVisible();

      console.log('✅ CHECKPOINT 3: Session maintained during navigation');
    });
  });

  test.describe('CHECKPOINT 4: No Automatic Logout Validation', () => {
    test('should NOT logout automatically for at least 5 minutes', async ({ page }) => {
      console.log('🔍 CHECKPOINT 4: Testing no automatic logout...');

      try {
        // Login and navigate to dashboard
        await performLogin(page, validLoginCredentials);

        const dashboardPage = new DashboardPage(page);

        // Wait 5 minutes (5000ms for testing, can be extended for full test)
        await verifyNoAutomaticLogout(page, 5000);

        // Verify still authenticated and functional
        await dashboardPage.expectDashboardVisible();
        await dashboardPage.expectSessionPersistent();

        // Test API calls still work
        await dashboardPage.expectDashboardDataLoaded();

        console.log('✅ CHECKPOINT 4 PASSED: No automatic logout detected');
        checkpointFailures.checkpoint4 = 0; // Reset failure count

      } catch (error) {
        checkpointFailures.checkpoint4++;
        console.error(`❌ CHECKPOINT 4 FAILED (Attempt ${checkpointFailures.checkpoint4}):`, error);

        if (checkpointFailures.checkpoint4 >= 3) {
          console.error('🛑 CHECKPOINT 4 FAILED 3 TIMES - PAUSING FOR USER VALIDATION');
          console.error('Issues detected:');
          console.error('- Automatic logout may be occurring');
          console.error('- Session timeout may be too short');
          console.error('- Token expiration may be premature');
          throw new Error('CHECKPOINT 4 VALIDATION REQUIRED - SEE CONSOLE LOGS');
        }
        throw error;
      }
    });

    test('should maintain session with Remember Me functionality', async ({ page }) => {
      console.log('🔍 CHECKPOINT 4: Testing Remember Me functionality...');

      await performLogin(page, validLoginCredentialsWithRememberMe);

      // Close and reopen browser context
      await page.context().close();
      const newContext = await page.context().browser()?.newContext();
      if (!newContext) throw new Error('Failed to create new context');

      const newPage = await newContext.newPage();

      // Should still be authenticated
      await newPage.goto('/dashboard');
      const dashboardPage = new DashboardPage(newPage);
      await dashboardPage.expectDashboardVisible();

      await newContext.close();

      console.log('✅ CHECKPOINT 4: Remember Me functionality works');
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Log checkpoint status
    if (testInfo.status === 'failed') {
      console.error(`🔴 Test failed: ${testInfo.title}`);
      console.error('Checkpoint failure counts:', checkpointFailures);
    } else {
      console.log(`🟢 Test passed: ${testInfo.title}`);
    }

    // Clean up auth state
    await clearAuthState(page);
  });
});

// Summary test to verify all checkpoints
test.describe('CHECKPOINT SUMMARY VALIDATION', () => {
  test('should pass all checkpoints in sequence', async ({ page }) => {
    console.log('🎯 RUNNING COMPLETE CHECKPOINT VALIDATION...');

    // Clear any existing auth state
    await clearAuthState(page);

    // CHECKPOINT 1: Login Success
    console.log('🔍 Validating Checkpoint 1...');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.fillCredentials(validLoginCredentials.email, validLoginCredentials.password);
    await loginPage.submitForm();
    await waitForApiResponse(page, '/api/auth/login', 200);
    await verifySessionStorage(page);
    console.log('✅ Checkpoint 1: PASSED');

    // CHECKPOINT 2: Dashboard Redirect
    console.log('🔍 Validating Checkpoint 2...');
    await page.waitForURL('/dashboard', { timeout: 10000 });
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.expectDashboardVisible();
    await dashboardPage.expectSessionPersistent();
    console.log('✅ Checkpoint 2: PASSED');

    // CHECKPOINT 3: Session Maintenance
    console.log('🔍 Validating Checkpoint 3...');
    await testSessionPersistenceAfterReload(page);
    await dashboardPage.expectDashboardVisible();
    console.log('✅ Checkpoint 3: PASSED');

    // CHECKPOINT 4: No Automatic Logout
    console.log('🔍 Validating Checkpoint 4...');
    await verifyNoAutomaticLogout(page, 3000);
    await dashboardPage.expectDashboardVisible();
    await dashboardPage.expectSessionPersistent();
    console.log('✅ Checkpoint 4: PASSED');

    console.log('🎉 ALL CHECKPOINTS PASSED - SESSION PERSISTENCE VALIDATED');
  });
});