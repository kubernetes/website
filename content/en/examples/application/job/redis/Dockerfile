# Use the official Python 3.14 slim image as the base image.
FROM python:3.14-slim

# Set the working directory inside the container.
WORKDIR /app

# Install the Redis Python client.
RUN python -m pip install --no-cache-dir redis

# Copy the application files into the container.
COPY worker.py rediswq.py ./

# Run the worker application when the container starts.
CMD ["python", "worker.py"]