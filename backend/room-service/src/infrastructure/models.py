from sqlalchemy import Column, Integer, String, Boolean
from infrastructure.database import Base

class FacultyModel(Base):
    __tablename__ = "faculties"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    campus_location = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)