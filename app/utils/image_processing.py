import io
from typing import Any

from PIL import Image
from PIL import UnidentifiedImageError


async def process_image(file: Any) -> Image.Image:
    content = await file.read()
    if hasattr(file, "file") and hasattr(file.file, "seek"):
        file.file.seek(0)
    if not content:
        raise ValueError("Empty file. Please upload a valid image.")
    try:
        image = Image.open(io.BytesIO(content)).convert("RGB")
    except UnidentifiedImageError as exc:
        raise ValueError(
            "Unsupported or invalid image format. Please upload JPG, PNG or WEBP."
        ) from exc
    return image