import { test, expect } from '@playwright/test';
import { loadJSON } from './helpers/dataLoader';

test.describe('OrangeHRM Login Page - Negative Scenarios', () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto(
            'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
        );
        await page.waitForLoadState('networkidle');
    });

    const testData = loadJSON('users.json');
    const negativeCases = testData.negativeLoginCases;

    for (const testCase of negativeCases) {
        test(`Verify Negative Scenario: ${testCase.description}`, async ({ page }) => {
            console.log(`\n▶ Starting Test: ${testCase.description}`);

            // Wait for fields to be visible
            const usernameInput = page.locator('input[name="username"]');
            const passwordInput = page.locator('input[name="password"]');
            const submitButton = page.locator('button[type="submit"]');

            await expect(usernameInput).toBeVisible({ timeout: 10000 });
            await expect(passwordInput).toBeVisible({ timeout: 10000 });

            // Fill inputs (empty strings will just remain empty or be cleared)
            if (testCase.username !== "") {
                await usernameInput.fill(testCase.username);
            } else {
                await usernameInput.clear();
            }

            if (testCase.password !== "") {
                await passwordInput.fill(testCase.password);
            } else {
                await passwordInput.clear();
            }

            // Click submit
            await submitButton.click();

            // Depending on whether it requires a required field validation or invalid credentials alert
            let actualError = "";
            let expectedError = testCase.expectedError;

            if (testCase.requiresRequiredField) {
                // OrangeHRM displays a ".oxd-input-group__message" under empty fields
                if (testCase.emptyField === "username") {
                    const group = page.locator('div.oxd-input-group:has(label:has-text("Username"))');
                    const errorLocator = group.locator('span.oxd-input-group__message');
                    await expect(errorLocator).toContainText(expectedError, { timeout: 15000 });
                    actualError = (await errorLocator.textContent()) || "";
                } else if (testCase.emptyField === "password") {
                    const group = page.locator('div.oxd-input-group:has(label:has-text("Password"))');
                    const errorLocator = group.locator('span.oxd-input-group__message');
                    await expect(errorLocator).toContainText(expectedError, { timeout: 15000 });
                    actualError = (await errorLocator.textContent()) || "";
                } else if (testCase.emptyField === "both") {
                    const groupUser = page.locator('div.oxd-input-group:has(label:has-text("Username"))');
                    const errorUser = groupUser.locator('span.oxd-input-group__message');
                    const groupPass = page.locator('div.oxd-input-group:has(label:has-text("Password"))');
                    const errorPass = groupPass.locator('span.oxd-input-group__message');
                    
                    await expect(errorUser).toContainText(expectedError, { timeout: 15000 });
                    await expect(errorPass).toContainText(expectedError, { timeout: 15000 });
                    
                    const actualUserText = (await errorUser.textContent()) || "";
                    const actualPassText = (await errorPass.textContent()) || "";
                    actualError = actualUserText === actualPassText ? actualUserText : `${actualUserText} & ${actualPassText}`;
                }
            } else {
                // Invalid credentials alert banner
                const alertLocator = page.locator('.oxd-alert-content-text');
                await expect(alertLocator).toContainText(expectedError, { timeout: 15000 });
                actualError = (await alertLocator.textContent()) || "";
            }
            const actualUrl = page.url();

            // Print verification results
            console.log(`  Target credentials -> User: "${testCase.username}", Pass: "${testCase.password}"`);
            console.log(`  Expected URL path contains: "${testCase.expectedUrlPart}"`);
            console.log(`  Actual URL: "${actualUrl}"`);
            console.log(`  Expected Error: "${expectedError}"`);
            console.log(`  Actual Error: "${actualError}"`);

            // Assertions
            expect(actualUrl).toContain(testCase.expectedUrlPart);
            expect(actualError.trim()).toBe(expectedError.trim());

            console.log(`  ✓ Test Case Verified Successfully`);
        });
    }
});
