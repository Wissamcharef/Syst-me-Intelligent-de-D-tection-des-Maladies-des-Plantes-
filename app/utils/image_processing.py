from PIL import Image
import io

async def process_image(file):
    content = await file.read()
    image = Image.open(io.BytesIO(content))
    return image