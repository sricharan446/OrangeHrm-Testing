import { Page, expect } from '@playwright/test';

/**
 * Reusable helper function to log in to OrangeHRM as Admin and wait for the Dashboard page.
 * @param page Playwright Page instance
 */
export async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  
  // Wait for the login fields to be visible
  const usernameInput = page.locator('input[name="username"]');
  const passwordInput = page.locator('input[name="password"]');
  const loginButton = page.locator('button[type="submit"]');

  await expect(usernameInput).toBeVisible({ timeout: 30000 });
  await expect(passwordInput).toBeVisible({ timeout: 30000 });

  // Fill credentials
  await usernameInput.fill('Admin');
  await passwordInput.fill('admin123');
  
  // Submit the form
  await loginButton.click();

  // Wait for successful navigation to the Dashboard
  await page.waitForURL(/.*dashboard.*/, { timeout: 30000 });
  
  // Wait for the top navigation dashboard header to confirm page load
  await expect(page.locator('h6')).toContainText('Dashboard', { timeout: 30000 });
}
