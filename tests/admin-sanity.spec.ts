import { test, expect, Page } from '@playwright/test';
import { loadJSON } from './helpers/dataLoader';
import { loginAsAdmin } from './helpers/loginHelper';

test.describe.configure({ mode: 'serial' });

test.describe('OrangeHRM Admin Page - Sanity Test Suite (~20 cases)', () => {
    let sharedPage: Page;
    const testData = loadJSON('adminTestData.json');
    const selectors = testData.selectors;
    const expected = testData.expectedData;

    test.beforeAll(async ({ browser }) => {
        // Create a single page context to share across all serial tests
        sharedPage = await browser.newPage();
        // Login once using the helper
        await loginAsAdmin(sharedPage);
    });

    test.afterAll(async () => {
        await sharedPage.close();
    });

    test('1. Navigate to Admin page via side menu', async () => {
        console.log('\n▶ Case 1: Navigate to Admin page');
        const adminLink = sharedPage.locator(selectors.adminSidebarLink);
        await expect(adminLink).toBeVisible({ timeout: 10000 });
        await adminLink.click();
        
        await sharedPage.waitForURL(new RegExp(expected.systemUsersUrlPart), { timeout: 15000 });
        const actualUrl = sharedPage.url();
        console.log(`  Expected URL path to contain: ${expected.systemUsersUrlPart}`);
        console.log(`  Actual URL: ${actualUrl}`);
        expect(actualUrl).toContain(expected.systemUsersUrlPart);
    });

    test('2. Verify Admin page header text', async () => {
        console.log('\n▶ Case 2: Verify Admin header text');
        const header = sharedPage.locator(selectors.topbarHeader);
        await expect(header).toBeVisible({ timeout: 5000 });
        const actualHeader = await header.textContent();
        console.log(`  Expected Header: ${expected.headerText}`);
        console.log(`  Actual Header: ${actualHeader}`);
        expect(actualHeader?.trim()).toBe(expected.headerText);
    });

    test('3. Verify "System Users" search panel is visible', async () => {
        console.log('\n▶ Case 3: Verify System Users search panel');
        const searchForm = sharedPage.locator('.oxd-table-filter');
        await expect(searchForm).toBeVisible({ timeout: 5000 });
        console.log('  ✓ Search panel is visible');
    });

    test('4. Verify Username search field exists and is enabled', async () => {
        console.log('\n▶ Case 4: Verify Username search field');
        const usernameInput = sharedPage.locator(selectors.searchUsernameInput);
        await expect(usernameInput).toBeVisible({ timeout: 5000 });
        await expect(usernameInput).toBeEnabled();
        console.log('  ✓ Username search field is visible and enabled');
    });

    test('5. Verify User Role dropdown exists', async () => {
        console.log('\n▶ Case 5: Verify User Role dropdown');
        const roleDropdown = sharedPage.locator(selectors.searchUserRoleDropdown);
        await expect(roleDropdown).toBeVisible({ timeout: 5000 });
        console.log('  ✓ User Role dropdown is visible');
    });

    test('6. Verify Employee Name field exists', async () => {
        console.log('\n▶ Case 6: Verify Employee Name field');
        const employeeInput = sharedPage.locator(selectors.searchEmployeeNameInput);
        await expect(employeeInput).toBeVisible({ timeout: 5000 });
        console.log('  ✓ Employee Name field is visible');
    });

    test('7. Verify Status dropdown exists', async () => {
        console.log('\n▶ Case 7: Verify Status dropdown');
        const statusDropdown = sharedPage.locator(selectors.searchStatusDropdown);
        await expect(statusDropdown).toBeVisible({ timeout: 5000 });
        console.log('  ✓ Status dropdown is visible');
    });

    test('8. Verify "Search" button is visible and clickable', async () => {
        console.log('\n▶ Case 8: Verify Search button');
        const searchBtn = sharedPage.locator(selectors.searchSubmitBtn);
        await expect(searchBtn).toBeVisible({ timeout: 5000 });
        await expect(searchBtn).toBeEnabled();
        console.log('  ✓ Search button is visible and enabled');
    });

    test('9. Verify "Reset" button is visible and clickable', async () => {
        console.log('\n▶ Case 9: Verify Reset button');
        const resetBtn = sharedPage.locator(selectors.searchResetBtn);
        await expect(resetBtn).toBeVisible({ timeout: 5000 });
        await expect(resetBtn).toBeEnabled();
        console.log('  ✓ Reset button is visible and enabled');
    });

    test('10. Search with valid username "Admin"', async () => {
        console.log('\n▶ Case 10: Search valid username');
        const usernameInput = sharedPage.locator(selectors.searchUsernameInput);
        await usernameInput.fill(expected.validSearchUser);
        
        const searchBtn = sharedPage.locator(selectors.searchSubmitBtn);
        await searchBtn.click();
        
        // Wait for table to load
        await sharedPage.waitForTimeout(2000); 
        const rows = sharedPage.locator(selectors.tableRow);
        const count = await rows.count();
        console.log(`  Search input: "${expected.validSearchUser}"`);
        console.log(`  Expected matching records count: >= 1`);
        console.log(`  Actual matching records count: ${count}`);
        expect(count).toBeGreaterThanOrEqual(1);
    });

    test('11. Search with invalid username "zzz_nonexistent"', async () => {
        console.log('\n▶ Case 11: Search invalid username');
        const usernameInput = sharedPage.locator(selectors.searchUsernameInput);
        await usernameInput.fill(expected.invalidSearchUser);
        
        const searchBtn = sharedPage.locator(selectors.searchSubmitBtn);
        await searchBtn.click();
        
        await sharedPage.waitForTimeout(2000);
        const msgLocator = sharedPage.locator(selectors.noRecordsFoundMessage).first();
        await expect(msgLocator).toBeVisible({ timeout: 5000 });
        console.log(`  Search input: "${expected.invalidSearchUser}"`);
        console.log(`  Expected outcome: "No Records Found" message`);
        console.log(`  Actual outcome: Message is visible`);
    });

    test('12. Reset search filters after a search', async () => {
        console.log('\n▶ Case 12: Reset search filters');
        const resetBtn = sharedPage.locator(selectors.searchResetBtn);
        await resetBtn.click();
        
        await sharedPage.waitForTimeout(2000);
        const usernameInput = sharedPage.locator(selectors.searchUsernameInput);
        const actualValue = await usernameInput.inputValue();
        console.log(`  Expected username input value after Reset: ""`);
        console.log(`  Actual username input value: "${actualValue}"`);
        expect(actualValue).toBe('');
    });

    test('13. Verify records table headers', async () => {
        console.log('\n▶ Case 13: Verify records table headers');
        const headerContainer = sharedPage.locator(selectors.tableHeader);
        await expect(headerContainer).toBeVisible({ timeout: 5000 });
        
        const headerText = await headerContainer.textContent() || "";
        console.log(`  Expected table headers to contain: ${JSON.stringify(expected.tableHeaders)}`);
        console.log(`  Actual table text content: "${headerText.replace(/\s+/g, ' ')}"`);
        
        for (const colHeader of expected.tableHeaders) {
            expect(headerText).toContain(colHeader);
        }
    });

    test('14. Verify "Add" button is visible', async () => {
        console.log('\n▶ Case 14: Verify Add button is visible');
        const addBtn = sharedPage.locator(selectors.addButton);
        await expect(addBtn).toBeVisible({ timeout: 5000 });
        console.log('  ✓ Add button is visible');
    });

    test('15. Click "Add" button and verify navigation', async () => {
        console.log('\n▶ Case 15: Click Add and verify navigation');
        const addBtn = sharedPage.locator(selectors.addButton);
        await addBtn.click();
        
        await sharedPage.waitForURL(/.*saveSystemUser.*/, { timeout: 10000 });
        const actualUrl = sharedPage.url();
        console.log(`  Expected URL path to contain: "saveSystemUser"`);
        console.log(`  Actual URL: ${actualUrl}`);
        expect(actualUrl).toContain('saveSystemUser');
    });

    test('16. Verify Add User form fields exist', async () => {
        console.log('\n▶ Case 16: Verify Add User form fields');
        const formSelectors = selectors.addUserForm;
        
        await expect(sharedPage.locator(formSelectors.userRoleDropdown)).toBeVisible({ timeout: 5000 });
        await expect(sharedPage.locator(formSelectors.employeeNameInput)).toBeVisible({ timeout: 5000 });
        await expect(sharedPage.locator(formSelectors.statusDropdown)).toBeVisible({ timeout: 5000 });
        await expect(sharedPage.locator(formSelectors.usernameInput)).toBeVisible({ timeout: 5000 });
        await expect(sharedPage.locator(formSelectors.passwordInput)).toBeVisible({ timeout: 5000 });
        await expect(sharedPage.locator(formSelectors.confirmPasswordInput)).toBeVisible({ timeout: 5000 });
        
        console.log('  ✓ All 6 user creation input fields are visible');
    });

    test('17. Cancel add user and return to listing', async () => {
        console.log('\n▶ Case 17: Cancel add user');
        const cancelBtn = sharedPage.locator(selectors.cancelButton);
        await cancelBtn.click();
        
        await sharedPage.waitForURL(new RegExp(expected.systemUsersUrlPart), { timeout: 10000 });
        const actualUrl = sharedPage.url();
        console.log(`  Expected URL path after Cancel: ${expected.systemUsersUrlPart}`);
        console.log(`  Actual URL: ${actualUrl}`);
        expect(actualUrl).toContain(expected.systemUsersUrlPart);
    });

    test('18. Verify Admin top-level menu tabs', async () => {
        console.log('\n▶ Case 18: Verify Admin top menu tabs');
        const tabs = selectors.tabs;
        
        await expect(sharedPage.locator(tabs.userManagement)).toBeVisible({ timeout: 5000 });
        await expect(sharedPage.locator(tabs.job)).toBeVisible({ timeout: 5000 });
        await expect(sharedPage.locator(tabs.organization)).toBeVisible({ timeout: 5000 });
        await expect(sharedPage.locator(tabs.qualifications)).toBeVisible({ timeout: 5000 });
        await expect(sharedPage.locator(tabs.nationalities)).toBeVisible({ timeout: 5000 });
        await expect(sharedPage.locator(tabs.corporateBranding)).toBeVisible({ timeout: 5000 });
        await expect(sharedPage.locator(tabs.configuration)).toBeVisible({ timeout: 5000 });
        
        console.log('  ✓ Top-level navigation tabs are visible');
    });

    test('19. Navigate to "Job > Job Titles" sub-menu', async () => {
        console.log('\n▶ Case 19: Navigate to Job Titles sub-menu');
        const jobTab = sharedPage.locator(selectors.tabs.job);
        await jobTab.click();
        
        const jobTitlesLink = sharedPage.locator(selectors.jobSubmenus.jobTitles);
        await expect(jobTitlesLink).toBeVisible({ timeout: 5000 });
        await jobTitlesLink.click();
        
        await sharedPage.waitForURL(new RegExp(expected.jobTitlesUrlPart), { timeout: 10000 });
        const actualUrl = sharedPage.url();
        console.log(`  Expected URL path to contain: ${expected.jobTitlesUrlPart}`);
        console.log(`  Actual URL: ${actualUrl}`);
        expect(actualUrl).toContain(expected.jobTitlesUrlPart);
    });

    test('20. Navigate back to "User Management" from Job Titles', async () => {
        console.log('\n▶ Case 20: Navigate back to User Management');
        const userMngTab = sharedPage.locator(selectors.tabs.userManagement);
        await userMngTab.click();
        
        // Wait for sub-menu or auto navigation to default User Management listing
        await sharedPage.waitForTimeout(1000);
        // Click on "Users" dropdown option if User Management tab has a dropdown, or it auto-navigates.
        // Usually, in OrangeHRM, clicking User Management tab header navigates to viewSystemUsers, or we can click the "Users" submenu option.
        // Let's see: click the dropdown item "Users" if it's there, or just click the Sidebar Admin link.
        // Let's use Sidebar Admin link as a robust backup, or click userManagement tab.
        await sharedPage.locator(selectors.adminSidebarLink).click();
        
        await sharedPage.waitForURL(new RegExp(expected.systemUsersUrlPart), { timeout: 10000 });
        const actualUrl = sharedPage.url();
        console.log(`  Expected URL path: ${expected.systemUsersUrlPart}`);
        console.log(`  Actual URL: ${actualUrl}`);
        expect(actualUrl).toContain(expected.systemUsersUrlPart);
    });
});
