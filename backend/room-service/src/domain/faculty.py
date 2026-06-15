from pydantic import BaseModel
from typing import Optional

class FacultyBase(BaseModel):
    name: str
    description: Optional[str] = None
    campus_location: str

class FacultyCreate(FacultyBase):
    pass

class FacultyResponse(FacultyBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True