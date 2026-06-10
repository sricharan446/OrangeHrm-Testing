import { test, expect } from '@playwright/test';
import { loadRegressionData } from '../../utils/helper';
import { setupLoginPage, teardownSession } from '../../utils/auth.helper';

interface InvalidLoginCase {
  username: string;
  password: string;
  description: string;
  expectedError: string;
}

interface RegressionLoginData {
  invalidLogins: InvalidLoginCase[];
}

/**
 * REGRESSION SUITE — Member 3 (You)
 * Branch: regression-testing
 * Owner: Regression Testing
 * Covers: Login negatives, forgot-password flow, authentication edge cases.
 */
test.describe('Regression — Login Negative', { tag: ['@regression'] }, () => {
  const testData = loadRegressionData<RegressionLoginData>('regression/invalid-logins.json');

  test.afterEach(async ({ page }) => {
    await teardownSession(page);
  });

  for (const loginCase of testData.invalidLogins) {
    test(`Negative: ${loginCase.description}`, async ({ page }) => {
      const loginPage = await setupLoginPage(page);
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

test.describe('Regression — Login Authentication Flows', { tag: ['@regression'] }, () => {
  test.afterEach(async ({ page }) => {
    await teardownSession(page);
  });

  test('Forgot password navigates to Reset Password page', async ({ page }) => {
    const loginPage = await setupLoginPage(page);
    await loginPage.openForgotPassword();
    await expect(loginPage.resetPasswordHeading).toBeVisible();
  });
});
