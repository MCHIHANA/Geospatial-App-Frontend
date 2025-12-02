@echo off
echo ========================================
echo   PostGIS Migration - Step 2: Setup Database
echo ========================================
echo.

set PSQL="C:\Program Files\PostgreSQL\18\bin\psql.exe"

echo This will create the PostGIS database.
echo You will be prompted for the PostgreSQL password.
echo.
pause

%PSQL% -U postgres -f setup-database.sql

echo.
echo ========================================
echo   Database Setup Complete!
echo ========================================
echo.
echo Database: geospatial_db
echo User: geospatial_user  
echo Password: geospatial_password_2024
echo.
echo Next: Update .env file and run migration
pause
