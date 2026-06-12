"""
Run this first to install all dependencies for local training on Windows.
    python setup_local.py
"""
import subprocess
import sys
import platform


def run(cmd, label):
    print(f"\n>>> {label}")
    result = subprocess.run(cmd, shell=True)
    if result.returncode != 0:
        print(f"FAILED: {label}")
        sys.exit(1)
    print(f"OK: {label}")


print(f"Python: {sys.version}")
print(f"Platform: {platform.system()} {platform.machine()}")

# 1. Upgrade pip
run(f"{sys.executable} -m pip install --upgrade pip", "Upgrade pip")

# 2. PyTorch — check for CUDA
try:
    import subprocess
    nvcc = subprocess.run("nvcc --version", shell=True, capture_output=True, text=True)
    has_cuda = nvcc.returncode == 0
except Exception:
    has_cuda = False

if has_cuda:
    print("\nCUDA detected — installing GPU version of PyTorch")
    run(
        f"{sys.executable} -m pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121",
        "PyTorch (CUDA 12.1)"
    )
else:
    print("\nNo CUDA detected — installing CPU-only PyTorch (training will be slow)")
    run(
        f"{sys.executable} -m pip install torch torchvision",
        "PyTorch (CPU)"
    )

# 3. Remaining dependencies
run(
    f"{sys.executable} -m pip install ultralytics==8.2.18 pandas matplotlib kaggle",
    "ultralytics + kaggle + pandas + matplotlib"
)

# 4. Verify
print("\n" + "="*50)
print("VERIFICATION")
print("="*50)

import importlib
for pkg in ["torch", "torchvision", "ultralytics", "pandas", "matplotlib"]:
    try:
        mod = importlib.import_module(pkg)
        ver = getattr(mod, "__version__", "?")
        print(f"  ✓ {pkg} {ver}")
    except ImportError:
        print(f"  ✗ {pkg} — MISSING")

try:
    import torch
    print(f"\n  CUDA available: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        print(f"  GPU: {torch.cuda.get_device_name(0)}")
except Exception:
    pass

print("\nSetup complete. Now run:")
print("  python train_local.py --data /path/to/dataset --epochs 50 --batch 16")
