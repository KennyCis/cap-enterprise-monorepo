# backend/room-service/tests/test_health.py
import os
# Forzamos la variable de entorno ANTES de importar la app
os.environ["TESTING"] = "True"

from fastapi.testclient import TestClient
from src.main import app  # Asegúrate de que esta ruta coincida con tu estructura

# El TestClient simula el servidor encendido sin usar un puerto real
client = TestClient(app)

def test_health_check():
    response = client.get("/api/rooms/health")
    

    assert response.status_code == 200
    

    data = response.json()
    assert data["service"] == "CAP Room Service"
    assert data["status"] == "Active"
    assert "timestamp" in data