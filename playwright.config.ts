import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for OrangeHRM Live automation.
 * - HTML report on every run
 * - Screenshot + trace captured on failure
 * - 1 retry to handle demo-site flakiness
 * - Chromium only (as required)
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  timeout: 90_000,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
