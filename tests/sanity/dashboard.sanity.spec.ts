import { test } from '@playwright/test';
import { setupAuthenticatedSession, teardownSession } from '../../utils/auth.helper';

/**
 * SANITY SUITE — Member 2
 * Branch: sanity-testing
 * Purpose: Verify dashboard UI elements after authenticated login.
 */
test.describe('Sanity — Dashboard', { tag: ['@sanity'] }, () => {
  test.afterEach(async ({ page }) => {
    await teardownSession(page);
  });

  test('Verify dashboard header is displayed', async ({ page }) => {
    const { dashboardPage } = await setupAuthenticatedSession(page);
    await dashboardPage.verifyDashboardHeader();
  });

  test('Verify sidebar navigation is visible', async ({ page }) => {
    const { dashboardPage } = await setupAuthenticatedSession(page);
    await dashboardPage.verifySidebar();
  });

  test('Verify dashboard widgets are visible', async ({ page }) => {
    const { dashboardPage } = await setupAuthenticatedSession(page);
    await dashboardPage.verifyWidgets();
  });

  test('Verify profile menu is visible and opens', async ({ page }) => {
    const { dashboardPage } = await setupAuthenticatedSession(page);
    await dashboardPage.verifyProfileMenu();
  });
});
