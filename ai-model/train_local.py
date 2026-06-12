"""
Niko AI — YOLOv8 Training Script for Local Windows/Mac/Linux
Run this instead of the Colab notebook when training locally.

Usage:
    python train_local.py --data /path/to/dataset --epochs 50 --batch 16
"""
import argparse
import os
import sys
from pathlib import Path

# Check dependencies
try:
    import torch
    import torchvision
    from ultralytics import YOLO
    import pandas as pd
    import matplotlib.pyplot as plt
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("\nInstall dependencies with:")
    print("  pip install torch torchvision ultralytics pandas matplotlib")
    sys.exit(1)


def find_dataset_dirs(base_path: Path):
    """Find train and valid directories in dataset."""
    train_dirs = sorted([d for d in base_path.rglob('train') if d.is_dir() and any(x.is_dir() for x in d.iterdir())])
    valid_dirs = sorted([d for d in base_path.rglob('valid') if d.is_dir() and any(x.is_dir() for x in d.iterdir())])
    
    if not train_dirs:
        print(f"ERROR: No 'train' directory found in {base_path}")
        print("Expected structure: dataset/train/class1/, dataset/train/class2/, etc.")
        sys.exit(1)
    
    train_dir = train_dirs[0]
    valid_dir = valid_dirs[0] if valid_dirs else None
    data_dir = train_dir.parent
    
    print(f"Dataset found:")
    print(f"  Train: {train_dir}")
    print(f"  Valid: {valid_dir if valid_dir else 'Not found (will use train for validation)'}")
    print(f"  Data root: {data_dir}")
    
    return train_dir, valid_dir, data_dir


def count_classes(train_dir: Path):
    """Count images per class."""
    classes = sorted([d.name for d in train_dir.iterdir() if d.is_dir()])
    print(f"\nFound {len(classes)} classes:")
    
    total = 0
    for i, cls in enumerate(classes):
        count = len(list((train_dir / cls).glob('*.jpg'))) + len(list((train_dir / cls).glob('*.JPG')))
        total += count
        if i < 10 or i >= len(classes) - 5:  # Show first 10 and last 5
            print(f"  [{i:02d}] {cls}: {count} images")
        elif i == 10:
            print(f"  ... ({len(classes) - 15} more classes) ...")
    
    print(f"\nTotal: {total:,} images across {len(classes)} classes")
    return classes


def train_model(args, data_dir: Path):
    """Train YOLOv8 classification model."""
    print(f"\n{'='*60}")
    print("TRAINING CONFIGURATION")
    print(f"{'='*60}")
    print(f"Model:       YOLOv8{args.model}-cls")
    print(f"Epochs:      {args.epochs}")
    print(f"Batch size:  {args.batch}")
    print(f"Image size:  {args.imgsz}x{args.imgsz}")
    print(f"Device:      {'GPU' if torch.cuda.is_available() else 'CPU (slow!)'}")
    print(f"Data:        {data_dir}")
    print(f"Output:      {args.project}/{args.name}")
    print(f"{'='*60}\n")
    
    # Load model
    model = YOLO(f'yolov8{args.model}-cls.pt')
    
    # Train
    results = model.train(
        data=str(data_dir),
        epochs=args.epochs,
        batch=args.batch,
        imgsz=args.imgsz,
        project=args.project,
        name=args.name,
        exist_ok=True,
        save=True,
        save_period=10,
        patience=15,
        optimizer='AdamW',
        lr0=0.001,
        lrf=0.01,
        warmup_epochs=3,
        augment=True,
        degrees=10,
        flipud=0.3,
        fliplr=0.5,
        hsv_h=0.015,
        hsv_s=0.7,
        hsv_v=0.4,
        device=0 if torch.cuda.is_available() else 'cpu',
        verbose=True,
        plots=True,
    )
    
    weights_path = Path(results.save_dir) / 'weights' / 'best.pt'
    print(f"\n✓ Training complete!")
    print(f"✓ Best model: {weights_path}")
    
    return model, results, weights_path


def validate_model(model_path: Path, data_dir: Path):
    """Run validation."""
    print(f"\n{'='*60}")
    print("VALIDATION")
    print(f"{'='*60}")
    
    model = YOLO(str(model_path))
    metrics = model.val(data=str(data_dir))
    
    print(f"Top-1 Accuracy: {metrics.top1:.4f} ({metrics.top1*100:.2f}%)")
    print(f"Top-5 Accuracy: {metrics.top5:.4f} ({metrics.top5*100:.2f}%)")
    
    return metrics


def export_model(model_path: Path, imgsz: int):
    """Export to ONNX."""
    print(f"\n{'='*60}")
    print("EXPORTING TO ONNX")
    print(f"{'='*60}")
    
    model = YOLO(str(model_path))
    onnx_path = model.export(format='onnx', imgsz=imgsz, simplify=True)
    print(f"✓ ONNX model: {onnx_path}")
    
    return onnx_path


def main():
    parser = argparse.ArgumentParser(description='Train YOLOv8 for crop disease classification')
    parser.add_argument('--data', type=str, required=True, help='Path to dataset directory')
    parser.add_argument('--epochs', type=int, default=50, help='Number of epochs')
    parser.add_argument('--batch', type=int, default=16, help='Batch size (use 16 for CPU, 32 for GPU)')
    parser.add_argument('--imgsz', type=int, default=224, help='Image size')
    parser.add_argument('--model', type=str, default='n', choices=['n', 's', 'm', 'l', 'x'], help='Model size')
    parser.add_argument('--project', type=str, default='niko_ai_plant_disease', help='Project name')
    parser.add_argument('--name', type=str, default='run1', help='Run name')
    parser.add_argument('--skip-val', action='store_true', help='Skip validation after training')
    parser.add_argument('--skip-export', action='store_true', help='Skip ONNX export')
    args = parser.parse_args()
    
    # Validate dataset path
    data_path = Path(args.data)
    if not data_path.exists():
        print(f"ERROR: Dataset path does not exist: {data_path}")
        sys.exit(1)
    
    # Check GPU
    if torch.cuda.is_available():
        print(f"✓ GPU detected: {torch.cuda.get_device_name(0)}")
    else:
        print("⚠ No GPU detected. Training will be slow. Consider using Google Colab.")
        response = input("Continue anyway? (y/n): ")
        if response.lower() != 'y':
            sys.exit(0)
    
    # Find dataset
    train_dir, valid_dir, data_dir = find_dataset_dirs(data_path)
    classes = count_classes(train_dir)
    
    # Train
    model, results, weights_path = train_model(args, data_dir)
    
    # Validate
    if not args.skip_val:
        metrics = validate_model(weights_path, data_dir)
    
    # Export
    if not args.skip_export:
        export_model(weights_path, args.imgsz)
    
    # Summary
    print(f"\n{'='*60}")
    print("TRAINING SUMMARY")
    print(f"{'='*60}")
    print(f"Model:           YOLOv8{args.model}")
    print(f"Classes:         {len(classes)}")
    print(f"Epochs trained:  {args.epochs}")
    if not args.skip_val:
        print(f"Top-1 Accuracy:  {metrics.top1*100:.2f}%")
        print(f"Top-5 Accuracy:  {metrics.top5*100:.2f}%")
    print(f"Weights:         {weights_path}")
    print(f"\n✓ Next step: Copy best.pt to backend/ai-model/weights/best.pt")
    print(f"{'='*60}")


if __name__ == '__main__':
    main()
