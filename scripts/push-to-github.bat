@echo off
REM ============================================================
REM Push OrangeHRM Playwright Framework to GitHub
REM Account: https://github.com/Madhavsrivastha12
REM ============================================================

cd /d "%~dp0.."

where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not installed.
    echo Download Git for Windows: https://git-scm.com/download/win
    pause
    exit /b 1
)

set REPO_NAME=orangehrmlive-automation
set GITHUB_USER=Madhavsrivastha12
set BRANCH=regression-testing

echo.
echo [1/6] Initializing Git repository...
if not exist ".git" (
    git init
    git branch -M main
)

echo.
echo [2/6] Staging project files...
git add .
git status

echo.
echo [3/6] Creating commit...
git commit -m "feat: OrangeHRM Playwright POM framework with smoke, sanity, and regression tests"

echo.
echo [4/6] Creating branch %BRANCH%...
git checkout -b %BRANCH%

echo.
echo [5/6] Adding GitHub remote...
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git

echo.
echo [6/6] Pushing to GitHub...
echo NOTE: Create the repo first at https://github.com/new
echo       Repository name: %REPO_NAME%
echo       Visibility: Public or Private
echo       Do NOT add README, .gitignore, or license ^(already in project^)
echo.
pause
git push -u origin %BRANCH%
git push -u origin main

echo.
echo Done! Open: https://github.com/%GITHUB_USER%/%REPO_NAME%
pause
