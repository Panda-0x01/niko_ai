@echo off
title Niko AI — Starting...

echo.
echo  ================================================
echo   Niko AI — Starting All Services
echo  ================================================
echo.

:: Check Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo  ERROR: Docker is not running.
    echo  Please start Docker Desktop and try again.
    echo.
    pause
    exit /b 1
)

echo  Docker is running.
echo.

:: Move into docker folder and start everything
cd /d "%~dp0docker"

echo  Building and starting all services...
echo  This takes ~3-5 minutes on first run.
echo.

docker compose up --build

:: If compose exits, pause so user can read any errors
echo.
pause
