import { Page, expect } from '@playwright/test';
import { config } from '../config/config';
import testData from '../data/data.json';

/** Navigate to the login page and wait for the form to be ready. */
export async function navigateToLogin(page: Page): Promise<void> {
  await page.goto(config.paths.login, { waitUntil: 'commit', timeout: config.timeouts.navigation });
}

/** Navigate directly to the dashboard (unauthenticated). */
export async function navigateToDashboard(page: Page): Promise<void> {
  await page.goto(config.paths.dashboard, {
    waitUntil: 'commit',
    timeout: config.timeouts.navigation,
  });
}

/** Clear cookies and storage so each test starts with a clean session. */
export async function clearBrowserState(page: Page): Promise<void> {
  await page.context().clearCookies();
  await navigateToLogin(page);
  try {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  } catch {
    // Storage may be unavailable before origin is established.
  }
}

/** Assert the current URL contains the given fragment. */
export async function expectUrlContains(page: Page, fragment: string): Promise<void> {
  await expect(page).toHaveURL(new RegExp(fragment));
}

/** Load JSON test data for data-driven scenarios. */
export function loadTestData<T>(): T {
  return testData as T;
}
