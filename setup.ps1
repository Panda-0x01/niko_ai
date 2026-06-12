# ============================================================
# Niko AI — Full Project Setup Script
# Run from project root: .\setup.ps1
# ============================================================

$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$BACKEND  = Join-Path $ROOT "backend"
$FRONTEND = Join-Path $ROOT "frontend"

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  Niko AI — Project Setup" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Check prerequisites ────────────────────────────
Write-Host "[1/5] Checking prerequisites..." -ForegroundColor Yellow

$python = python --version 2>&1
$node   = node --version 2>&1
$docker = docker --version 2>&1
$npm    = npm --version 2>&1

Write-Host "  Python : $python"
Write-Host "  Node   : $node"
Write-Host "  npm    : $npm"
Write-Host "  Docker : $docker"
Write-Host ""

# ── Step 2: Backend Python environment ─────────────────────
Write-Host "[2/5] Setting up Python backend..." -ForegroundColor Yellow

Set-Location $BACKEND

if (-not (Test-Path "venv")) {
    Write-Host "  Creating virtual environment..."
    python -m venv venv
}

Write-Host "  Installing Python dependencies..."
& ".\venv\Scripts\python.exe" -m pip install --upgrade pip --quiet

# Core deps (no torch - handled separately)
& ".\venv\Scripts\python.exe" -m pip install `
    fastapi==0.115.0 `
    "uvicorn[standard]==0.30.6" `
    sqlalchemy==2.0.36 `
    alembic==1.13.3 `
    psycopg2-binary==2.9.10 `
    pydantic==2.9.2 `
    pydantic-settings==2.5.2 `
    "python-jose[cryptography]==3.3.0" `
    "passlib[bcrypt]==1.7.4" `
    python-multipart==0.0.12 `
    pillow==11.0.0 `
    slowapi==0.1.9 `
    httpx==0.27.2 `
    python-dotenv==1.0.1 `
    aiofiles==24.1.0 `
    numpy==2.1.3 `
    --quiet

Write-Host "  Installing PyTorch (CPU)..."
& ".\venv\Scripts\python.exe" -m pip install torch torchvision `
    --index-url https://download.pytorch.org/whl/cpu --quiet

Write-Host "  Installing HuggingFace transformers..."
& ".\venv\Scripts\python.exe" -m pip install `
    transformers==4.46.3 `
    huggingface-hub==0.26.2 `
    accelerate==1.1.1 `
    --quiet

Write-Host "  Backend Python dependencies installed." -ForegroundColor Green

# ── Step 3: Copy .env if not exists ─────────────────────────
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "  Created backend/.env from example" -ForegroundColor Green
} else {
    Write-Host "  backend/.env already exists, skipping"
}

# ── Step 4: Frontend Node dependencies ─────────────────────
Write-Host ""
Write-Host "[3/5] Setting up Next.js frontend..." -ForegroundColor Yellow

Set-Location $FRONTEND

if (-not (Test-Path ".env.local")) {
    Copy-Item ".env.local.example" ".env.local"
    Write-Host "  Created frontend/.env.local from example" -ForegroundColor Green
} else {
    Write-Host "  frontend/.env.local already exists, skipping"
}

Write-Host "  Installing npm packages..."
npm install --silent
npm install next@latest --silent

Write-Host "  Frontend dependencies installed." -ForegroundColor Green

# ── Step 5: Database via Docker ─────────────────────────────
Write-Host ""
Write-Host "[4/5] Starting PostgreSQL via Docker..." -ForegroundColor Yellow

Set-Location $ROOT

$dockerRunning = docker ps 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Docker is not running." -ForegroundColor Red
    Write-Host "  Please start Docker Desktop, then run:" -ForegroundColor Yellow
    Write-Host "    docker run -d --name nikoai_db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=nikoai -p 5432:5432 postgres:16-alpine" -ForegroundColor White
    Write-Host "  Then re-run: .\setup.ps1" -ForegroundColor Yellow
} else {
    # Check if container already exists
    $existing = docker ps -a --filter "name=nikoai_db" --format "{{.Names}}" 2>&1
    if ($existing -match "nikoai_db") {
        Write-Host "  Starting existing nikoai_db container..."
        docker start nikoai_db 2>&1 | Out-Null
    } else {
        Write-Host "  Creating PostgreSQL container..."
        docker run -d `
            --name nikoai_db `
            -e POSTGRES_USER=postgres `
            -e POSTGRES_PASSWORD=password `
            -e POSTGRES_DB=nikoai `
            -p 5432:5432 `
            --restart unless-stopped `
            postgres:16-alpine
    }

    Write-Host "  Waiting for PostgreSQL to be ready..."
    Start-Sleep -Seconds 5

    # Run migrations
    Write-Host "  Running database migrations..."
    Set-Location $BACKEND
    & ".\venv\Scripts\python.exe" -m alembic upgrade head

    # Seed disease data
    Write-Host "  Seeding disease knowledge base..."
    & ".\venv\Scripts\python.exe" -m app.db.seed

    Write-Host "  Database ready." -ForegroundColor Green
}

# ── Done ─────────────────────────────────────────────────────
Set-Location $ROOT

Write-Host ""
Write-Host "=================================================" -ForegroundColor Green
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the project, open TWO terminals:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Terminal 1 — Backend:" -ForegroundColor White
Write-Host "    cd backend" -ForegroundColor Gray
Write-Host "    .\venv\Scripts\activate" -ForegroundColor Gray
Write-Host "    uvicorn app.main:app --reload --port 8000" -ForegroundColor Gray
Write-Host ""
Write-Host "  Terminal 2 — Frontend:" -ForegroundColor White
Write-Host "    cd frontend" -ForegroundColor Gray
Write-Host "    npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  App    -> http://localhost:3000" -ForegroundColor Green
Write-Host "  API    -> http://localhost:8000" -ForegroundColor Green
Write-Host "  Docs   -> http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
Write-Host "  OR start everything with Docker:" -ForegroundColor Cyan
Write-Host "    cd docker" -ForegroundColor Gray
Write-Host "    docker compose up --build" -ForegroundColor Gray
Write-Host ""
