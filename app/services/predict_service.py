from typing import Any, Dict, List

import httpx

from app.config import settings
from app.models.model_loader import load_model
from app.utils.image_processing import process_image

import hashlib

_DISEASES = [
    {
        "disease_name": "Tomato Late Blight",
        "severity": "Severe",
        "treatment": "Apply copper-based fungicide and remove infected leaves.",
        "prevention": "Avoid leaf wetness and ensure better air circulation.",
    },
    {
        "disease_name": "Wheat Rust",
        "severity": "Moderate",
        "treatment": "Use approved fungicide and remove heavily infected plants.",
        "prevention": "Use resistant varieties and rotate crops.",
    },
    {
        "disease_name": "Powdery Mildew",
        "severity": "Moderate",
        "treatment": "Use sulfur or potassium bicarbonate spray.",
        "prevention": "Reduce humidity and increase sunlight exposure.",
    },
]


def _normalize_remote_prediction(payload: Dict[str, Any]) -> Dict[str, Any]:
    confidence = payload.get("confidence", 0.0)
    if isinstance(confidence, (int, float)) and confidence <= 1:
        confidence = confidence * 100

    top_predictions = payload.get("top_predictions")
    normalized_top: List[Dict[str, Any]] = []
    if isinstance(top_predictions, list):
        for item in top_predictions[:3]:
            if not isinstance(item, dict):
                continue
            name = str(item.get("disease_name", "Unknown"))
            score = item.get("confidence", 0.0)
            if isinstance(score, (int, float)) and score <= 1:
                score = score * 100
            try:
                normalized_top.append(
                    {
                        "disease_name": name,
                        "confidence": round(float(score), 2),
                    }
                )
            except (TypeError, ValueError):
                continue

    result = {
        "disease_name": str(payload.get("disease_name", "Unknown")),
        "severity": str(payload.get("severity", "Unknown")),
        "treatment": str(payload.get("treatment", "No recommendation available.")),
        "prevention": str(payload.get("prevention", "No recommendation available.")),
        "confidence": round(float(confidence), 2),
    }
    if normalized_top:
        result["top_predictions"] = normalized_top
    return result


async def _predict_remote(file: Any) -> Dict[str, Any]:
    content = await file.read()
    file.file.seek(0)
    headers = {}
    if settings.remote_predict_api_key:
        headers["Authorization"] = f"Bearer {settings.remote_predict_api_key}"

    files = {
        "file": (
            file.filename or "image.jpg",
            content,
            file.content_type or "application/octet-stream",
        )
    }
    async with httpx.AsyncClient(timeout=settings.remote_predict_timeout_seconds) as client:
        response = await client.post(settings.remote_predict_url, files=files, headers=headers)
        response.raise_for_status()
        payload = response.json()
    return _normalize_remote_prediction(payload)


def _severity_from_label(label: str) -> str:
    lowered = label.lower()
    if "healthy" in lowered:
        return "Low"
    if any(token in lowered for token in ["blight", "rust", "spot", "mildew"]):
        return "Moderate"
    return "Moderate"


def _build_recommendations(label: str) -> Dict[str, str]:
    lowered = label.lower()
    if "healthy" in lowered:
        return {
            "treatment": "No treatment needed. Keep current care routine.",
            "prevention": "Maintain balanced watering and regular monitoring.",
        }
    return {
        "treatment": "Apply the recommended fungicide and remove infected leaves.",
        "prevention": "Improve airflow, avoid leaf wetness, and monitor regularly.",
    }


def _stable_int_from_bytes(content: bytes) -> int:
    if not content:
        return 0
    digest = hashlib.sha256(content).digest()
    return int.from_bytes(digest[:8], "big", signed=False)


def _predict_with_local_model(image: Any) -> Dict[str, Any] | None:
    cache = load_model()
    if not cache:
        return None

    model = cache["model"]
    class_names = cache.get("class_names")
    preprocess = cache.get("preprocess") or {}

    try:
        import torch
        from torchvision import transforms
    except ImportError:
        return None

    input_size = int(preprocess.get("input_size") or settings.model_input_size)
    resize_size = int(preprocess.get("resize_size") or settings.model_resize_size or input_size)
    center_crop = bool(preprocess.get("center_crop"))
    mean = preprocess.get("mean")
    std = preprocess.get("std")

    ops = []
    if center_crop:
        ops.append(transforms.Resize(resize_size))
        ops.append(transforms.CenterCrop(input_size))
    else:
        ops.append(transforms.Resize((input_size, input_size)))
    ops.append(transforms.ToTensor())
    if isinstance(mean, (list, tuple)) and isinstance(std, (list, tuple)) and len(mean) == 3 and len(std) == 3:
        ops.append(transforms.Normalize(mean=mean, std=std))

    transform = transforms.Compose(ops)
    xb = transform(image).unsqueeze(0)

    with torch.no_grad():
        logits = model(xb)
        probs = torch.softmax(logits, dim=1)
        confidence_tensor, idx_tensor = torch.max(probs, dim=1)
        top_k = min(3, int(probs.shape[1]))
        top_confidences, top_indices = torch.topk(probs, k=top_k, dim=1)

    idx = int(idx_tensor.item())
    confidence = round(float(confidence_tensor.item()) * 100, 2)
    label = class_names[idx] if class_names and idx < len(class_names) else f"class_{idx}"
    top_predictions: List[Dict[str, Any]] = []
    for rank_idx in range(top_k):
        class_idx = int(top_indices[0, rank_idx].item())
        class_label = (
            class_names[class_idx]
            if class_names and class_idx < len(class_names)
            else f"class_{class_idx}"
        )
        class_confidence = round(float(top_confidences[0, rank_idx].item()) * 100, 2)
        top_predictions.append(
            {
                "disease_name": class_label,
                "confidence": class_confidence,
            }
        )

    recommendations = _build_recommendations(label)
    return {
        "disease_name": label,
        "severity": _severity_from_label(label),
        "treatment": recommendations["treatment"],
        "prevention": recommendations["prevention"],
        "confidence": confidence,
        "top_predictions": top_predictions,
    }


async def predict_disease(file: Any) -> Dict[str, Any]:
    if settings.predict_mode.lower() == "remote":
        if not settings.remote_predict_url:
            raise ValueError(
                "REMOTE_PREDICT_URL is required when PREDICT_MODE=remote."
            )
        return await _predict_remote(file)

    content = await file.read()
    file.file.seek(0)
    stable_int = _stable_int_from_bytes(content)

    image = await process_image(file)

    if settings.predict_mode.lower() == "local":
        local_prediction = _predict_with_local_model(image)
        if local_prediction is not None:
            return local_prediction
        raise ValueError(
            "Local model is not available. Install torch/torchvision and ensure MODEL_PATH and CLASS_NAMES_PATH are valid, "
            "or switch PREDICT_MODE to 'mock' or 'remote'."
        )

    disease_index = stable_int % len(_DISEASES)
    prediction = _DISEASES[disease_index].copy()
    prediction["confidence"] = round(85.0 + ((stable_int >> 8) % 1500) / 100.0, 2)
    prediction["top_predictions"] = [
        {
            "disease_name": prediction["disease_name"],
            "confidence": prediction["confidence"],
        }
    ]
    return prediction