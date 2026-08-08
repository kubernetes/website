#Dockerfile

FROM python:3.14-slim

# Python settings
ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1

WORKDIR /app

# Upgrade pip
RUN python -m pip install --no-cache-dir --upgrade pip

# Install dependencies
RUN python -m pip install --no-cache-dir redis

# Copy application files
COPY worker.py rediswq.py ./

# Create and use a non-root user
RUN useradd --create-home appuser && chown -R appuser:appuser /app
USER appuser

CMD ["python", "worker.py"]