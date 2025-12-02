@echo off
echo ========================================
echo   Quick Routing Test
echo ========================================
echo.
echo This script will help diagnose routing issues.
echo.

cd server

echo Step 1: Checking database...
echo.

REM Check if database exists
if not exist geospatial.db (
    echo ERROR: Database file not found!
    echo Please run: npm run import:data
    echo.
    pause
    exit /b 1
)

echo Database found: geospatial.db
echo.

echo Step 2: Running diagnostic script...
echo.
call npm run check:routing

echo.
echo ========================================
echo   Diagnostic Complete!
echo ========================================
echo.
echo If you see roads and facilities above, the data is loaded correctly.
echo.
echo IMPORTANT: You MUST restart your backend server for changes to take effect!
echo.
echo To restart:
echo   1. Stop the current backend (Ctrl+C in the backend terminal)
echo   2. Run: npm run start:dev
echo   3. Wait for "Graph built with..." message
echo   4. Try routing again in the browser
echo.
pause
