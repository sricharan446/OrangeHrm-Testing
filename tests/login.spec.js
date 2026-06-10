import { test, expect } from '@playwright/test';
test('OrangeHRM Login Test', async ({ page }) => {
    await page.goto(
        'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
    );
    await page.waitForLoadState('networkidle');
    await page.locator('input[name="username"]').fill('Admin');
    await page.locator('input[name="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/dashboard/);
    await expect(
        page.locator('h6')
    ).toContainText('Dashboard');
});