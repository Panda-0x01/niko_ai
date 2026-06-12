"""
Niko AI — Standalone inference script using HuggingFace DINOv2.
No training required. Model downloads automatically on first run.

Usage:
    python inference.py --image path/to/leaf.jpg
    python inference.py --image path/to/leaf.jpg --json
"""
import argparse
import json
import sys
from pathlib import Path


def parse_label(label: str) -> tuple[str, str]:
    parts = label.split("___")
    if len(parts) == 2:
        crop = parts[0].replace("_", " ").strip()
        disease = parts[1].replace("_", " ").strip().capitalize()
        return crop, disease
    return "Unknown", label.replace("_", " ").strip()


def predict(image_path: str) -> dict:
    try:
        from PIL import Image
        import torch
        from transformers import AutoImageProcessor, AutoModel
    except ImportError as e:
        print(f"Missing dependency: {e}")
        print("Run: pip install torch transformers pillow")
        sys.exit(1)

    if not Path(image_path).exists():
        print(f"ERROR: Image not found: {image_path}")
        sys.exit(1)

    repo = "SevakGrigoryan/dinov2-large-plant-disease"
    device = "cuda" if torch.cuda.is_available() else "cpu"

    print(f"Loading model from HuggingFace Hub... (cached after first run)")
    processor = AutoImageProcessor.from_pretrained(repo)
    model = (
        AutoModel.from_pretrained(repo, trust_remote_code=True)
        .eval()
        .to(device)
    )

    img = Image.open(image_path).convert("RGB")
    inputs = processor(images=img, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        logits = model(**inputs)["logits"]

    probs = torch.softmax(logits, dim=-1)[0]
    top_idx = int(probs.argmax())
    confidence = float(probs[top_idx])

    raw_label = model.config.id2label[top_idx]
    crop, disease = parse_label(raw_label)

    # Top-5
    top5_vals, top5_idxs = probs.topk(5)
    top5 = []
    for idx, conf in zip(top5_idxs.tolist(), top5_vals.tolist()):
        c, d = parse_label(model.config.id2label[idx])
        top5.append({"crop": c, "disease": d, "confidence": round(float(conf), 4)})

    return {
        "crop": crop,
        "disease": disease,
        "confidence": round(confidence, 4),
        "top5": top5,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Niko AI — DINOv2 plant disease inference")
    parser.add_argument("--image", required=True, help="Path to leaf image")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    args = parser.parse_args()

    result = predict(args.image)

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print(f"\nCrop       : {result['crop']}")
        print(f"Disease    : {result['disease']}")
        print(f"Confidence : {result['confidence'] * 100:.1f}%")
        print(f"\nTop-5:")
        for i, p in enumerate(result["top5"]):
            print(f"  {i+1}. {p['crop']} — {p['disease']} ({p['confidence']*100:.1f}%)")
