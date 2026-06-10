import { test, expect } from '@playwright/test';
import { loadJSON } from './helpers/dataLoader';

test.beforeEach(async ({ page }) => {
    await page.goto(
        'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
    );
});

test('Verify username field - actual vs expected',
async ({ page }) => {
    const testData = loadJSON('users.json');
    const uiElements = testData.uiElements;

    const username = page.locator(uiElements.usernameInput.selector);
    
    const expected = {
        visible: true,
        enabled: true,
        type: uiElements.usernameInput.expectedType
    };

    const actual = {
        visible: await username.isVisible(),
        enabled: await username.isEnabled(),
        type: await username.getAttribute('type')
    };

    console.log(`\n✓ Username Field`);
    console.log(`  Expected: ${JSON.stringify(expected)}`);
    console.log(`  Actual: ${JSON.stringify(actual)}`);

    await expect(username).toBeVisible();
    await expect(username).toBeEnabled();
});

test('Verify password field - actual vs expected',
async ({ page }) => {
    const testData = loadJSON('users.json');
    const uiElements = testData.uiElements;

    const password = page.locator(uiElements.passwordInput.selector);

    const expected = {
        visible: true,
        enabled: true,
        type: uiElements.passwordInput.expectedType
    };

    const actual = {
        visible: await password.isVisible(),
        enabled: await password.isEnabled(),
        type: await password.getAttribute('type')
    };

    console.log(`\n✓ Password Field`);
    console.log(`  Expected: ${JSON.stringify(expected)}`);
    console.log(`  Actual: ${JSON.stringify(actual)}`);

    await expect(password).toBeVisible();
    await expect(password).toBeEnabled();
});

test('Verify login button - actual vs expected',
async ({ page }) => {
    const testData = loadJSON('users.json');
    const uiElements = testData.uiElements;

    const loginBtn = page.locator(uiElements.loginButton.selector);

    const expected = {
        visible: true,
        enabled: true,
        type: uiElements.loginButton.expectedType
    };

    const actual = {
        visible: await loginBtn.isVisible(),
        enabled: await loginBtn.isEnabled(),
        type: await loginBtn.getAttribute('type')
    };

    console.log(`\n✓ Login Button`);
    console.log(`  Expected: ${JSON.stringify(expected)}`);
    console.log(`  Actual: ${JSON.stringify(actual)}`);

    await expect(loginBtn).toBeVisible();
    await expect(loginBtn).toBeEnabled();
});

test('Verify forgot password link - actual vs expected',
async ({ page }) => {
    const testData = loadJSON('users.json');
    const uiElements = testData.uiElements;

    const forgotLink = page.locator(uiElements.forgotPasswordLink.selector);

    const expected = {
        visible: true,
        text: uiElements.forgotPasswordLink.expectedText
    };

    const actual = {
        visible: await forgotLink.isVisible(),
        text: await forgotLink.textContent()
    };

    console.log(`\n✓ Forgot Password Link`);
    console.log(`  Expected: ${JSON.stringify(expected)}`);
    console.log(`  Actual: ${JSON.stringify(actual)}`);

    await expect(forgotLink).toBeVisible();
});

test('Verify page title/heading - actual vs expected',
async ({ page }) => {
    const testData = loadJSON('users.json');
    const uiElements = testData.uiElements;

    const pageTitle = page.locator(uiElements.pageTitle.selector);

    const expected = {
        text: uiElements.pageTitle.expectedText
    };

    const actual = {
        text: await pageTitle.textContent()
    };

    console.log(`\n✓ Page Title`);
    console.log(`  Expected: ${JSON.stringify(expected)}`);
    console.log(`  Actual: ${JSON.stringify(actual)}`);

    await expect(pageTitle).toContainText(expected.text);
});

test('Data-driven Login - actual result matches expected result',
async ({ page }) => {
    const testData = loadJSON('users.json');
    
    for (const loginCase of testData.loginCases) {
        console.log(`\n▶ Testing login for user: ${loginCase.username}`);

        await page.goto(
            'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
            { waitUntil: 'networkidle' }
        );

        // Wait for fields to be ready
        await page.locator('input[name="username"]').waitFor({ state: 'visible', timeout: 10000 });
        await page.locator('input[name="password"]').waitFor({ state: 'visible', timeout: 10000 });

        await page.locator('input[name="username"]').fill(loginCase.username);
        await page.locator('input[name="password"]').fill(loginCase.password);
        await page.locator('button[type="submit"]').click();

        // Wait for navigation after login
        await page.waitForNavigation({ timeout: 15000 }).catch(() => {});

        const actualUrl = page.url();
        
        console.log(`  Expected URL contains: ${loginCase.expectedUrlPart}`);
        console.log(`  Actual URL: ${actualUrl}`);

        await expect(page).toHaveURL(new RegExp(loginCase.expectedUrlPart));
        
        console.log(`  ✓ Login successful for ${loginCase.username}`);
    }
});

test('Verify Forgot Password button navigation - actual vs expected',
async ({ page }) => {
    const testData = loadJSON('users.json');
    const forgotExpected = testData.forgotPasswordExpected;

    console.log(`\n▶ Testing Forgot Password navigation`);

    await page.locator('text=Forgot your password?').click();

    const actualUrl = page.url();
    const actualHeading = await page.locator('h6').textContent();

    console.log(`  Expected URL contains: ${forgotExpected.expectedUrl}`);
    console.log(`  Actual URL: ${actualUrl}`);
    console.log(`  Expected Heading: ${forgotExpected.expectedHeading}`);
    console.log(`  Actual Heading: ${actualHeading}`);

    await expect(page).toHaveURL(new RegExp(forgotExpected.expectedUrl));
    await expect(page.locator('h6')).toContainText(forgotExpected.expectedHeading);
    
    console.log(`  ✓ Forgot Password navigation successful`);
});