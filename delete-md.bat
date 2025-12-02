@echo off
echo This will delete all .md files recursively from the current folder and subfolders.
set /p CONFIRM=Type Y to proceed: 
if /I not "%CONFIRM%"=="Y" (
  echo Aborted.
  exit /b 1
)
for /R %%f in (*.md) do del /F /Q "%%f"
echo Done.
