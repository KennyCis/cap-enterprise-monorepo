from fastapi import FastAPI
from src.infrastructure.room_controller import router as room_router

app = FastAPI(title="Room Service API")

# Mount routers
app.include_router(room_router)

@app.get("/api/rooms/health")
def health_check():
    return {
        "status": "UP",
        "service": "Room Service",
        "language": "Python/FastAPI",
        "architecture": "Hexagonal"
    }