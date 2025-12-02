@echo off
echo ========================================
echo   PostGIS Migration - Step 1: Install Dependencies
echo ========================================
echo.

cd server

echo Installing PostgreSQL driver and dotenv...
call npm install pg dotenv @types/pg

echo.
echo ========================================
echo   Dependencies Installed!
echo ========================================
echo.
echo Next: Run setup-database.bat
pause
