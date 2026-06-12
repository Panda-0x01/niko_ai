<div align="center">

<img src="https://img.shields.io/badge/Niko%20AI-AgriGuard-16a34a?style=for-the-badge&logo=leaf&logoColor=white" alt="Niko AI"/>

# Niko AI — AgriGuard

### AI-Powered Crop Disease Detection Platform

**Upload a leaf photo → get an instant diagnosis, treatment plan, and prevention guide**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.6-EE4C2C?style=flat-square&logo=pytorch)](https://pytorch.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Live Demo]() · [API Docs](http://localhost:8000/docs) · [Report Bug](https://github.com/Panda-0x01/niko_ai/issues) · [Request Feature](https://github.com/Panda-0x01/niko_ai/issues)

</div>

---

## The Problem

Every year, crop diseases destroy **20–40% of global food production**, costing farmers billions. Most small-scale farmers cannot afford agronomists or diagnostic labs. By the time a disease is visually obvious, it has often already spread across the field.

**Niko AI solves this** by putting a plant pathologist in every farmer's pocket — for free. Snap a photo of a sick leaf, and know exactly what is wrong and what to do about it in seconds.

---

## What It Does

```
Farmer takes photo of sick leaf
          │
          ▼
   Niko AI analyses it
          │
          ▼
┌─────────────────────────────────┐
│  Crop       :  Tomato           │
│  Disease    :  Early Blight     │
│  Confidence :  94.2%            │
│                                 │
│  Description: Alternaria solani │
│  Symptoms  : [3 listed]         │
│  Treatment : [3 recommended]    │
│  Prevention: [4 steps]          │
└─────────────────────────────────┘
          │
          ▼
  Saved to diagnosis history
```

**Key features:**
- Detects **38 disease classes** across **14 crop types**
- Confidence score on every prediction
- Full treatment and prevention recommendations
- Complete diagnosis history
- Works on desktop, tablet, and mobile

---

## Supported Crops & Diseases

| Crop | Diseases Detected |
|------|-------------------|
| Tomato | Bacterial spot, Early blight, Late blight, Leaf mold, Septoria leaf spot, Spider mites, Target spot, Yellow leaf curl virus, Mosaic virus, Healthy |
| Potato | Early blight, Late blight, Healthy |
| Apple | Apple scab, Black rot, Cedar apple rust, Healthy |
| Corn (Maize) | Cercospora leaf spot, Common rust, Northern leaf blight, Healthy |
| Grape | Black rot, Esca, Leaf blight, Healthy |
| Peach | Bacterial spot, Healthy |
| Pepper, Bell | Bacterial spot, Healthy |
| Orange | Huanglongbing (Citrus greening) |
| Strawberry | Leaf scorch, Healthy |
| Cherry | Powdery mildew, Healthy |
| Squash | Powdery mildew |
| Blueberry | Healthy |
| Raspberry | Healthy |
| Soybean | Healthy |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth animations |
| **TanStack Query** | Server state management |
| **React Hook Form + Zod** | Form validation |
| **Axios** | HTTP client with auto token refresh |

### Backend
| Technology | Purpose |
|-----------|---------|
| **FastAPI** | High-performance async Python API |
| **SQLAlchemy 2** | ORM with async support |
| **Alembic** | Database migrations |
| **PostgreSQL 16** | Primary database |
| **python-jose** | JWT authentication |
| **bcrypt** | Password hashing |
| **slowapi** | Rate limiting |

### AI / ML
| Technology | Purpose |
|-----------|---------|
| **DINOv2 Large** | Vision transformer backbone |
| **`SevakGrigoryan/dinov2-large-plant-disease`** | Fine-tuned HuggingFace model |
| **PyTorch 2.6** | Deep learning framework |
| **HuggingFace Transformers** | Model loading & inference |
| **New Plant Diseases Dataset** | 87,000+ training images |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Docker + Compose** | One-command deployment |
| **Vercel** | Frontend hosting |
| **Railway / Render** | Backend hosting |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Browser / Mobile                       │
│                  Next.js 16 (Port 3000)                   │
│  Landing │ Login │ Register │ Dashboard │ Scan │ History  │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTPS / REST API
                         ▼
┌──────────────────────────────────────────────────────────┐
│               FastAPI Backend (Port 8000)                 │
│                                                           │
│  /api/auth/*     JWT Auth (register, login, refresh)      │
│  /api/users/*    Profile management                       │
│  /api/predictions/predict    ◄── Image upload             │
│  /api/predictions/history    ◄── Diagnosis history        │
│                                                           │
│  ┌─────────────────────────────────────────────────┐     │
│  │           DINOv2 Inference Module               │     │
│  │  SevakGrigoryan/dinov2-large-plant-disease      │     │
│  │  Downloads from HuggingFace Hub automatically   │     │
│  └─────────────────────────────────────────────────┘     │
└────────────────────────┬─────────────────────────────────┘
                         │ SQLAlchemy ORM
                         ▼
┌──────────────────────────────────────────────────────────┐
│                  PostgreSQL 16                            │
│                                                           │
│  users          predictions          diseases            │
│  ─────          ───────────          ────────            │
│  id             id                   id                  │
│  full_name      user_id              crop_name           │
│  email          crop_name            disease_name        │
│  password_hash  disease_name         description         │
│  profile_image  confidence           symptoms[]          │
│  created_at     image_url            treatment[]         │
│                 created_at           prevention[]        │
└──────────────────────────────────────────────────────────┘
```

---

## How It Works

### 1. Image Upload
User uploads a crop leaf photo (JPG/PNG, max 10MB) via drag-and-drop or file picker.

### 2. AI Inference
The image is passed to `SevakGrigoryan/dinov2-large-plant-disease` — a DINOv2 Large vision transformer fine-tuned on the New Plant Diseases Dataset (87,000+ images, 38 classes). The model returns a class label and confidence score.

### 3. Knowledge Lookup
The predicted crop and disease are matched against the diseases table in PostgreSQL, which stores expert-curated descriptions, symptoms, treatments, and prevention methods for all 38 classes.

### 4. Response
The API returns a structured JSON response with everything the farmer needs:

```json
{
  "crop": "Tomato",
  "disease": "Early blight",
  "confidence": 0.9421,
  "description": "Early blight of tomato is caused by Alternaria solani...",
  "symptoms": ["Dark brown lesions with concentric rings...", "..."],
  "treatment": ["Apply fungicides every 7-10 days...", "..."],
  "prevention": ["Use disease-free certified seed...", "..."],
  "prediction_id": "uuid",
  "image_url": "/uploads/..."
}
```

### 5. History
Every diagnosis is saved to the user's account and accessible from the History page.

---

## Project Structure

```
niko-ai/
├── frontend/                   # Next.js 16 App Router
│   └── src/
│       ├── app/                # Pages
│       │   ├── page.tsx        # Landing page
│       │   ├── login/          # Login page
│       │   ├── register/       # Register page
│       │   └── dashboard/      # Dashboard, Scan, History, Settings
│       ├── components/         # UI components
│       │   ├── landing/        # Hero, Features, FAQ, etc.
│       │   ├── dashboard/      # Shell, Overview, Scanner, History
│       │   ├── auth/           # Login & Register forms
│       │   ├── icons/          # SVG icon system
│       │   └── ui/             # Button, Card, Input, Badge, etc.
│       ├── hooks/              # useAuth, usePredictions, use-toast
│       ├── lib/                # api.ts, auth.ts, utils.ts
│       └── types/              # TypeScript interfaces
│
├── backend/                    # FastAPI Python API
│   ├── app/
│   │   ├── main.py             # FastAPI app entry point
│   │   ├── config.py           # Settings from .env
│   │   ├── database.py         # SQLAlchemy engine
│   │   ├── models/             # User, Prediction, Disease ORM models
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── routers/            # auth, users, predictions endpoints
│   │   ├── services/           # Business logic
│   │   ├── core/               # JWT security, dependencies
│   │   ├── ml/                 # DINOv2 inference module
│   │   └── db/                 # Database seed (38 diseases)
│   ├── alembic/                # Database migrations
│   ├── entrypoint.sh           # Docker startup script
│   └── requirements.txt
│
├── ai-model/                   # Training & inference
│   ├── train_colab.ipynb       # Google Colab training notebook
│   ├── train_local.py          # Local training script
│   └── inference.py            # Standalone inference script
│
├── database/                   # PostgreSQL schema
│   └── schema.sql
│
├── docker/                     # Docker configuration
│   ├── docker-compose.yml      # One-command startup
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── init.sql
│
├── docs/                       # Documentation
│   ├── api.md
│   ├── deployment.md
│   ├── installation.md
│   ├── training.md
│   └── postgres.md
│
├── start.bat                   # Windows one-click start
├── start.ps1                   # PowerShell one-click start
└── README.md
```

---

## Quick Start

### Option 1 — Docker (Recommended)

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
git clone https://github.com/Panda-0x01/niko_ai.git
cd niko_ai/docker
docker compose up --build
```

That's it. Docker will:
1. Start PostgreSQL 16
2. Run database migrations automatically
3. Seed all 38 disease records
4. Download the AI model from HuggingFace (~3GB, first run only)
5. Start the Next.js frontend

Open **http://localhost:3000**

> First build takes ~5-8 minutes (PyTorch + model download). Every run after is ~30 seconds.

---

### Option 2 — Local Development

**Prerequisites:** Python 3.12+, Node.js 20+, PostgreSQL 16, Docker (for DB only)

#### 1. Clone
```bash
git clone https://github.com/Panda-0x01/niko_ai.git
cd niko_ai
```

#### 2. Start PostgreSQL
```bash
docker run -d --name nikoai_db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=nikoai \
  -p 5432:5432 \
  postgres:16-alpine
```

#### 3. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Install PyTorch separately:
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

cp .env.example .env              # Edit DATABASE_URL if needed
alembic upgrade head
python -m app.db.seed
uvicorn app.main:app --reload --port 8000
```

#### 4. Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local  # NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Open **http://localhost:3000**

---

## API Reference

Base URL: `http://localhost:8000/api`

All protected endpoints require: `Authorization: Bearer <token>`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Create account |
| `POST` | `/auth/login` | Sign in |
| `POST` | `/auth/refresh` | Refresh tokens |
| `POST` | `/auth/logout` | Sign out |
| `GET`  | `/users/me` | Get profile |
| `PATCH`| `/users/me` | Update profile |
| `POST` | `/predictions/predict` | Upload image, get diagnosis |
| `GET`  | `/predictions/history` | Get all diagnoses |
| `GET`  | `/predictions/history/{id}` | Get single diagnosis |
| `DELETE`| `/predictions/history/{id}` | Delete diagnosis |
| `GET`  | `/health` | Health check |

Full interactive docs at **http://localhost:8000/docs**

---

## AI Model

The app uses [`SevakGrigoryan/dinov2-large-plant-disease`](https://huggingface.co/SevakGrigoryan/dinov2-large-plant-disease) — a DINOv2 Large vision transformer fine-tuned on the [New Plant Diseases Dataset](https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset).

```python
from PIL import Image
import torch
from transformers import AutoImageProcessor, AutoModel

repo = "SevakGrigoryan/dinov2-large-plant-disease"
processor = AutoImageProcessor.from_pretrained(repo)
model = AutoModel.from_pretrained(repo, trust_remote_code=True).eval()

img = Image.open("leaf.jpg").convert("RGB")
inputs = processor(images=img, return_tensors="pt")
with torch.no_grad():
    logits = model(**inputs)["logits"]
print(model.config.id2label[int(logits.argmax(-1))])
```

The model downloads automatically from HuggingFace Hub on first use and is cached locally.

### Training Your Own Model (Optional)

If you want to train a custom YOLOv8 classifier instead:

1. Open `ai-model/train_colab.ipynb` in [Google Colab](https://colab.research.google.com)
2. Set runtime to **T4 GPU** (Runtime → Change runtime type)
3. Add your Kaggle credentials and run all cells
4. Download `best.pt` and place at `backend/ai-model/weights/best.pt`

---

## Deployment

### Frontend → Vercel
```bash
# Deploy frontend to Vercel
cd frontend
npx vercel --prod
# Set env var: NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

### Backend → Railway
1. Connect GitHub repo at [railway.app](https://railway.app)
2. Set root directory to `backend`
3. Add PostgreSQL service
4. Set environment variables from `.env.example`
5. Railway auto-runs `entrypoint.sh` on deploy

Full deployment guide: [docs/deployment.md](docs/deployment.md)

---

## Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/nikoai
SECRET_KEY=your-32-char-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ALLOWED_ORIGINS=http://localhost:3000
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10
DEBUG=true
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Security

- **JWT** — Stateless auth with access + refresh token pair
- **bcrypt** — Industry-standard password hashing (cost factor 12)
- **Rate limiting** — 60 requests/minute per IP via slowapi
- **CORS** — Strict origin whitelist
- **Input validation** — Pydantic schemas on all endpoints
- **File validation** — Type and size checks before processing
- **Non-root Docker** — Containers run as unprivileged user
- **SQL injection** — SQLAlchemy ORM parameterized queries throughout

---

## Docker Commands

```bash
# Start everything
docker compose up --build       # first time
docker compose up               # subsequent runs (uses cache)

# Run in background
docker compose up -d

# View logs
docker compose logs -f
docker compose logs -f backend  # backend only

# Stop
docker compose down             # keep data
docker compose down -v          # wipe all data

# Rebuild one service
docker compose up --build backend
```

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgements

- [New Plant Diseases Dataset](https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset) — Kaggle
- [SevakGrigoryan/dinov2-large-plant-disease](https://huggingface.co/SevakGrigoryan/dinov2-large-plant-disease) — HuggingFace
- [DINOv2](https://github.com/facebookresearch/dinov2) — Meta AI Research
- [FastAPI](https://fastapi.tiangolo.com) — Sebastián Ramírez
- [shadcn/ui](https://ui.shadcn.com) — shadcn

---

<div align="center">

**Built with care for farmers everywhere.**

[Report a Bug](https://github.com/Panda-0x01/niko_ai/issues) · [Request a Feature](https://github.com/Panda-0x01/niko_ai/issues)

</div>
