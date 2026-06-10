import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { config } from '../config/config';
import { clearBrowserState } from './helper';

/** Reusable page instances for authenticated test flows. */
export interface AuthContext {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
}

/**
 * Fresh browser session on the login page.
 * Used by beforeEach hooks across all spec files.
 */
export async function setupLoginPage(page: Page): Promise<LoginPage> {
  await clearBrowserState(page);
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  return loginPage;
}

/**
 * Authenticated session — logs in as Admin and waits for dashboard.
 * Eliminates duplicate login boilerplate in dashboard specs.
 */
export async function setupAuthenticatedSession(page: Page): Promise<AuthContext> {
  const loginPage = await setupLoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.loginAndReachDashboard(
    config.credentials.username,
    config.credentials.password
  );
  await dashboardPage.verifyDashboardLoaded();

  return { loginPage, dashboardPage };
}

/** Tear down session cookies after each test. */
export async function teardownSession(page: Page): Promise<void> {
  await page.context().clearCookies();
}
