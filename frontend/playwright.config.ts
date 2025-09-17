import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for VitalGo E2E testing
 * Following DEV_CONTEXT testing architecture
 */
export default defineConfig({
  testDir: './src/slices',
  timeout: 30000,
  fullyParallel: false, // Sequential for database consistency
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker to avoid DB conflicts
  reporter: [['html', { outputFolder: 'test-results/html-report' }]],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Ensure services are running
  webServer: [
    {
      command: 'npm run dev',
      port: 3000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});