FROM python:3.10-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
COPY pathway_pipeline/ ./pathway_pipeline/

EXPOSE 8000 8765

CMD sh -c "python -m pathway_pipeline.main_pipeline & uvicorn main:app --host 0.0.0.0 --port 8000"