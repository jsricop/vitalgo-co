/**
 * Shared test helpers and utilities
 * Reusable functions across different test suites
 */
import { Page, expect } from '@playwright/test';

/**
 * Wait for API response and verify status
 */
export async function waitForApiResponse(
  page: Page,
  url: string,
  expectedStatus: number = 200,
  timeout: number = 10000
) {
  const responsePromise = page.waitForResponse(
    response => response.url().includes(url) && response.status() === expectedStatus,
    { timeout }
  );

  const response = await responsePromise;
  return response;
}

/**
 * Clear all form inputs on page
 */
export async function clearAllFormInputs(page: Page) {
  const inputs = await page.locator('input[type="text"], input[type="email"], input[type="password"], input[type="date"], select').all();

  for (const input of inputs) {
    await input.clear();
  }

  const checkboxes = await page.locator('input[type="checkbox"]').all();
  for (const checkbox of checkboxes) {
    await checkbox.uncheck();
  }
}

/**
 * Generate random email for testing
 */
export function generateRandomEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `test.user.${timestamp}.${random}@example.com`;
}

/**
 * Generate random phone number
 */
export function generateRandomPhone(): string {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const number = Math.floor(Math.random() * 9000000) + 1000000;
  return `+57 ${areaCode} ${number.toString().substring(0, 3)} ${number.toString().substring(3)}`;
}

/**
 * Generate random document number
 */
export function generateRandomDocument(): string {
  return Math.floor(Math.random() * 90000000 + 10000000).toString();
}

/**
 * Wait for loading states to complete
 */
export async function waitForLoadingComplete(page: Page, timeout: number = 5000) {
  // Wait for any loading spinners to disappear
  await page.waitForFunction(
    () => !document.querySelector('[data-testid*="loading"], .loading, [class*="spinner"]'),
    { timeout }
  );
}

/**
 * Check if element has validation error state
 */
export async function hasValidationError(page: Page, testId: string): Promise<boolean> {
  const element = page.getByTestId(testId);
  const classes = await element.getAttribute('class') || '';
  return classes.includes('error') || classes.includes('invalid') || classes.includes('red');
}

/**
 * Check if element has validation success state
 */
export async function hasValidationSuccess(page: Page, testId: string): Promise<boolean> {
  const element = page.getByTestId(testId);
  const classes = await element.getAttribute('class') || '';
  return classes.includes('success') || classes.includes('valid') || classes.includes('green');
}

/**
 * Take screenshot with timestamp for debugging
 */
export async function takeDebugScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({
    path: `test-results/debug-${name}-${timestamp}.png`,
    fullPage: true
  });
}

/**
 * Mock API response for testing error scenarios
 */
export async function mockApiError(
  page: Page,
  url: string,
  status: number,
  errorMessage: string
) {
  await page.route(`**/api/**${url}**`, route => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({
        success: false,
        message: errorMessage,
        error: errorMessage
      })
    });
  });
}

/**
 * Mock successful API response
 */
export async function mockApiSuccess(
  page: Page,
  url: string,
  responseData: any
) {
  await page.route(`**/api/**${url}**`, route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        ...responseData
      })
    });
  });
}

/**
 * Verify form accessibility
 */
export async function verifyFormAccessibility(page: Page) {
  // Check for proper label associations
  const inputs = await page.locator('input').all();
  for (const input of inputs) {
    const id = await input.getAttribute('id');
    if (id) {
      const label = page.locator(`label[for="${id}"]`);
      await expect(label).toBeVisible();
    }
  }

  // Check for required field indicators
  const requiredInputs = await page.locator('input[required]').all();
  for (const input of requiredInputs) {
    const container = input.locator('xpath=ancestor::div[1]');
    await expect(container.locator('text=*')).toBeVisible();
  }
}

/**
 * Test responsive design at different viewport sizes
 */
export async function testResponsiveDesign(page: Page, testCallback: () => Promise<void>) {
  const viewports = [
    { width: 375, height: 667, name: 'mobile' },    // iPhone SE
    { width: 768, height: 1024, name: 'tablet' },   // iPad
    { width: 1920, height: 1080, name: 'desktop' }  // Desktop
  ];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.waitForTimeout(500); // Allow layout to settle

    try {
      await testCallback();
    } catch (error) {
      throw new Error(`Test failed on ${viewport.name} viewport (${viewport.width}x${viewport.height}): ${error}`);
    }
  }
}