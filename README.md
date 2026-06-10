# OrangeHRM Testing — Playwright + TypeScript

Playwright automation framework using **Page Object Model (POM)** for [OrangeHRM Live Demo](https://opensource-demo.orangehrmlive.com/).

**Repository:** https://github.com/sricharan446/OrangeHrm-Testing

---

## Team Ownership

| Member | Role | Branch | Test Folder | Run Command |
|--------|------|--------|-------------|-------------|
| **Member 1** | Smoke Testing | `smoke-testing` | `tests/smoke/` | `npm run test:smoke` |
| **Member 2** | Sanity Testing | `sanity-testing` | `tests/sanity/` | `npm run test:sanity` |
| **Member 3 (You)** | Regression Testing | `regression-testing` | `tests/regression/` | `npm run test:regression` |

### Smoke Testing Owner — Member 1
- **Goal:** Confirm the app is up and login works.
- **Tests:** 1 critical-path login test.
- **Branch:** `smoke-testing`

### Sanity Testing Owner — Member 2
- **Goal:** Verify core positive flows after login.
- **Tests:** Login routing, logout, dashboard UI (header, sidebar, widgets, profile).
- **Branch:** `sanity-testing`

### Regression Testing Owner — Member 3 (You)
- **Goal:** Full coverage of login negatives, authentication security, navigation, and edge cases.
- **Tests:** 10 regression tests + data-driven invalid logins.
- **Branch:** `regression-testing`
- **Data:** `data/regression/invalid-logins.json`

---

## Folder Structure

```
OrangeHrm-Testing/
├── config/
│   └── config.ts                 # Shared: base URL, credentials, timeouts
├── data/
│   ├── shared/
│   │   └── valid-login.json      # Shared valid credentials (smoke/sanity)
│   └── regression/
│       └── invalid-logins.json   # Regression-only negative test data
├── pages/                        # Shared Page Objects
│   ├── LoginPage.ts
│   └── DashboardPage.ts
├── tests/
│   ├── smoke/                    # Member 1 — isolated smoke suite
│   │   └── login.smoke.spec.ts
│   ├── sanity/                   # Member 2 — isolated sanity suite
│   │   ├── login.sanity.spec.ts
│   │   └── dashboard.sanity.spec.ts
│   └── regression/                 # Member 3 — isolated regression suite
│       ├── login.regression.spec.ts
│       └── dashboard.regression.spec.ts
├── utils/                        # Shared utilities
│   ├── helper.ts
│   └── auth.helper.ts
├── playwright.config.ts
├── COLLABORATION.md              # Branching strategy & Git workflow
├── package.json
└── README.md
```

---

## Prerequisites

```cmd
npm install
npx.cmd playwright install chromium
```

---

## How to Run Each Suite

### Smoke (Member 1)

```cmd
npm run test:smoke
```

### Sanity (Member 2)

```cmd
npm run test:sanity
```

### Regression (Member 3)

```cmd
npm run test:regression
```

### All Tests

```cmd
npm test
```

### Generate HTML Report

```cmd
npm run report
```

| Artifact | Path |
|----------|------|
| HTML Report | `playwright-report/index.html` |
| Screenshots (on failure) | `test-results/<test-name>/test-failed-1.png` |
| Traces (on failure) | `test-results/<test-name>/trace.zip` |

---

## Regression Test Summary (Member 3)

| Category | Count | Module |
|----------|-------|--------|
| Login negative (data-driven) | 6 | Login |
| Forgot password flow | 1 | Login / Auth |
| Admin sidebar navigation | 1 | Dashboard / Navigation |
| Unauthenticated access | 1 | Authentication |
| Post-logout access | 1 | Logout / Auth |
| Browser back after logout | 1 | Authentication |
| **Total regression** | **11** | |

---

## Collaboration

See **[COLLABORATION.md](COLLABORATION.md)** for:
- Git branching strategy
- Daily workflow
- Conflict resolution
- Pull Request process

---

## Configuration

- **Base URL:** `https://opensource-demo.orangehrmlive.com/`
- **Credentials:** `Admin` / `admin123`
- **Browser:** Chromium
- **Retries:** 1 (demo-site flakiness)
- **Screenshot:** on failure
- **Trace:** retained on failure
