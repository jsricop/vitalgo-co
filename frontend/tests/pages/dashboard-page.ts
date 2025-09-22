/**
 * Dashboard Page Object Model
 * Handles all interactions with the dashboard page for E2E testing
 */
import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardOverview: Locator;
  readonly header: Locator;
  readonly navigation: Locator;
  readonly userMenu: Locator;
  readonly logoutButton: Locator;
  readonly medicationsSection: Locator;
  readonly allergiesSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardOverview = page.getByTestId('dashboard-overview');
    this.header = page.locator('header');
    this.navigation = page.locator('nav');
    this.userMenu = page.locator('[data-testid="user-menu"]');
    this.logoutButton = page.locator('[data-testid="logout-button"]');
    this.medicationsSection = page.locator('[data-testid="medications-section"]');
    this.allergiesSection = page.locator('[data-testid="allergies-section"]');
  }

  async goto() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async expectDashboardVisible() {
    await expect(this.dashboardOverview).toBeVisible();
    await expect(this.header).toBeVisible();
  }

  async expectDashboardDataLoaded() {
    // Wait for dashboard API calls to complete
    await this.page.waitForResponse(/\/api\/dashboard/, { timeout: 10000 });
    await expect(this.dashboardOverview).toBeVisible();
  }

  async expectUserAuthenticated() {
    // Check if user menu is visible (indicates authenticated state)
    const userMenuVisible = await this.header.locator('button').count() > 0;
    expect(userMenuVisible).toBe(true);
  }

  async expectSessionPersistent() {
    // Verify tokens exist in localStorage
    const sessionExists = await this.page.evaluate(() => {
      const accessToken = localStorage.getItem('accessToken');
      const user = localStorage.getItem('user');
      return accessToken !== null && user !== null;
    });
    expect(sessionExists).toBe(true);
  }

  async getStoredTokens() {
    return await this.page.evaluate(() => {
      return {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        user: localStorage.getItem('user')
      };
    });
  }

  async verifyNoAutomaticLogout(timeoutMs: number = 5000) {
    // Wait for specified time and verify still on dashboard
    await this.page.waitForTimeout(timeoutMs);
    expect(this.page.url()).toContain('/dashboard');
    await expect(this.dashboardOverview).toBeVisible();
  }

  async refreshPage() {
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToMedications() {
    await this.page.click('a[href*="medicamentos"]');
    await this.page.waitForTimeout(1000);
  }

  async navigateToAllergies() {
    await this.page.click('a[href*="alergias"]');
    await this.page.waitForTimeout(1000);
  }
}