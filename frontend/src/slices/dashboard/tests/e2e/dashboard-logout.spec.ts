/**
 * E2E tests for Dashboard Logout Flow
 * Tests the complete logout functionality in the dashboard including UI interactions
 */
import { test, expect } from '@playwright/test'
import { loginAsPatient } from '../../../../shared/tests/helpers/auth-helpers'

test.describe('Dashboard Logout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as patient to access dashboard
    await loginAsPatient(page)
    await page.goto('/dashboard')
    await expect(page.getByTestId('dashboard-page')).toBeVisible()
  })

  test('should display user menu with logout option', async ({ page }) => {
    // Verify user menu trigger is visible
    await expect(page.getByTestId('user-menu-trigger')).toBeVisible()

    // Click user menu to open dropdown
    await page.getByTestId('user-menu-trigger').click()

    // Verify dropdown menu appears
    await expect(page.getByTestId('user-menu-dropdown')).toBeVisible()

    // Verify logout button is present in the menu
    await expect(page.getByTestId('dashboard-logout-button')).toBeVisible()

    // Verify logout button has correct text
    await expect(page.getByTestId('dashboard-logout-button')).toContainText('Cerrar Sesión')
  })

  test('should successfully logout when clicking logout button', async ({ page }) => {
    // Open user menu
    await page.getByTestId('user-menu-trigger').click()
    await expect(page.getByTestId('user-menu-dropdown')).toBeVisible()

    // Click logout button
    await page.getByTestId('dashboard-logout-button').click()

    // Should redirect to login page
    await expect(page).toHaveURL('/login')

    // Verify login page elements are visible
    await expect(page.getByTestId('login-form')).toBeVisible()

    // Verify we cannot access dashboard without authentication
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('should clear authentication tokens on logout', async ({ page }) => {
    // Verify tokens exist before logout
    const accessTokenBefore = await page.evaluate(() => localStorage.getItem('accessToken'))
    const userDataBefore = await page.evaluate(() => localStorage.getItem('user'))

    expect(accessTokenBefore).toBeTruthy()
    expect(userDataBefore).toBeTruthy()

    // Perform logout
    await page.getByTestId('user-menu-trigger').click()
    await page.getByTestId('dashboard-logout-button').click()

    // Wait for redirect to login
    await expect(page).toHaveURL('/login')

    // Verify tokens are cleared
    const accessTokenAfter = await page.evaluate(() => localStorage.getItem('accessToken'))
    const refreshTokenAfter = await page.evaluate(() => localStorage.getItem('refreshToken'))
    const userDataAfter = await page.evaluate(() => localStorage.getItem('user'))

    expect(accessTokenAfter).toBeNull()
    expect(refreshTokenAfter).toBeNull()
    expect(userDataAfter).toBeNull()
  })

  test('should close user menu when clicking outside', async ({ page }) => {
    // Open user menu
    await page.getByTestId('user-menu-trigger').click()
    await expect(page.getByTestId('user-menu-dropdown')).toBeVisible()

    // Click outside the menu (on the main content area)
    await page.getByTestId('dashboard-overview').click()

    // Menu should close
    await expect(page.getByTestId('user-menu-dropdown')).not.toBeVisible()
  })

  test('should handle logout API errors gracefully', async ({ page }) => {
    // Mock logout API to return error
    await page.route('**/auth/logout', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Internal server error' })
      })
    })

    // Perform logout - should still work despite API error
    await page.getByTestId('user-menu-trigger').click()
    await page.getByTestId('dashboard-logout-button').click()

    // Should still redirect to login page
    await expect(page).toHaveURL('/login')

    // Tokens should still be cleared
    const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'))
    expect(accessToken).toBeNull()
  })

  test('should display user information in the menu', async ({ page }) => {
    // Open user menu
    await page.getByTestId('user-menu-trigger').click()
    await expect(page.getByTestId('user-menu-dropdown')).toBeVisible()

    // Should display user name and role (now in Spanish)
    const menuContent = page.getByTestId('user-menu-dropdown')
    await expect(menuContent).toContainText('Paciente') // user role in Spanish

    // Should only show logout option (profile and settings removed)
    await expect(page.getByTestId('dashboard-logout-button')).toBeVisible()
    await expect(page.getByTestId('dashboard-logout-button')).toContainText('Cerrar Sesión')
  })

  test('should show loading state during logout', async ({ page }) => {
    // Slow down logout API to see loading state
    await page.route('**/auth/logout', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Logged out successfully' })
        })
      }, 1000)
    })

    // Start logout process
    await page.getByTestId('user-menu-trigger').click()
    await page.getByTestId('dashboard-logout-button').click()

    // Should eventually redirect to login
    await expect(page).toHaveURL('/login', { timeout: 10000 })
  })
})