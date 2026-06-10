import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { config } from '../config/config';
import { loadTestData } from '../utils/helper';
import { setupLoginPage, teardownSession } from '../utils/auth.helper';

interface InvalidLoginCase {
  username: string;
  password: string;
  description: string;
  expectedError: string;
}

interface TestData {
  validLogin: { username: string; password: string; description: string };
  invalidLogins: InvalidLoginCase[];
}

const testData = loadTestData<TestData>();

// ═══════════════════════════════════════════════════════════════
// LOGIN — POSITIVE (Smoke / Sanity / Regression)
// Owner: Member 1 (@smoke), Member 2 (@sanity), Member 3 (@regression)
// ═══════════════════════════════════════════════════════════════
test.describe('Login - Positive Tests', () => {
  let loginPage: Awaited<ReturnType<typeof setupLoginPage>>;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = await setupLoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test.afterEach(async ({ page }) => {
    await teardownSession(page);
  });

  // Member 1 — Smoke: critical path login
  test('Valid login with Admin credentials', { tag: ['@smoke', '@sanity', '@regression'] }, async () => {
    await loginPage.loginAndReachDashboard(
      config.credentials.username,
      config.credentials.password
    );
    await dashboardPage.verifyDashboardLoaded();
  });

  // Member 2 — Sanity: post-login dashboard verification
  test('Verify dashboard loads after successful login', { tag: ['@sanity', '@regression'] }, async () => {
    await loginPage.loginAndReachDashboard(
      testData.validLogin.username,
      testData.validLogin.password
    );
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.verifyDashboardHeader();
  });

  test('Verify URL contains dashboard after login', { tag: ['@sanity', '@regression'] }, async ({ page }) => {
    await loginPage.loginAndReachDashboard(
      testData.validLogin.username,
      testData.validLogin.password
    );
    await expect(page).toHaveURL(/dashboard\/index/);
  });

  // Member 3 — Regression: logout flow
  test('Verify logout returns user to login page', { tag: ['@sanity', '@regression'] }, async ({ page }) => {
    await loginPage.loginAndReachDashboard(
      testData.validLogin.username,
      testData.validLogin.password
    );
    await dashboardPage.verifyDashboardLoaded();
    await loginPage.logout();
    await loginPage.expectOnLoginPage();
    await expect(page).toHaveURL(/auth\/login/);
  });

  // Member 3 — Regression: forgot password / authentication flow
  test('Forgot password navigates to Reset Password page', { tag: ['@regression'] }, async () => {
    await loginPage.openForgotPassword();
    await expect(loginPage.resetPasswordHeading).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════
// LOGIN — NEGATIVE (Regression only — Member 3)
// Data-driven invalid credential scenarios
// ═══════════════════════════════════════════════════════════════
test.describe('Login - Negative Tests', { tag: ['@regression'] }, () => {
  let loginPage: Awaited<ReturnType<typeof setupLoginPage>>;

  test.beforeEach(async ({ page }) => {
    loginPage = await setupLoginPage(page);
  });

  test.afterEach(async ({ page }) => {
    await teardownSession(page);
  });

  for (const loginCase of testData.invalidLogins) {
    test(`Negative: ${loginCase.description}`, async ({ page }) => {
      await loginPage.login(loginCase.username, loginCase.password);

      if (loginCase.expectedError === 'Required') {
        const errors = await loginPage.getValidationErrors();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some((msg) => msg.includes('Required'))).toBeTruthy();
      } else {
        await expect(loginPage.errorAlert).toBeVisible({ timeout: 20_000 });
        await expect(loginPage.errorAlert).toContainText('Invalid credentials');
        await expect(page).toHaveURL(/auth\/login/);
      }
    });
  }
});
