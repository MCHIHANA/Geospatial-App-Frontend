@echo off
echo ========================================
echo GeoAccess Setup Verification
echo ========================================
echo.

echo [1/5] Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed
echo.

echo [2/5] Checking npm installation...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)
echo ✓ npm is installed
echo.

echo [3/5] Checking database file...
if exist "server\geospatial.db" (
    echo ✓ Database file exists
    dir "server\geospatial.db" | findstr "geospatial.db"
) else (
    echo WARNING: Database file not found!
    echo The application will create a new empty database.
)
echo.

echo [4/5] Checking frontend dependencies...
if exist "node_modules" (
    echo ✓ Frontend dependencies installed
) else (
    echo Installing frontend dependencies...
    call npm install
)
echo.

echo [5/5] Checking backend dependencies...
if exist "server\node_modules" (
    echo ✓ Backend dependencies installed
) else (
    echo Installing backend dependencies...
    cd server
    call npm install
    cd ..
)
echo.

echo ========================================
echo Verification Complete!
echo ========================================
echo.
echo To start the application, run: start-dev.bat
echo.
pause
