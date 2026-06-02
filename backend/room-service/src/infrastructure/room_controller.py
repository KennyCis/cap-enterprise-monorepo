from fastapi import APIRouter, HTTPException
from src.application.room_usecase import room_usecase
from src.domain.room_model import RoomCreateDTO

router = APIRouter(prefix="/api/rooms", tags=["Rooms"])

@router.post("/")
def create_room(room_data: RoomCreateDTO):
    try:
        response = room_usecase.create_room(room_data)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/")
def get_rooms():
    try:
        response = room_usecase.get_all_rooms()
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))