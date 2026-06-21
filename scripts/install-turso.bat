@echo off
echo ========================================
echo TURSO CLI INSTALLATION AND IMPORT
echo ========================================
echo.

echo Step 1: Installing Turso CLI...
echo Run this command in PowerShell (as Admin):
echo.
echo irm https://get.turso.tech/install.ps1 ^| iex
echo.
pause

echo.
echo Step 2: Login to Turso...
echo.
turso auth login
echo.
pause

echo.
echo Step 3: Creating database from file...
echo.
cd /d e:\GIT\NTHome\NTHome
turso db create nthome-prod --from-file database\database.db
echo.
pause

echo.
echo Step 4: Verify database...
echo.
turso db list
turso db show nthome-prod
echo.
pause

echo.
echo Step 5: Get connection details...
echo.
echo DATABASE_URL:
turso db show nthome-prod --url
echo.
echo AUTH_TOKEN:
turso db tokens create nthome-prod
echo.
echo ========================================
echo SAVE THESE VALUES FOR RAILWAY CONFIG
echo ========================================
pause
