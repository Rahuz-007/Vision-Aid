@echo off
REM VisionAid Production Build Script (Windows)
REM This script builds both frontend and backend for production

echo.
echo ====================================
echo   Vision Aid Production Build
echo ====================================
echo.

REM Check Node.js version
echo Checking prerequisites...
node -v
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js
    pause
    exit /b 1
)

echo.
echo ====================================
echo   Building Frontend
echo ====================================
echo.

cd "front -end\vision-aid-ui"

REM Clean previous build
if exist "build" (
    echo Cleaning previous build...
    rmdir /s /q build
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Build frontend
echo Building React app...
call npm run build

if not exist "build" (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)

echo Frontend built successfully!

REM Calculate build size
for /f %%A in ('dir /s build ^| find "bytes"') do (
    echo %%A
)

cd ..\..
echo.
echo ====================================
echo   Verifying Backend
echo ====================================
echo.

cd "Back-end"

REM Check if node_modules exist
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

REM Check environment files
echo.
echo Checking environment files...
if not exist ".env.production" (
    echo WARNING: .env.production not found!
    echo Please create .env.production with your production settings
    echo Template is available in .env.production
) else (
    echo .env.production found
)

cd ..
echo.
echo ====================================
echo   Build Process Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Update Back-end\.env.production with your production settings
echo 2. Update front-end\vision-aid-ui\.env.production with settings
echo 3. Deploy using your chosen platform (Heroku, AWS, Docker, etc.)
echo 4. See PRODUCTION_DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause
