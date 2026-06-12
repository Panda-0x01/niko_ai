# Deployment Guide

## Frontend → Vercel

1. Push the `frontend/` directory to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Set root directory to `frontend`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Railway/Render backend URL
5. Deploy

---

## Backend → Railway

1. Push `backend/` to GitHub
2. Create new project at [railway.app](https://railway.app)
3. Add a PostgreSQL service
4. Add a new service from your GitHub repo
5. Set root directory to `backend`
6. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
7. Add environment variables from `.env.example`
8. Run migrations: use Railway's terminal to run `alembic upgrade head`
9. Seed data: `python -m app.db.seed`

---

## Backend → Render

1. Create new Web Service
2. Connect GitHub repo, root = `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add PostgreSQL database from Render dashboard
6. Set all environment variables
7. Run migrations via Render shell

---

## Model Weights

The `best.pt` file is too large for Git. Options:
- Upload to Google Drive and download in startup script
- Use Railway/Render persistent volume
- Use an S3-compatible storage bucket

For Railway, mount a volume at `/app/ai-model/weights/` and upload `best.pt` there.
