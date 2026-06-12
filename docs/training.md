# Google Colab Training Guide

## Quick Start

1. Open `ai-model/train_colab.ipynb` in Google Colab
2. Enable GPU: Runtime → Change runtime type → T4 GPU
3. Get your Kaggle API key from [kaggle.com/settings](https://www.kaggle.com/settings)
4. Fill in `KAGGLE_USERNAME` and `KAGGLE_KEY` in the notebook
5. Run all cells

## Dataset

- **Name:** New Plant Diseases Dataset
- **Source:** [Kaggle - vipoooool/new-plant-diseases-dataset](https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset)
- **Size:** ~87,000 images
- **Classes:** 38 (healthy + diseased)
- **Splits:** train / valid

## Recommended Configuration

| Setting | Value |
|---------|-------|
| Model | YOLOv8n-cls or YOLOv8s-cls |
| Epochs | 50 (with early stopping) |
| Batch size | 32 (T4) |
| Image size | 224×224 |
| Optimizer | AdamW |
| Learning rate | 0.001 |

## Expected Results

Training for 50 epochs typically achieves:
- Top-1 Accuracy: ~95%+
- Top-5 Accuracy: ~99%+

## Output

After training, download `best.pt` and place it at:
```
backend/ai-model/weights/best.pt
```

Set in `backend/.env`:
```
MODEL_PATH=ai-model/weights/best.pt
```
