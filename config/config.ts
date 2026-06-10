/**
 * Central configuration for OrangeHRM Live automation.
 * Base URL and paths verified against: https://opensource-demo.orangehrmlive.com/
 */
export const config = {
  baseUrl: 'https://opensource-demo.orangehrmlive.com/',
  credentials: {
    username: 'Admin',
    password: 'admin123',
  },
  paths: {
    login: 'web/index.php/auth/login',
    dashboard: 'web/index.php/dashboard/index',
    forgotPassword: 'web/index.php/auth/requestPasswordResetCode',
  },
  timeouts: {
    action: 30_000,
    navigation: 60_000,
    dashboardLoad: 60_000,
  },
} as const;
