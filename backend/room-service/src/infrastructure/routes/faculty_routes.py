from fastapi import APIRouter, HTTPException, status
from typing import List
from domain.faculty import FacultyResponse, FacultyCreate

router = APIRouter(
    prefix="/api/rooms/faculties",
    tags=["Faculties"]
)

# Temporary in-memory database for rapid frontend integration
mock_db_faculties = [
    {
        "id": 1, 
        "name": "Engineering Faculty", 
        "description": "Main engineering building", 
        "campus_location": "Central Campus", 
        "is_active": True
    },
    {
        "id": 2, 
        "name": "Medicine Faculty", 
        "description": "Medical school and health labs", 
        "campus_location": "North Campus", 
        "is_active": True
    }
]

@router.get("/", response_model=List[FacultyResponse])
def get_all_faculties():
    return mock_db_faculties

@router.post("/", response_model=FacultyResponse, status_code=status.HTTP_201_CREATED)
def create_faculty(faculty: FacultyCreate):
    new_id = len(mock_db_faculties) + 1
    new_faculty = {
        "id": new_id,
        **faculty.model_dump(),
        "is_active": True
    }
    mock_db_faculties.append(new_faculty)
    return new_faculty