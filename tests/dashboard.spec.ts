import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { config } from '../config/config';
import { navigateToDashboard } from '../utils/helper';
import {
  setupLoginPage,
  setupAuthenticatedSession,
  teardownSession,
} from '../utils/auth.helper';

// ═══════════════════════════════════════════════════════════════
// DASHBOARD — POSITIVE (Sanity / Regression)
// Owner: Member 2 (@sanity), Member 3 (@regression)
// ═══════════════════════════════════════════════════════════════
test.describe('Dashboard - Positive Tests', () => {
  let auth: Awaited<ReturnType<typeof setupAuthenticatedSession>>;

  test.beforeEach(async ({ page }) => {
    auth = await setupAuthenticatedSession(page);
  });

  test.afterEach(async ({ page }) => {
    await teardownSession(page);
  });

  test('Verify dashboard header is displayed', { tag: ['@sanity', '@regression'] }, async () => {
    await auth.dashboardPage.verifyDashboardHeader();
  });

  test('Verify sidebar navigation is visible', { tag: ['@sanity', '@regression'] }, async () => {
    await auth.dashboardPage.verifySidebar();
  });

  test('Verify dashboard widgets are visible', { tag: ['@sanity', '@regression'] }, async () => {
    await auth.dashboardPage.verifyWidgets();
  });

  test('Verify profile menu is visible and opens', { tag: ['@sanity', '@regression'] }, async () => {
    await auth.dashboardPage.verifyProfileMenu();
  });

  // Member 3 — Regression: navigation flow via sidebar
  test('Sidebar Admin link navigates to Admin module', { tag: ['@regression'] }, async ({ page }) => {
    await auth.dashboardPage.adminSidebarLink.click();
    await expect(page).toHaveURL(/admin\/viewAdminModule/);
    await expect(page.getByRole('heading', { name: 'System Users' })).toBeVisible({
      timeout: 30_000,
    });
  });
});

// ═══════════════════════════════════════════════════════════════
// DASHBOARD — NEGATIVE (Regression only — Member 3)
// Authentication & session security scenarios
// ═══════════════════════════════════════════════════════════════
test.describe('Dashboard - Negative Tests', { tag: ['@regression'] }, () => {
  let auth: Awaited<ReturnType<typeof setupLoginPage>>;

  test.beforeEach(async ({ page }) => {
    auth = await setupLoginPage(page);
  });

  test.afterEach(async ({ page }) => {
    await teardownSession(page);
  });

  test('Access dashboard without login redirects to login page', async ({ page }) => {
    await navigateToDashboard(page);
    await auth.expectOnLoginPage();
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('Access dashboard after logout redirects to login', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await auth.loginAndReachDashboard(
      config.credentials.username,
      config.credentials.password
    );
    await dashboardPage.verifyDashboardLoaded();
    await auth.logout();
    await auth.expectOnLoginPage();

    await navigateToDashboard(page);
    await auth.expectOnLoginPage();
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('Browser back after logout does not restore authenticated session', async ({ page }) => {
    await auth.loginAndReachDashboard(
      config.credentials.username,
      config.credentials.password
    );

    await auth.logout();
    await auth.expectOnLoginPage();

    // Browser back may restore cached UI; session cookie is destroyed
    await page.goBack().catch(() => {});

    // Protected route must reject unauthenticated access
    await navigateToDashboard(page);
    await auth.expectOnLoginPage();
    await expect(page).toHaveURL(/auth\/login/);
  });
});
