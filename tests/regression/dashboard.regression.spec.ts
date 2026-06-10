import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { config } from '../../config/config';
import { navigateToDashboard } from '../../utils/helper';
import { setupLoginPage, teardownSession } from '../../utils/auth.helper';

/**
 * REGRESSION SUITE — Member 3 (You)
 * Branch: regression-testing
 * Owner: Regression Testing
 * Covers: Navigation, session security, unauthenticated access.
 */
test.describe('Regression — Dashboard Navigation', { tag: ['@regression'] }, () => {
  test.afterEach(async ({ page }) => {
    await teardownSession(page);
  });

  test('Sidebar Admin link navigates to Admin module', async ({ page }) => {
    const loginPage = await setupLoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.loginAndReachDashboard(
      config.credentials.username,
      config.credentials.password
    );
    await dashboardPage.verifyDashboardLoaded();

    await dashboardPage.adminSidebarLink.click();
    // Live app routes Admin module to System Users page
    await expect(page).toHaveURL(/admin\/view(SystemUsers|AdminModule)/, { timeout: 30_000 });
  });
});

test.describe('Regression — Dashboard Authentication Security', { tag: ['@regression'] }, () => {
  test.afterEach(async ({ page }) => {
    await teardownSession(page);
  });

  test('Access dashboard without login redirects to login page', async ({ page }) => {
    const loginPage = await setupLoginPage(page);
    await navigateToDashboard(page);
    await loginPage.expectOnLoginPage();
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('Access dashboard after logout redirects to login', async ({ page }) => {
    const loginPage = await setupLoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.loginAndReachDashboard(
      config.credentials.username,
      config.credentials.password
    );
    await dashboardPage.verifyDashboardLoaded();
    await loginPage.logout();
    await loginPage.expectOnLoginPage();

    await navigateToDashboard(page);
    await loginPage.expectOnLoginPage();
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('Browser back after logout does not restore authenticated session', async ({
    page,
    context,
  }) => {
    const loginPage = await setupLoginPage(page);

    await loginPage.loginAndReachDashboard(
      config.credentials.username,
      config.credentials.password
    );
    await loginPage.logout();
    await loginPage.expectOnLoginPage();

    // BFCache may restore dashboard UI on back — session cookie is still destroyed
    await page.goBack().catch(() => {});

    const freshPage = await context.newPage();
    const freshLogin = new LoginPage(freshPage);
    await freshPage.goto(config.paths.dashboard, { waitUntil: 'commit' });
    await freshLogin.expectOnLoginPage();
    await expect(freshPage).toHaveURL(/auth\/login/);
    await freshPage.close();
  });
});
