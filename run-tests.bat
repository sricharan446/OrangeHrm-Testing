@echo off
cd /d "%~dp0"
if "%1"=="smoke" (call npx.cmd playwright test tests/smoke & goto :eof)
if "%1"=="sanity" (call npx.cmd playwright test tests/sanity & goto :eof)
if "%1"=="regression" (call npx.cmd playwright test tests/regression & goto :eof)
call npx.cmd playwright test %*
