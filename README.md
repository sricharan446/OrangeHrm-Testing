# OrangeHRM Live — Playwright Automation Framework

Playwright TypeScript automation framework using the **Page Object Model (POM)** for [OrangeHRM Live Demo](https://opensource-demo.orangehrmlive.com/).

## Team Responsibilities

| Member | Role | Tag | Scope |
|--------|------|-----|-------|
| Member 1 | Smoke Testing | `@smoke` | Critical path — app is up and login works |
| Member 2 | Sanity Testing | `@sanity` | Core positive flows — login, dashboard, logout |
| Member 3 | Regression Testing | `@regression` | Full coverage — positives, negatives, auth, navigation |

## Project Overview

- **Target App:** OrangeHRM OS 5.8 (Live Demo)
- **Base URL:** `https://opensource-demo.orangehrmlive.com/`
- **Credentials:** `Admin` / `admin123`
- **Browser:** Chromium
- **Pattern:** Page Object Model with data-driven negative tests

## Folder Structure

```
Orangehrmlive/
├── config/
│   └── config.ts              # Base URL, credentials, paths, timeouts
├── data/
│   └── data.json              # Data-driven login test data
├── pages/
│   ├── LoginPage.ts           # Login, logout, forgot password POM
│   └── DashboardPage.ts       # Dashboard, sidebar, widgets POM
├── tests/
│   ├── login.spec.ts          # Login positive & negative tests
│   └── dashboard.spec.ts      # Dashboard positive & negative tests
├── utils/
│   ├── helper.ts              # Navigation & test data utilities
│   └── auth.helper.ts         # Reusable auth session setup
├── playwright.config.ts       # Playwright config (HTML report, traces)
├── package.json
├── run-tests.bat              # Windows batch runner
└── README.md
```

## Prerequisites

```powershell
cd C:\Projects_2026\Orangehrmlive
npm install
npx.cmd playwright install chromium
```

## How to Run Tests

> **PowerShell note:** Use `npm.cmd` or `npx.cmd` if script execution policy blocks `.ps1` files.

### All Tests

```powershell
npm.cmd test
# or
npx.cmd playwright test
# or
.\run-tests.bat
```

### Smoke Tests (Member 1)

```powershell
npm.cmd run test:smoke
# or
npx.cmd playwright test --grep @smoke
# or
.\run-tests.bat smoke
```

### Sanity Tests (Member 2)

```powershell
npm.cmd run test:sanity
# or
npx.cmd playwright test --grep @sanity
# or
.\run-tests.bat sanity
```

### Regression Tests (Member 3)

```powershell
npm.cmd run test:regression
# or
npx.cmd playwright test --grep @regression
# or
.\run-tests.bat regression
```

### Run by Module

```powershell
npm.cmd run test:login
npm.cmd run test:dashboard
```

### Headed / UI Mode

```powershell
npm.cmd run test:headed
npm.cmd run test:ui
```

## How to Generate Reports

After any test run:

```powershell
npm.cmd run report
# or
npx.cmd playwright show-report
```

| Artifact | Path |
|----------|------|
| HTML Report | `playwright-report/index.html` |
| Failure Screenshots | `test-results/<test-name>/test-failed-1.png` |
| Failure Traces | `test-results/<test-name>/trace.zip` |

View a trace file:

```powershell
npx.cmd playwright show-trace test-results\<folder>\trace.zip
```

## Test Tag Reference

### @smoke (1 test)
- Valid login with Admin credentials

### @sanity (8 tests)
- Valid login, dashboard load, URL verification, logout
- Dashboard header, sidebar, widgets, profile menu

### @regression (19 tests — full suite)
- All smoke + sanity tests
- Forgot password flow
- 6 data-driven negative login tests
- Sidebar Admin navigation
- 3 authentication/security negative tests

## Publish to GitHub

See **[GITHUB_SETUP.md](GITHUB_SETUP.md)** for step-by-step instructions to push this project to:

**https://github.com/Madhavsrivastha12/orangehrmlive-automation**

Quick start (after installing Git):

```cmd
cd C:\Projects_2026\Orangehrmlive
scripts\push-to-github.bat
```

## Configuration

Key settings in `playwright.config.ts`:

- HTML reporter enabled
- Screenshot on failure
- Trace retained on failure
- 1 retry for demo-site flakiness
- Single worker (sequential execution)
