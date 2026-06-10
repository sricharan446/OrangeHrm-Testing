import { Locator, Page, expect } from '@playwright/test';
import { config } from '../config/config';

/**
 * Page Object for OrangeHRM Login page.
 * Locators verified on live app (OrangeHRM OS 5.8):
 * https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
 */
export class LoginPage {
  readonly page: Page;

  // --- Locators (from live DOM inspection) ---
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginHeading: Locator;
  readonly credentialHint: Locator;
  readonly forgotPasswordLink: Locator;
  readonly errorAlert: Locator;
  readonly validationErrors: Locator;
  readonly resetPasswordHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Role/placeholder locators — stable across OrangeHRM 5.x
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.loginHeading = page.getByRole('heading', { name: 'Login' });

    // Demo credential box: "Username : Admin" / "Password : admin123"
    this.credentialHint = page.getByText(/Username\s*:\s*Admin/i);

    // Forgot password — navigates to requestPasswordResetCode
    this.forgotPasswordLink = page.getByText('Forgot your password?');

    // Invalid login toast: class oxd-alert-content-text
    this.errorAlert = page.locator('.oxd-alert-content-text');

    // Empty field validation: class oxd-input-field-error-message
    this.validationErrors = page.locator('.oxd-input-field-error-message');

    // Reset Password page heading (Forgot Password flow)
    // Forgot-password page title — h6.orangehrm-forgot-password-title (live app)
    this.resetPasswordHeading = page.locator('h6.orangehrm-forgot-password-title');
  }

  /** Open the login page and wait for the form. */
  async goto(): Promise<void> {
    await this.page.goto(config.paths.login, {
      waitUntil: 'commit',
      timeout: config.timeouts.navigation,
    });
    await expect(this.loginButton).toBeVisible({ timeout: config.timeouts.navigation });
  }

  /** Verify all key login page elements are visible. */
  async verifyLoginPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/auth\/login/);
    await expect(this.loginHeading).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.forgotPasswordLink).toBeVisible();
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Click Login without waiting for navigation.
   * Invalid logins stay on the same page — no navigation event fires.
   */
  async clickLogin(): Promise<void> {
    await this.loginButton.click({ noWaitAfter: true });
  }

  /**
   * Perform a full login attempt and wait for the application response.
   * Outcome is one of: dashboard redirect, invalid-credentials alert, or validation errors.
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
    await this.waitForLoginResponse();
  }

  /** Wait until login attempt produces a visible UI response. */
  async waitForLoginResponse(): Promise<void> {
    await Promise.race([
      this.page.waitForURL(/dashboard\/index/, { timeout: config.timeouts.navigation }),
      this.errorAlert.waitFor({ state: 'visible', timeout: config.timeouts.navigation }),
      this.validationErrors.first().waitFor({ state: 'visible', timeout: config.timeouts.navigation }),
    ]).catch(() => {
      // Demo site may respond slowly; allow assertions in tests to surface the failure.
    });
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Login and wait until the dashboard is fully reachable (positive flows). */
  async loginAndReachDashboard(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
    await expect(this.page).toHaveURL(/dashboard\/index/, {
      timeout: config.timeouts.navigation,
    });
    await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({
      timeout: config.timeouts.navigation,
    });
  }

  /**
   * Logout flow verified on live app:
   * 1. Click profile dropdown (.oxd-userdropdown-tab)
   * 2. Click "Logout" menuitem
   * 3. Redirect to /auth/login
   */
  async logout(): Promise<void> {
    await this.page.locator('.oxd-userdropdown-tab').click();
    await this.page.getByRole('menuitem', { name: 'Logout' }).click();
    await expect(this.loginButton).toBeVisible({ timeout: config.timeouts.action });
  }

  /**
   * Forgot Password flow verified on live app:
   * Navigates to /auth/requestPasswordResetCode with "Reset Password" heading.
   */
  async openForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
    await expect(this.page).toHaveURL(/requestPasswordResetCode/, {
      timeout: config.timeouts.navigation,
    });
    await expect(this.resetPasswordHeading).toBeVisible({
      timeout: config.timeouts.action,
    });
  }

  /** Collect inline validation error messages (empty fields). */
  async getValidationErrors(): Promise<string[]> {
    await this.validationErrors.first().waitFor({ state: 'visible' });
    return this.validationErrors.allTextContents();
  }

  /** Assert user is on the login page. */
  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/auth\/login/);
    await expect(this.loginHeading).toBeVisible();
  }
}
