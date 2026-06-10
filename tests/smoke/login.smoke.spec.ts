import { test } from '@playwright/test';
import { DashboardPage } from '../../pages/DashboardPage';
import { config } from '../../config/config';
import { setupLoginPage, teardownSession } from '../../utils/auth.helper';

/**
 * SMOKE SUITE — Member 1
 * Branch: smoke-testing
 * Purpose: Verify the application is reachable and login works.
 */
test.describe('Smoke — Login', { tag: ['@smoke'] }, () => {
  test.afterEach(async ({ page }) => {
    await teardownSession(page);
  });

  test('Valid login with Admin credentials', async ({ page }) => {
    const loginPage = await setupLoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.loginAndReachDashboard(
      config.credentials.username,
      config.credentials.password
    );
    await dashboardPage.verifyDashboardLoaded();
  });
});
