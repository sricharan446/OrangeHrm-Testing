import { Locator, Page, expect } from '@playwright/test';
import { config } from '../config/config';

/**
 * Page Object for OrangeHRM Dashboard.
 * Locators verified on live app after login:
 * https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index
 */
export class DashboardPage {
  readonly page: Page;

  // --- Locators (from live DOM inspection) ---
  readonly dashboardHeader: Locator;
  readonly sidebar: Locator;
  readonly sidepanelNav: Locator;
  readonly profileMenu: Locator;
  readonly dashboardWidgets: Locator;
  readonly timeAtWorkWidget: Locator;
  readonly myActionsWidget: Locator;
  readonly quickLaunchWidget: Locator;
  readonly adminSidebarLink: Locator;
  readonly logoutMenuItem: Locator;

  constructor(page: Page) {
    this.page = page;

    // Top bar heading — role heading level 6, name "Dashboard"
    this.dashboardHeader = page.getByRole('heading', { name: 'Dashboard' });

    // Left sidebar — navigation "Sidepanel", class oxd-sidepanel
    this.sidebar = page.locator('.oxd-sidepanel');
    this.sidepanelNav = page.getByRole('navigation', { name: 'Sidepanel' });

    // Profile dropdown — class oxd-userdropdown-tab (contains profile picture img)
    this.profileMenu = page.locator('.oxd-userdropdown-tab');

    // Dashboard widget cards — class orangehrm-dashboard-widget (14 on live app)
    this.dashboardWidgets = page.locator('.orangehrm-dashboard-widget');
    this.timeAtWorkWidget = page
      .locator('.orangehrm-dashboard-widget')
      .filter({ hasText: 'Time at Work' })
      .first();
    this.myActionsWidget = page
      .locator('.orangehrm-dashboard-widget')
      .filter({ hasText: 'My Actions' })
      .first();
    this.quickLaunchWidget = page
      .locator('.orangehrm-dashboard-widget')
      .filter({ hasText: 'Quick Launch' })
      .first();

    // Sidebar module links — verified on live app (Sidepanel navigation)
    this.adminSidebarLink = page.getByRole('link', { name: 'Admin' });

    // Logout option inside profile dropdown menu
    this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });
  }

  /** Navigate directly to dashboard URL. */
  async goto(): Promise<void> {
    await this.page.goto(config.paths.dashboard, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Wait for dashboard to fully load after successful login.
   * Verifies URL, header, sidebar, and profile menu.
   */
  async verifyDashboardLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard\/index/, {
      timeout: config.timeouts.dashboardLoad,
    });
    await expect(this.dashboardHeader).toBeVisible({
      timeout: config.timeouts.dashboardLoad,
    });
    await expect(this.sidebar).toBeVisible();
    await expect(this.profileMenu).toBeVisible();
  }

  /** Verify dashboard header text. */
  async verifyDashboardHeader(): Promise<void> {
    await expect(this.dashboardHeader).toBeVisible();
    await expect(this.dashboardHeader).toHaveText('Dashboard');
  }

  /** Verify left sidebar navigation is visible. */
  async verifySidebar(): Promise<void> {
    await expect(this.sidepanelNav).toBeVisible();
    await expect(this.sidebar).toBeVisible();
  }

  /** Verify dashboard widget cards are rendered. */
  async verifyWidgets(): Promise<void> {
    await expect(this.dashboardWidgets.first()).toBeVisible();
    const count = await this.dashboardWidgets.count();
    expect(count).toBeGreaterThan(0);
    await expect(this.timeAtWorkWidget).toBeVisible();
    await expect(this.myActionsWidget).toBeVisible();
  }

  /** Open profile dropdown and verify it is visible. */
  async verifyProfileMenu(): Promise<void> {
    await expect(this.profileMenu).toBeVisible();
    await this.profileMenu.click();
    await expect(this.logoutMenuItem).toBeVisible();
  }
}
