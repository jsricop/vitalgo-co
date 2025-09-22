/**
 * Login Page Object Model
 * Handles all interactions with the login page for E2E testing
 */
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly submitButton: Locator;
  readonly loginForm: Locator;
  readonly errorMessage: Locator;
  readonly signupLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('login-email-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.rememberMeCheckbox = page.getByTestId('remember-me-checkbox');
    this.submitButton = page.getByTestId('login-submit-button');
    this.loginForm = page.getByTestId('login-credentials-form');
    this.errorMessage = page.getByTestId('login-error-message');
    this.signupLink = page.locator('a[href="/signup/paciente"]');
  }

  async goto() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  async fillCredentials(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async checkRememberMe() {
    await this.rememberMeCheckbox.check();
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async expectFormVisible() {
    await expect(this.loginForm).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async expectSubmitButtonDisabled() {
    await expect(this.submitButton).toBeDisabled();
  }

  async expectSubmitButtonEnabled() {
    await expect(this.submitButton).toBeEnabled();
  }

  async expectErrorMessage(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }

  async expectNoErrorMessage() {
    await expect(this.errorMessage).not.toBeVisible();
  }

  async waitForLoadingState() {
    // Wait for any loading indicators to disappear
    await this.page.waitForTimeout(1000);
  }
}