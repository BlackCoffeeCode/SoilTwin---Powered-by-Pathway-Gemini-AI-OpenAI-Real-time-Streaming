FROM python:3.10-slim

WORKDIR /app
ENV PYTHONPATH=/app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ /app/backend
COPY pathway_pipeline/ /app/pathway_pipeline

EXPOSE 8000 8765

CMD sh -c "python -m pathway_pipeline.main_pipeline & uvicorn backend.main:app --host 0.0.0.0 --port 8000"
