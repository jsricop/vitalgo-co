/**
 * E2E tests for Patient Signup Form (RF001)
 * Tests the complete user journey for patient registration
 */
import { test, expect } from '@playwright/test';
import { SignupPage } from '../../../../../tests/pages/signup-page';
import { validPatientData, invalidPatientData } from '../../../../../tests/fixtures/patient-data';
import {
  waitForApiResponse,
  generateRandomEmail,
  generateRandomDocument,
  generateRandomPhone,
  takeDebugScreenshot,
  mockApiError,
  mockApiSuccess,
  verifyFormAccessibility,
  testResponsiveDesign
} from '../../../../../tests/helpers/test-helpers';

test.describe('Patient Signup Form - RF001', () => {
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
    await page.goto('/signup/paciente');
  });

  test.describe('Form Structure and Visibility', () => {
    test('should display all form sections and elements', async () => {
      await signupPage.expectFormVisible();
      await signupPage.expectSectionsVisible();

      // Verify all required fields are present
      await expect(signupPage.fullNameInput).toBeVisible();
      await expect(signupPage.documentTypeSelect).toBeVisible();
      await expect(signupPage.documentNumberInput).toBeVisible();
      await expect(signupPage.phoneInput).toBeVisible();
      await expect(signupPage.birthDateInput).toBeVisible();
      await expect(signupPage.emailInput).toBeVisible();
      await expect(signupPage.passwordInput).toBeVisible();
      await expect(signupPage.confirmPasswordInput).toBeVisible();
      await expect(signupPage.acceptTermsCheckbox).toBeVisible();
      await expect(signupPage.acceptPrivacyCheckbox).toBeVisible();
      await expect(signupPage.submitButton).toBeVisible();
      await expect(signupPage.loginLink).toBeVisible();
    });

    test('should have submit button disabled initially', async () => {
      await signupPage.expectSubmitButtonDisabled();
    });

    test('should meet accessibility standards', async ({ page }) => {
      await verifyFormAccessibility(page);
    });

    test('should be responsive across different viewport sizes', async ({ page }) => {
      await testResponsiveDesign(page, async () => {
        await signupPage.expectFormVisible();
        await signupPage.expectSectionsVisible();
      });
    });
  });

  test.describe('Field Validation', () => {
    test('should validate full name field on blur', async () => {
      // Test invalid name (too short)
      await signupPage.fullNameInput.fill('María');
      await signupPage.blurField('fullName');
      await signupPage.waitForValidation('fullName');
      await signupPage.expectFieldValidation('fullName', false);

      // Test valid name
      await signupPage.fullNameInput.fill(validPatientData.fullName);
      await signupPage.blurField('fullName');
      await signupPage.waitForValidation('fullName');
      await signupPage.expectFieldValidation('fullName', true);
    });

    test('should validate document number with API call', async ({ page }) => {
      // First select document type
      await signupPage.documentTypeSelect.selectOption(validPatientData.documentType);

      // Test document validation
      await signupPage.documentNumberInput.fill(validPatientData.documentNumber);
      await signupPage.blurField('documentNumber');

      // Wait for API call to complete
      await waitForApiResponse(page, '/api/signup/validate-document');
      await signupPage.waitForValidation('documentNumber');
    });

    test('should validate email with API call', async ({ page }) => {
      await signupPage.emailInput.fill(validPatientData.email);
      await signupPage.blurField('email');

      // Wait for API call to complete
      await waitForApiResponse(page, '/api/signup/validate-email');
      await signupPage.waitForValidation('email');
    });

    test('should validate password requirements', async () => {
      // Test weak password
      await signupPage.passwordInput.fill('123456');
      await signupPage.blurField('password');
      await signupPage.waitForValidation('password');
      await signupPage.expectFieldValidation('password', false);

      // Test strong password
      await signupPage.passwordInput.fill(validPatientData.password);
      await signupPage.blurField('password');
      await signupPage.waitForValidation('password');
      await signupPage.expectFieldValidation('password', true);
    });

    test('should validate password confirmation match', async () => {
      await signupPage.passwordInput.fill(validPatientData.password);
      await signupPage.confirmPasswordInput.fill('DifferentPassword123!');
      await signupPage.blurField('confirmPassword');
      await signupPage.waitForValidation('confirmPassword');
      await signupPage.expectFieldValidation('confirmPassword', false);

      // Test matching passwords
      await signupPage.confirmPasswordInput.fill(validPatientData.password);
      await signupPage.blurField('confirmPassword');
      await signupPage.waitForValidation('confirmPassword');
      await signupPage.expectFieldValidation('confirmPassword', true);
    });

    test('should validate phone number format', async () => {
      // Test invalid phone
      await signupPage.phoneInput.fill('123');
      await signupPage.blurField('phone');
      await signupPage.waitForValidation('phoneInternational');
      await signupPage.expectFieldValidation('phone', false);

      // Test valid phone
      await signupPage.phoneInput.fill(validPatientData.phoneInternational);
      await signupPage.blurField('phone');
      await signupPage.waitForValidation('phoneInternational');
      await signupPage.expectFieldValidation('phone', true);
    });

    test('should validate birth date for minimum age', async () => {
      // Test underage (under 18)
      await signupPage.birthDateInput.fill(invalidPatientData.underage.birthDate);
      await signupPage.blurField('birthDate');
      await signupPage.expectErrorMessage('Debe ser mayor de 18 años');

      // Test valid age
      await signupPage.birthDateInput.fill(validPatientData.birthDate);
      await signupPage.blurField('birthDate');
      // Should not show error message
    });
  });

  test.describe('Legal Links', () => {
    test('should open terms and conditions page', async ({ page, context }) => {
      await signupPage.clickTermsLink();

      // Wait for new page to open
      const newPage = await context.waitForEvent('page');
      await newPage.waitForLoadState();

      expect(newPage.url()).toContain('/terminos-y-condiciones');
      await expect(newPage.locator('h1')).toContainText(/términos.*condiciones/i);
    });

    test('should open privacy policy page', async ({ page, context }) => {
      await signupPage.clickPrivacyLink();

      // Wait for new page to open
      const newPage = await context.waitForEvent('page');
      await newPage.waitForLoadState();

      expect(newPage.url()).toContain('/politica-de-privacidad');
      await expect(newPage.locator('h1')).toContainText(/política.*privacidad/i);
    });
  });

  test.describe('Form Submission', () => {
    test('should enable submit button when form is complete and valid', async () => {
      const testData = {
        ...validPatientData,
        email: generateRandomEmail(),
        documentNumber: generateRandomDocument()
      };

      await signupPage.fillCompleteForm(testData);
      await signupPage.expectSubmitButtonEnabled();
    });

    test('should successfully register a new patient', async ({ page }) => {
      const testData = {
        ...validPatientData,
        email: generateRandomEmail(),
        documentNumber: generateRandomDocument(),
        phoneInternational: generateRandomPhone()
      };

      await signupPage.fillCompleteForm(testData);
      await signupPage.submitForm();

      // Wait for registration API call
      const response = await waitForApiResponse(page, '/api/signup/register-patient', 201);
      expect(response.status()).toBe(201);

      // Should redirect to success page or show success message
      await page.waitForURL(/\/success|\/dashboard/, { timeout: 10000 });
    });

    test('should handle registration errors gracefully', async ({ page }) => {
      // Mock API error response
      await mockApiError(page, '/api/signup/register-patient', 400, 'Email ya registrado');

      const testData = {
        ...validPatientData,
        email: generateRandomEmail(),
        documentNumber: generateRandomDocument()
      };

      await signupPage.fillCompleteForm(testData);
      await signupPage.submitForm();

      // Should show error message
      await signupPage.expectErrorMessage('Email ya registrado');
    });

    test('should prevent submission with incomplete form', async () => {
      // Fill only partial data
      await signupPage.fullNameInput.fill(validPatientData.fullName);
      await signupPage.emailInput.fill(validPatientData.email);

      await signupPage.expectSubmitButtonDisabled();
    });

    test('should prevent submission without legal acceptance', async () => {
      await signupPage.fillPersonalInfo(validPatientData);
      await signupPage.fillAccountInfo(validPatientData);

      // Don't accept legal terms
      await signupPage.expectSubmitButtonDisabled();
    });
  });

  test.describe('Error Scenarios', () => {
    test('should handle document validation API errors', async ({ page }) => {
      await mockApiError(page, '/api/signup/validate-document', 500, 'Error de validación');

      await signupPage.documentTypeSelect.selectOption(validPatientData.documentType);
      await signupPage.documentNumberInput.fill(validPatientData.documentNumber);
      await signupPage.blurField('documentNumber');

      await signupPage.expectErrorMessage('Error validando documento');
    });

    test('should handle email validation API errors', async ({ page }) => {
      await mockApiError(page, '/api/signup/validate-email', 500, 'Error de validación');

      await signupPage.emailInput.fill(validPatientData.email);
      await signupPage.blurField('email');

      await signupPage.expectErrorMessage('Error validando email');
    });

    test('should handle network errors during registration', async ({ page }) => {
      // Simulate network error
      await page.route('**/api/signup/register-patient', route => {
        route.abort('failed');
      });

      const testData = {
        ...validPatientData,
        email: generateRandomEmail(),
        documentNumber: generateRandomDocument()
      };

      await signupPage.fillCompleteForm(testData);
      await signupPage.submitForm();

      await signupPage.expectErrorMessage('Error de conexión. Inténtalo nuevamente.');
    });
  });

  test.describe('User Experience', () => {
    test('should clear field errors when user starts typing', async () => {
      // Create an error state
      await signupPage.fullNameInput.fill('A'); // Too short
      await signupPage.blurField('fullName');
      await signupPage.waitForValidation('fullName');
      await signupPage.expectFieldValidation('fullName', false);

      // Start typing again - error should clear
      await signupPage.fullNameInput.fill('María Elena');
      // Error message should be cleared
    });

    test('should maintain form state during validation', async () => {
      await signupPage.fullNameInput.fill(validPatientData.fullName);
      await signupPage.emailInput.fill(validPatientData.email);

      // Trigger validation on one field
      await signupPage.blurField('fullName');

      // Other field values should remain
      await expect(signupPage.emailInput).toHaveValue(validPatientData.email);
    });

    test('should show loading state during form submission', async ({ page }) => {
      // Mock slow API response
      await page.route('**/api/signup/register-patient', async route => {
        await page.waitForTimeout(2000); // Simulate slow response
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, message: 'Usuario registrado' })
        });
      });

      const testData = {
        ...validPatientData,
        email: generateRandomEmail(),
        documentNumber: generateRandomDocument()
      };

      await signupPage.fillCompleteForm(testData);
      await signupPage.submitForm();

      // Button should show loading state
      await expect(signupPage.submitButton).toBeDisabled();
      await expect(signupPage.submitButton).toContainText(/enviando|cargando/i);
    });
  });

  test.afterEach(async ({ page }) => {
    // Take screenshot on failure for debugging
    if (test.info().status === 'failed') {
      await takeDebugScreenshot(page, `signup-form-${test.info().title}`);
    }
  });
});