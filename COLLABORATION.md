# Team Collaboration Guide

**Repository:** https://github.com/sricharan446/OrangeHrm-Testing

---

## Branching Strategy

```
main                  ← stable, production-ready code (protected)
├── smoke-testing     ← Member 1 — smoke suite only
├── sanity-testing    ← Member 2 — sanity suite only
└── regression-testing ← Member 3 — regression suite only
```

| Branch | Owner | Folder | When to merge |
|--------|-------|--------|---------------|
| `main` | Team lead / reviewer | All approved code | After PR approval |
| `smoke-testing` | Member 1 | `tests/smoke/` | Weekly or per sprint |
| `sanity-testing` | Member 2 | `tests/sanity/` | Weekly or per sprint |
| `regression-testing` | Member 3 (You) | `tests/regression/`, `data/regression/` | Weekly or per sprint |

### Rules

1. **Never commit directly to `main`** — always use Pull Requests.
2. **Each member only edits their own test folder** (+ shared `pages/`, `utils/`, `config/` with team agreement).
3. **Regression data stays in `data/regression/`** — do not place regression JSON in shared folders.
4. **Pull `main` before starting work** on your feature branch each day.
5. **Shared code changes** (pages, utils, config) require review from all members.

---

## Git Commands — Member 3 (Regression)

### 1. Clone the repository (fresh start)

```cmd
cd C:\Projects_2026
rmdir /s /q OrangeHrm-Testing
git clone https://github.com/sricharan446/OrangeHrm-Testing.git
cd OrangeHrm-Testing
npm install
npx.cmd playwright install chromium
```

### 2. Delete local experimental code (if migrating from old folder)

```cmd
cd C:\Projects_2026
rmdir /s /q Orangehrmlive
```

> Only run this after confirming your regression work is pushed to GitHub.

### 3. Pull latest code from main

```cmd
cd C:\Projects_2026\OrangeHrm-Testing
git checkout main
git pull origin main
```

### 4. Create regression-testing branch from latest main

```cmd
git checkout -b regression-testing
```

### 5. Commit only regression-related changes

```cmd
git add tests/regression/
git add data/regression/
git add pages/ utils/ config/ playwright.config.ts package.json README.md COLLABORATION.md
git status
git commit -m "feat(regression): add login and dashboard regression test suite"
```

### 6. Push branch to GitHub

```cmd
git push -u origin regression-testing
```

### 7. Create Pull Request into main

**Option A — GitHub website:**
1. Go to https://github.com/sricharan446/OrangeHrm-Testing
2. Click **Compare & pull request** for `regression-testing`
3. Title: `Regression Testing Suite — Login, Dashboard, Auth, Navigation`
4. Assign reviewers: Member 1 and Member 2
5. Click **Create pull request**

**Option B — GitHub CLI:**

```cmd
gh pr create --base main --head regression-testing --title "Regression Testing Suite" --body "## Summary\n- Login negative tests (data-driven)\n- Dashboard auth security tests\n- Navigation regression\n\n## Test plan\n- [ ] npm run test:regression"
```

---

## Collaboration Workflow

### Daily workflow (all members)

```cmd
git checkout main
git pull origin main
git checkout <your-branch>        REM smoke-testing | sanity-testing | regression-testing
git merge main                    REM resolve conflicts if any
npm run test:<your-suite>
git add .
git commit -m "test: describe your change"
git push origin <your-branch>
```

### Conflict resolution

1. **Test file conflicts** — each member owns their folder; conflicts should be rare.
2. **Shared file conflicts** (`pages/`, `utils/`, `config/`) — discuss in team chat, merge manually, run all three suites before PR.
3. **Never force-push to `main`.**

### Pull Request review checklist

- [ ] Only the correct test folder was modified (unless shared code agreed)
- [ ] `npm run test:smoke` passes (Member 1 verifies)
- [ ] `npm run test:sanity` passes (Member 2 verifies)
- [ ] `npm run test:regression` passes (Member 3 verifies)
- [ ] No `node_modules/`, `test-results/`, or `playwright-report/` committed
- [ ] HTML report generated locally and reviewed for failures

### When to merge into main

- All 3 suite owners approve the PR
- CI/local runs pass for smoke + sanity + regression
- No open review comments
- Merge using **Squash and merge** or **Merge commit** (team preference)
- Delete feature branch after merge

---

## Folder Ownership

| Path | Owner | Editable by |
|------|-------|-------------|
| `tests/smoke/` | Member 1 | Member 1 |
| `tests/sanity/` | Member 2 | Member 2 |
| `tests/regression/` | Member 3 | Member 3 |
| `data/regression/` | Member 3 | Member 3 |
| `data/shared/` | Team | All (with review) |
| `pages/` | Team | All (with review) |
| `utils/` | Team | All (with review) |
| `config/` | Team | All (with review) |
