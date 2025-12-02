@echo off
echo Starting GeoAccess Application...
echo.

echo [1/2] Starting Backend Server (Port 4000)...
start "Backend Server" cmd /k "cd server && npm run start:dev"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend (Port 5173)...
start "Frontend Dev Server" cmd /k "npm run dev"

echo.
echo ========================================
echo GeoAccess Application Started!
echo ========================================
echo Backend:  http://localhost:4000
echo Frontend: http://localhost:5173
echo.
echo Press any key to stop all servers...
pause > nul

echo Stopping servers...
taskkill /FI "WINDOWTITLE eq Backend Server*" /T /F > nul 2>&1
taskkill /FI "WINDOWTITLE eq Frontend Dev Server*" /T /F > nul 2>&1
echo Servers stopped.
