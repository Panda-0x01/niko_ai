# Installation Guide

## Prerequisites

- Node.js 20+
- Python 3.12+
- PostgreSQL 16+
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/yourname/niko-ai.git
cd niko-ai
```

---

## 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and secret key
```

### Generate a secure SECRET_KEY:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### Run database migrations:

```bash
alembic upgrade head
```

### Seed the disease knowledge base:

```bash
python -m app.db.seed
```

### Start the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

API is now available at `http://localhost:8000`  
Swagger docs at `http://localhost:8000/docs` (debug mode only)

---

## 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
```

Frontend available at `http://localhost:3000`

---

## 4. Docker (All-in-One)

```bash
cd docker
docker compose up --build
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- PostgreSQL: localhost:5432

---

## 5. Place Model Weights

After training your model (see `docs/training.md`), place `best.pt` at:

```
backend/ai-model/weights/best.pt
```

Or configure the path in `.env`:

```
MODEL_PATH=path/to/your/best.pt
```

> Without the model, the app uses mock predictions for development.
