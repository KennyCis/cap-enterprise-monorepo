# backend/room-service/tests/test_rooms.py
import pytest
from httpx import AsyncClient
from src.main import app  # Asegúrate de importar tu instancia de FastAPI

@pytest.mark.asyncio
async def test_get_rooms():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/rooms/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_create_room_invalid_data():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Enviamos datos incompletos (sin capacidad ni nombre)
        response = await ac.post("/api/rooms/", json={"building": "Engineering"})
    
    # FastAPI validará el esquema y debería devolver 422 (Unprocessable Entity)
    assert response.status_code == 422