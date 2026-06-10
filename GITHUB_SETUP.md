# Publish to GitHub — Madhavsrivastha12

Follow these steps to add this project to your GitHub account.

## Step 1 — Install Git (if not installed)

Download and install: https://git-scm.com/download/win

Verify installation:

```cmd
git --version
```

## Step 2 — Create Repository on GitHub

1. Sign in to https://github.com/Madhavsrivastha12
2. Click **+** → **New repository**
3. Settings:
   - **Repository name:** `orangehrmlive-automation`
   - **Description:** `Playwright TypeScript POM framework for OrangeHRM Live`
   - **Public** or **Private** (your choice)
   - **Do NOT** check "Add a README", ".gitignore", or "license" (this project already has them)
4. Click **Create repository**

## Step 3 — Push Code (Option A — Automated Script)

Open **Command Prompt** (not PowerShell if you have execution policy issues):

```cmd
cd C:\Projects_2026\Orangehrmlive
scripts\push-to-github.bat
```

## Step 3 — Push Code (Option B — Manual Commands)

Run in **Command Prompt** from the project folder:

```cmd
cd C:\Projects_2026\Orangehrmlive

git init
git branch -M main
git add .
git commit -m "feat: OrangeHRM Playwright POM framework with smoke, sanity, and regression tests"

git checkout -b regression-testing

git remote add origin https://github.com/Madhavsrivastha12/orangehrmlive-automation.git

git push -u origin regression-testing
git push -u origin main
```

When prompted, sign in with your GitHub credentials or Personal Access Token.

## Step 4 — Create Pull Request

After pushing `regression-testing` branch:

1. Go to https://github.com/Madhavsrivastha12/orangehrmlive-automation
2. Click **Compare & pull request**
3. Title: `Regression Testing Framework — OrangeHRM Automation`
4. Description:

```
## Summary
- Playwright TypeScript POM framework for OrangeHRM Live
- Tagged tests: @smoke, @sanity, @regression
- Member 3 regression coverage: Login, Dashboard, Navigation, Logout, Authentication

## Test plan
- [ ] npm install && npx playwright install chromium
- [ ] npm run test:regression
- [ ] npm run report
```

5. Click **Create pull request**

## Repository URL

After setup, your repo will be at:

**https://github.com/Madhavsrivastha12/orangehrmlive-automation**

## Authentication Tips

If `git push` fails with authentication errors:

1. Use a **Personal Access Token** instead of password
   - GitHub → Settings → Developer settings → Personal access tokens
2. Or install **GitHub CLI**: https://cli.github.com/
   ```cmd
   gh auth login
   gh repo create Madhavsrivastha12/orangehrmlive-automation --public --source=. --push
   ```
