@echo off
echo ========================================
echo   PostGIS Migration - Step 3: Migrate Data
echo ========================================
echo.

cd server

echo This will migrate all data from SQLite to PostgreSQL.
echo This may take 5-10 minutes for ~700,000 roads.
echo.
echo Make sure you have:
echo   1. Installed dependencies (1-install-dependencies.bat)
echo   2. Created PostGIS database (2-setup-database.bat)
echo   3. Created .env file from .env.example
echo.
pause

echo.
echo Starting migration...
call npm run migrate:postgis

echo.
echo ========================================
echo   Migration Complete!
echo ========================================
echo.
echo Next: Start the backend with PostGIS
echo   cd server
echo   npm run start:dev
echo.
pause
