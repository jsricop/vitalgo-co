/**
 * Page Object Model for Patient Signup Form
 * Encapsulates page interactions for E2E tests
 */
import { Page, Locator, expect } from '@playwright/test';

export class SignupPage {
  private readonly page: Page;

  // Form locators
  readonly fullNameInput: Locator;
  readonly documentTypeSelect: Locator;
  readonly documentNumberInput: Locator;
  readonly phoneInput: Locator;
  readonly birthDateInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly acceptTermsCheckbox: Locator;
  readonly acceptPrivacyCheckbox: Locator;
  readonly submitButton: Locator;
  readonly loginLink: Locator;

  // Section locators
  readonly personalInfoSection: Locator;
  readonly accountSection: Locator;
  readonly legalSection: Locator;

  // Validation message locators
  readonly validationMessages: Locator;
  readonly errorMessages: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form field locators using data-testid
    this.fullNameInput = page.getByTestId('fullName-input');
    this.documentTypeSelect = page.getByTestId('documentType-select');
    this.documentNumberInput = page.getByTestId('documentNumber-input');
    this.phoneInput = page.getByTestId('phone-input');
    this.birthDateInput = page.getByTestId('birthDate-input');
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.confirmPasswordInput = page.getByTestId('confirmPassword-input');
    this.acceptTermsCheckbox = page.getByTestId('acceptTerms-checkbox');
    this.acceptPrivacyCheckbox = page.getByTestId('acceptPrivacy-checkbox');
    this.submitButton = page.getByTestId('submit-button');
    this.loginLink = page.getByTestId('login-link');

    // Section locators
    this.personalInfoSection = page.getByTestId('personal-info-section');
    this.accountSection = page.getByTestId('account-section');
    this.legalSection = page.locator('[class*="space-y-6"]:has(h3:text("Términos Legales"))');

    // Validation and error message locators
    this.validationMessages = page.locator('[class*="text-red-500"], [class*="text-green-500"]');
    this.errorMessages = page.locator('[class*="text-red-500"]');
  }


  async fillPersonalInfo(data: {
    fullName: string;
    documentType: string;
    documentNumber: string;
    phoneInternational: string;
    birthDate: string;
  }) {
    await this.fullNameInput.fill(data.fullName);
    await this.documentTypeSelect.selectOption(data.documentType);
    await this.documentNumberInput.fill(data.documentNumber);
    await this.phoneInput.fill(data.phoneInternational);
    await this.birthDateInput.fill(data.birthDate);
  }

  async fillAccountInfo(data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.confirmPassword);
  }

  async acceptLegalTerms() {
    await this.acceptTermsCheckbox.check();
    await this.acceptPrivacyCheckbox.check();
  }

  async fillCompleteForm(data: {
    fullName: string;
    documentType: string;
    documentNumber: string;
    phoneInternational: string;
    birthDate: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    await this.fillPersonalInfo(data);
    await this.fillAccountInfo(data);
    await this.acceptLegalTerms();
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async waitForValidation(field: string, timeout: number = 5000) {
    const fieldLocator = this.page.getByTestId(`${field}-input`).locator('xpath=following-sibling::*[1]');
    await fieldLocator.waitFor({ timeout });
  }

  async expectFieldValidation(field: string, shouldBeValid: boolean) {
    const validationIndicator = this.page.getByTestId(`${field}-validation`);

    if (shouldBeValid) {
      await expect(validationIndicator).toHaveClass(/success|valid|green/);
    } else {
      await expect(validationIndicator).toHaveClass(/error|invalid|red/);
    }
  }

  async expectErrorMessage(message: string) {
    await expect(this.page.locator(`text=${message}`)).toBeVisible();
  }

  async expectSubmitButtonDisabled() {
    await expect(this.submitButton).toBeDisabled();
  }

  async expectSubmitButtonEnabled() {
    await expect(this.submitButton).toBeEnabled();
  }

  async expectSuccessRedirect() {
    // Wait for redirect to success page or dashboard
    await this.page.waitForURL(/\/success|\/dashboard/, { timeout: 10000 });
  }

  async expectFormVisible() {
    await expect(this.page.getByTestId('patient-signup-form')).toBeVisible();
  }

  async expectSectionsVisible() {
    await expect(this.personalInfoSection).toBeVisible();
    await expect(this.accountSection).toBeVisible();
    await expect(this.legalSection).toBeVisible();
  }

  async blurField(field: string) {
    const fieldInput = this.page.getByTestId(`${field}-input`);
    await fieldInput.blur();
  }

  async clickTermsLink() {
    const termsLink = this.acceptTermsCheckbox.locator('xpath=following-sibling::*/a[contains(text(), "términos")]');
    await termsLink.click();
  }

  async clickPrivacyLink() {
    const privacyLink = this.acceptPrivacyCheckbox.locator('xpath=following-sibling::*/a[contains(text(), "privacidad")]');
    await privacyLink.click();
  }

  async expectLegalPageOpened(type: 'terms' | 'privacy') {
    if (type === 'terms') {
      await this.page.waitForURL(/\/terminos-y-condiciones/);
    } else {
      await this.page.waitForURL(/\/politica-de-privacidad/);
    }
  }
}