# Use Python 3.10 slim image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies required for psycopg2
RUN apt-get update && apt-get install -y libpq-dev gcc

# Copy source code
COPY . .

# Install Python dependencies directly
RUN pip install fastapi uvicorn psycopg2-binary pydantic python-dotenv sqlalchemy

# 🚀 LA SOLUCIÓN: Le decimos a Python dónde está la raíz de tus módulos
ENV PYTHONPATH=/app/src

# Expose port
EXPOSE 8002

# Command to run the application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8002"]