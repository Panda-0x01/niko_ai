# Colab ↔ Niko AI Project Workflow

## How it connects

```
Your PC                    Google Drive              Google Colab
──────────                 ─────────────             ────────────
niko-ai/               ←→  niko-ai/              ←   train_colab.ipynb
  ai-model/                  ai-model/
    weights/           ←      weights/
      best.pt          ←        best.pt   (saved by Colab)
```

---

## One-time setup

### 1. Upload your project to Google Drive

Option A — Google Drive desktop app (recommended):
- Install [Google Drive for Desktop](https://www.google.com/drive/download/)
- It creates a `G:\My Drive\` folder on your PC
- Copy your `niko-ai/` project folder into it
- It syncs automatically — any file saved to Drive appears on your PC

Option B — Manual upload:
- Go to [drive.google.com](https://drive.google.com)
- Upload the `niko-ai/` folder

### 2. Put kaggle.json in your Drive project folder

- Download from [kaggle.com/settings](https://www.kaggle.com/settings) → API → Create New Token
- Place it at `niko-ai/kaggle.json` in your Drive
- The notebook reads it from there automatically — never hardcode credentials

---

## Every training run

1. Open [colab.research.google.com](https://colab.research.google.com)
2. File → Open → Google Drive → `niko-ai/ai-model/train_colab.ipynb`
3. Runtime → Change runtime type → **T4 GPU** → Save
4. Run all cells (Ctrl+F9 or Runtime → Run all)
5. When done, `best.pt` is automatically saved to `niko-ai/ai-model/weights/best.pt` in your Drive
6. If you have Drive for Desktop, `best.pt` appears in `G:\My Drive\niko-ai\ai-model\weights\best.pt` on your PC within seconds

---

## Configure backend to use the weights

In `backend/.env`:
```
# Option A: local path (after Drive sync)
MODEL_PATH=ai-model/weights/best.pt

# Option B: direct Drive path (Windows with Drive for Desktop)
MODEL_PATH=G:/My Drive/niko-ai/ai-model/weights/best.pt
```

---

## Reconnect without re-downloading dataset

If your Colab session disconnects, re-run from **Step 7 (Train)**.
The notebook checks if the dataset is already downloaded before re-downloading.
The Drive mount persists your project files between sessions.
