#FROM python
#RUN pip install redis
#COPY ./worker.py /worker.py
#COPY ./rediswq.py /rediswq.py

#CMD  python worker.py

FROM python:3.14-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1

WORKDIR /app

RUN python -m pip install --no-cache-dir redis

COPY worker.py rediswq.py ./

RUN useradd --create-home appuser && chown -R appuser:appuser /app
USER appuser

CMD ["python", "worker.py"]