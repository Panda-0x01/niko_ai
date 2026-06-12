
Write-Host ""
Write-Host "  ================================================" -ForegroundColor Cyan
Write-Host "   Niko AI — Starting All Services" -ForegroundColor Cyan
Write-Host "  ================================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker
$dockerCheck = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Docker Desktop is not running." -ForegroundColor Red
    Write-Host "  Start Docker Desktop, then run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "  Docker is running." -ForegroundColor Green
Write-Host ""
Write-Host "  Starting: PostgreSQL + FastAPI backend + Next.js frontend" -ForegroundColor White
Write-Host "  First build takes ~3-5 min. Subsequent starts take ~30 sec." -ForegroundColor Gray
Write-Host ""
Write-Host "  URLs after startup:" -ForegroundColor White
Write-Host "    App      ->  http://localhost:3000" -ForegroundColor Green
Write-Host "    API      ->  http://localhost:8000" -ForegroundColor Green
Write-Host "    API Docs ->  http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""

Set-Location "$PSScriptRoot\docker"
docker compose up --build
