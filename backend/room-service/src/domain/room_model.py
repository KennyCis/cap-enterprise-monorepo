from pydantic import BaseModel

class RoomCreateDTO(BaseModel):
    name: str
    capacity: int
    type: str
    