@echo off
echo ========================================
echo   Importing District Boundaries
echo ========================================
echo.

cd server

echo Step 1: Running district import with ts-node...
call npm run import:districts
if %errorlevel% neq 0 (
    echo Failed to import districts
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Districts imported successfully!
echo ========================================
echo.
pause
