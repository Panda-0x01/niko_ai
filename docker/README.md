# Docker — Niko AI

## Requirements
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

## Start the entire project

```bash
cd docker
docker compose up --build
```

That single command:
1. Pulls PostgreSQL 16
2. Builds the FastAPI backend image
3. Builds the Next.js frontend image
4. Starts all three services in the right order
5. Runs database migrations automatically
6. Seeds the disease knowledge base automatically

## Access the app

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:3000        |
| Backend  | http://localhost:8000        |
| API Docs | http://localhost:8000/docs   |
| Database | localhost:5432               |

## Common commands

```bash
# Start (with rebuild)
docker compose up --build

# Start (no rebuild — faster)
docker compose up

# Start in background
docker compose up -d

# Stop
docker compose down

# Stop and delete database data
docker compose down -v

# View logs
docker compose logs -f

# View logs for one service only
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db

# Rebuild one service only
docker compose up --build backend

# Open a shell inside the backend container
docker compose exec backend bash

# Run a one-off command in backend
docker compose exec backend python -m app.db.seed
```

## Using your trained model

After training in Google Colab, place `best.pt` at:
```
ai-model/weights/best.pt
```

Then restart the backend service to pick it up:
```bash
docker compose restart backend
```

Without `best.pt`, the backend uses mock predictions automatically.

## Troubleshooting

**Port already in use:**
```bash
# Check what is using port 3000 or 8000
netstat -ano | findstr :3000
netstat -ano | findstr :8000
```

**Database connection refused:**
The backend waits for the database to be ready automatically via the entrypoint script.
If it still fails, check db logs:
```bash
docker compose logs db
```

**Frontend build fails:**
Make sure `next.config.ts` has `output: "standalone"` — this is required for the Docker build.
