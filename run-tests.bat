@echo off
cd /d "%~dp0"
if "%1"=="smoke" (call npx.cmd playwright test --grep @smoke & goto :eof)
if "%1"=="sanity" (call npx.cmd playwright test --grep @sanity & goto :eof)
if "%1"=="regression" (call npx.cmd playwright test --grep @regression & goto :eof)
call npx.cmd playwright test %*
