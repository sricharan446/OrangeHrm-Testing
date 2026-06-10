import { defineConfig, devices } from '@playwright/test';

/**
 * OrangeHRM Testing — Playwright configuration
 * Repository: https://github.com/sricharan446/OrangeHrm-Testing
 *
 * Test suites are isolated by folder:
 *   tests/smoke/       → Member 1 (smoke-testing branch)
 *   tests/sanity/      → Member 2 (sanity-testing branch)
 *   tests/regression/  → Member 3 (regression-testing branch)
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
