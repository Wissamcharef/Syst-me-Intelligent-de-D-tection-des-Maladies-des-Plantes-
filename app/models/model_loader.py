import json
import importlib
import os
from typing import Any, Dict, List, Optional

from app.config import settings

_CACHE: Dict[str, Any] = {
    "model": None,
    "class_names": None,
    "device": "cpu",
    "preprocess": None,
}


def _load_class_names() -> Optional[List[str]]:
    if not os.path.exists(settings.class_names_path):
        return None
    with open(settings.class_names_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        return None
    return [str(item) for item in data]


def _normalize_size(value: Any) -> Optional[int]:
    if isinstance(value, int) and value > 0:
        return value
    if isinstance(value, (list, tuple)) and value:
        first = value[0]
        if isinstance(first, int) and first > 0:
            return first
    return None


def _normalize_triplet(value: Any) -> Optional[List[float]]:
    if not isinstance(value, (list, tuple)) or len(value) != 3:
        return None
    try:
        return [float(v) for v in value]
    except (TypeError, ValueError):
        return None


def _extract_preprocess(checkpoint: Any) -> Dict[str, Any]:
    preprocess: Dict[str, Any] = {
        "input_size": settings.model_input_size,
        "resize_size": settings.model_resize_size,
        "center_crop": settings.model_center_crop,
        "mean": settings.model_normalize_mean,
        "std": settings.model_normalize_std,
    }

    if not isinstance(checkpoint, dict):
        return preprocess

    nested = checkpoint.get("preprocess")
    sources = [src for src in (nested, checkpoint) if isinstance(src, dict)]

    for src in sources:
        input_size = _normalize_size(src.get("input_size") or src.get("image_size"))
        if input_size is not None:
            preprocess["input_size"] = input_size

        resize_size = _normalize_size(src.get("resize_size"))
        if resize_size is not None:
            preprocess["resize_size"] = resize_size

        if "center_crop" in src:
            preprocess["center_crop"] = bool(src.get("center_crop"))

        mean = _normalize_triplet(src.get("mean") or src.get("normalize_mean"))
        std = _normalize_triplet(src.get("std") or src.get("normalize_std"))
        if mean is not None:
            preprocess["mean"] = mean
        if std is not None:
            preprocess["std"] = std

    return preprocess


def _build_resnet9_like_model(num_classes: int) -> Any:
    import torch.nn as nn

    def conv_block(in_channels: int, out_channels: int, pool: bool = False) -> nn.Sequential:
        layers: List[nn.Module] = [
            nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
        ]
        if pool:
            layers.append(nn.MaxPool2d(2))
        return nn.Sequential(*layers)

    class ResNet9Like(nn.Module):
        def __init__(self) -> None:
            super().__init__()
            self.conv1 = conv_block(3, 64)
            self.conv2 = conv_block(64, 128, pool=True)
            self.res1 = nn.Sequential(conv_block(128, 128), conv_block(128, 128))
            self.conv3 = conv_block(128, 256, pool=True)
            self.conv4 = conv_block(256, 512, pool=True)
            self.res2 = nn.Sequential(conv_block(512, 512), conv_block(512, 512))
            self.classifier = nn.Sequential(
                # Make classifier input size stable (512) regardless of spatial dims.
                nn.AdaptiveMaxPool2d((1, 1)),
                nn.Flatten(),
                nn.Linear(512, num_classes),
            )

        def forward(self, xb: Any) -> Any:
            out = self.conv1(xb)
            out = self.conv2(out)
            out = self.res1(out) + out
            out = self.conv3(out)
            out = self.conv4(out)
            out = self.res2(out) + out
            return self.classifier(out)

    return ResNet9Like()


def load_model() -> Optional[Dict[str, Any]]:
    """Load local PyTorch model once and cache it.

    Returns None when model files/libs are unavailable so API can still run
    in fallback mode.
    """
    if _CACHE["model"] is not None:
        return _CACHE

    if not os.path.exists(settings.model_path):
        return None

    torch_spec = importlib.util.find_spec("torch")
    if torch_spec is None:
        return None
    try:
        torch = importlib.import_module("torch")
    except Exception:
        return None

    class_names = _load_class_names()
    try:
        checkpoint = torch.load(settings.model_path, map_location="cpu")
    except Exception:
        return None

    checkpoint_class_names: Optional[List[str]] = None
    if isinstance(checkpoint, dict):
        maybe_classes = checkpoint.get("class_names")
        if isinstance(maybe_classes, list):
            checkpoint_class_names = [str(item) for item in maybe_classes]

    # Prefer class names embedded in the checkpoint when available.
    # This avoids wrong index->label mapping when an external JSON uses a different order.
    if checkpoint_class_names:
        if class_names is None:
            class_names = checkpoint_class_names
        elif class_names != checkpoint_class_names:
            class_names = checkpoint_class_names

    # We support two formats:
    # 1) full model object saved with torch.save(model, ...)
    # 2) dict containing a "model" key
    # 3) state_dict only (common when saving weights)
    model = checkpoint.get("model") if isinstance(checkpoint, dict) and "model" in checkpoint else checkpoint

    if isinstance(model, dict) and "conv1.0.weight" in model:
        num_classes = len(class_names) if class_names else 0
        if num_classes <= 0 and "classifier.2.weight" in model:
            num_classes = int(model["classifier.2.weight"].shape[0])
        if num_classes <= 0:
            return None
        try:
            state_dict = model
            model = _build_resnet9_like_model(num_classes=num_classes)
            model.load_state_dict(state_dict, strict=True)
        except Exception:
            return None

    if model is None:
        return None

    model.eval()
    _CACHE["model"] = model
    _CACHE["class_names"] = class_names
    _CACHE["device"] = "cpu"
    _CACHE["preprocess"] = _extract_preprocess(checkpoint)
    return _CACHE