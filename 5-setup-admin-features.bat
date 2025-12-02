@echo off
echo ========================================
echo Admin Features Database Setup
echo ========================================
echo.

REM Load environment variables
if exist .env (
    for /f "tokens=1,2 delims==" %%a in (.env) do (
        set %%a=%%b
    )
)

echo Setting up admin features in database...
echo.

REM Run the SQL script
psql -U %DB_USER% -d %DB_NAME% -f 5-setup-admin-features.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Admin features setup completed successfully!
    echo ========================================
    echo.
    echo The following has been added:
    echo - Enhanced facilities table with address, capacity, and contact fields
    echo - Disaster zones table with sample data
    echo - Spatial indexes for performance
    echo - Helper functions and views
    echo - Admin audit log table
    echo.
    echo You can now use:
    echo - Admin Dashboard at /admin
    echo - Disaster Areas at /disasters
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Setup failed!
    echo ========================================
    echo Please check your database connection and try again.
    echo.
)

pause
