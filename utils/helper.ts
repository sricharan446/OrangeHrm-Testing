import { Page, expect } from '@playwright/test';
import { config } from '../config/config';
import * as fs from 'fs';
import * as path from 'path';

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

/** Load shared test data (smoke / sanity). */
export function loadSharedData<T>(relativePath: string): T {
  const filePath = path.join(__dirname, '..', 'data', relativePath);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

/** Load regression-only test data (Member 3). */
export function loadRegressionData<T>(relativePath: string): T {
  const filePath = path.join(__dirname, '..', 'data', relativePath);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}
