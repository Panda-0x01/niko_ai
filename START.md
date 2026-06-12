# How to Run Niko AI Locally

## Prerequisites (install once)

- Python 3.12+  →  https://python.org/downloads
- Node.js 20+   →  https://nodejs.org
- PostgreSQL 16 →  https://postgresql.org/download

---

## One-time setup

### 1. Create PostgreSQL database
Open pgAdmin or psql and run:
```sql
CREATE DATABASE nikoai;
```

### 2. Backend setup
Open a terminal in `c:\Jayesh\projects\miko\backend\`
```
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python -m app.db.seed
```

### 3. Frontend setup
Open a terminal in `c:\Jayesh\projects\miko\frontend\`
```
npm install
```

---

## Every time you want to run the app

You need **two terminals** open at the same time.

### Terminal 1 — Backend (FastAPI)
```
cd c:\Jayesh\projects\miko\backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```
Backend runs at → http://localhost:8000
API docs at    → http://localhost:8000/docs  (DEBUG=true)

### Terminal 2 — Frontend (Next.js)
```
cd c:\Jayesh\projects\miko\frontend
npm run dev
```
App runs at → http://localhost:3000

---

## After training in Colab

1. Download `best.pt` from Colab (Step 11 in notebook)
2. Place it at:
   ```
   c:\Jayesh\projects\miko\backend\ai-model\weights\best.pt
   ```
3. Restart the backend (Ctrl+C then run again)
4. Upload a leaf image in the app → get real AI predictions

## Without best.pt

The app still works — the backend uses **mock predictions** automatically.
This lets you test the full UI and API flow before training is done.

---

## Quick test

1. Go to http://localhost:3000
2. Click "Get Started" → Register an account
3. Go to "Scan Disease"
4. Upload any leaf image
5. See the diagnosis result
