# Model Inference Guide

## Using the Standalone Script

```bash
cd ai-model

# Basic usage
python inference.py --image path/to/leaf.jpg --model weights/best.pt

# JSON output
python inference.py --image path/to/leaf.jpg --model weights/best.pt --json
```

**Sample output:**
```
Crop:       Tomato
Disease:    Early blight
Confidence: 94.2%

Top-5 Predictions:
  1. Tomato — Early blight (94.2%)
  2. Tomato — Target Spot (3.1%)
  3. Tomato — Septoria leaf spot (1.4%)
  4. Tomato — Late blight (0.8%)
  5. Tomato — Leaf Mold (0.5%)
```

---

## Via the API

```bash
curl -X POST http://localhost:8000/api/predictions/predict \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@leaf.jpg"
```

---

## Without Model Weights

If `best.pt` is not found, the inference module falls back to **mock predictions** for development. This allows you to test the full application flow without a trained model.

---

## Performance Tips

- Use GPU for faster inference: set `device=0` in the predictor
- Batch prediction is not exposed via the API but supported by the YOLO SDK
- ONNX export enables deployment on CPU without PyTorch
