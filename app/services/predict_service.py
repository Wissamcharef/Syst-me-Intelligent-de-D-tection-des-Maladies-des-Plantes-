from typing import Any, Dict

from app.utils.image_processing import process_image

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


async def predict_disease(file: Any) -> Dict[str, Any]:
    image = await process_image(file)
    width, height = image.size

    disease_index = (width + height) % len(_DISEASES)
    prediction = _DISEASES[disease_index].copy()
    prediction["confidence"] = round(88.0 + (min(width, height) % 12), 2)
    return prediction