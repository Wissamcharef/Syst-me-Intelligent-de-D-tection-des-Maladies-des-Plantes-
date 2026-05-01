FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt requirements-ml.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt && \
    pip install --no-cache-dir --index-url https://download.pytorch.org/whl/cpu -r /app/requirements-ml.txt

COPY app /app/app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
