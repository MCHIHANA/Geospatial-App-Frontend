@echo off
echo Testing Backend API...
echo.

echo Starting backend server...
cd server
start "Backend Test" cmd /k "npm run start:dev"

echo Waiting for server to start (15 seconds)...
timeout /t 15 /nobreak > nul

echo.
echo Testing /facilities endpoint...
curl http://localhost:4000/facilities

echo.
echo.
echo Test complete! Check the output above.
echo Press any key to stop the server...
pause > nul

taskkill /FI "WINDOWTITLE eq Backend Test*" /T /F > nul 2>&1
