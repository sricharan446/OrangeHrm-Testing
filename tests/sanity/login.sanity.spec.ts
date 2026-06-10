import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../pages/DashboardPage';
import { loadSharedData } from '../../utils/helper';
import { setupLoginPage, teardownSession } from '../../utils/auth.helper';

interface ValidLogin {
  username: string;
  password: string;
}

/**
 * SANITY SUITE — Member 2
 * Branch: sanity-testing
 * Purpose: Verify core login flows and post-login routing.
 */
test.describe('Sanity — Login', { tag: ['@sanity'] }, () => {
  const validLogin = loadSharedData<ValidLogin>('shared/valid-login.json');

  test.afterEach(async ({ page }) => {
    await teardownSession(page);
  });

  test('Verify dashboard loads after successful login', async ({ page }) => {
    const loginPage = await setupLoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.loginAndReachDashboard(validLogin.username, validLogin.password);
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.verifyDashboardHeader();
  });

  test('Verify URL contains dashboard after login', async ({ page }) => {
    const loginPage = await setupLoginPage(page);

    await loginPage.loginAndReachDashboard(validLogin.username, validLogin.password);
    await expect(page).toHaveURL(/dashboard\/index/);
  });

  test('Verify logout returns user to login page', async ({ page }) => {
    const loginPage = await setupLoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.loginAndReachDashboard(validLogin.username, validLogin.password);
    await dashboardPage.verifyDashboardLoaded();
    await loginPage.logout();
    await loginPage.expectOnLoginPage();
    await expect(page).toHaveURL(/auth\/login/);
  });
});
