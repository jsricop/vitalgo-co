/**
 * Authentication helper functions for E2E testing
 * Uses REAL DATABASE DATA - NO MOCKING
 */
import { Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { validLoginCredentials } from '../fixtures/auth-data';

/**
 * Perform complete login flow with REAL API calls
 */
export async function performLogin(
  page: Page,
  credentials = validLoginCredentials,
  validateSuccess = true
): Promise<void> {
  const loginPage = new LoginPage(page);

  // Navigate to login page
  await loginPage.goto();

  // Fill credentials and submit
  await loginPage.fillCredentials(credentials.email, credentials.password);

  if (credentials.rememberMe) {
    await loginPage.checkRememberMe();
  }

  await loginPage.submitForm();

  if (validateSuccess) {
    console.log('🔍 HELPER CHECKPOINT 1: Waiting for redirect to dashboard');

    // Wait for redirect to dashboard
    try {
      await page.waitForURL('/dashboard', { timeout: 10000 });
      console.log('🔍 HELPER CHECKPOINT 2: Successfully navigated to dashboard');
    } catch (error) {
      console.error('🔍 HELPER CHECKPOINT 2 ERROR: Failed to navigate to dashboard', {
        currentUrl: page.url(),
        error: error.message
      });
      throw error;
    }

    // Add extra wait to ensure page is fully loaded
    console.log('🔍 HELPER CHECKPOINT 3: Waiting for page to stabilize');
    await page.waitForTimeout(2000);

    // Verify dashboard loads with real data
    const dashboardPage = new DashboardPage(page);
    console.log('🔍 HELPER CHECKPOINT 4: Checking dashboard visibility');
    await dashboardPage.expectDashboardVisible();
    console.log('🔍 HELPER CHECKPOINT 5: Dashboard is visible');
  }
}

/**
 * Verify session tokens are stored correctly from REAL API response
 */
export async function verifySessionStorage(page: Page): Promise<void> {
  // Ensure we're on a valid page with localStorage access
  if (page.url() === 'about:blank' || !page.url().includes('localhost')) {
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
  }

  const tokens = await page.evaluate(() => {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      user: localStorage.getItem('user')
    };
  });

  expect(tokens.accessToken).not.toBeNull();
  expect(tokens.user).not.toBeNull();

  // Verify user data structure from real API response
  const userData = JSON.parse(tokens.user!);
  expect(userData.email).toBeTruthy();
  expect(userData.user_type).toBe('patient');
  expect(userData.id).toBeTruthy();
  // first_name and last_name can be null for test users
  expect(userData.first_name).toBeDefined();
  expect(userData.last_name).toBeDefined();
}

/**
 * Clear authentication state
 */
export async function clearAuthState(page: Page): Promise<void> {
  try {
    // Ensure we're on a valid page with localStorage access
    if (page.url() === 'about:blank' || !page.url().includes('localhost')) {
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
    }

    await page.evaluate(() => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    });
  } catch (error) {
    // If localStorage access fails, just continue - this might happen on about:blank
    console.log('localStorage access denied, continuing...');
  }
}

/**
 * Wait for API response and validate
 */
export async function waitForApiResponse(
  page: Page,
  urlPattern: string,
  expectedStatus = 200
): Promise<any> {
  const response = await page.waitForResponse(
    response => response.url().includes(urlPattern) && response.status() === expectedStatus,
    { timeout: 10000 }
  );

  expect(response.status()).toBe(expectedStatus);
  return response;
}

/**
 * Verify no automatic logout occurs within timeframe
 */
export async function verifyNoAutomaticLogout(
  page: Page,
  timeoutMs: number = 5000
): Promise<void> {
  const startUrl = page.url();

  // Wait for specified time
  await page.waitForTimeout(timeoutMs);

  // Verify still on same page
  expect(page.url()).toBe(startUrl);

  // Verify session still exists
  await verifySessionStorage(page);

  // Verify dashboard is still accessible if we're on it
  if (startUrl.includes('/dashboard')) {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.expectDashboardVisible();
  }
}

/**
 * Test session persistence after page reload
 */
export async function testSessionPersistenceAfterReload(page: Page): Promise<void> {
  const originalUrl = page.url();

  // Reload page
  await page.reload();
  await page.waitForLoadState('networkidle');

  // Verify still on same URL (no redirect to login)
  expect(page.url()).toBe(originalUrl);

  // Verify session still exists
  await verifySessionStorage(page);
}