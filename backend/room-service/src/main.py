import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# 1. Import engine and Base to trigger automatic table configuration
from infrastructure.database import engine, Base
from infrastructure import models

# 2. Import infrastructure routes
from infrastructure.routes import faculty_routes

if os.getenv("TESTING") != "True":
    Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CAP Room Service",
    description="Microservice for Managing UCE Faculties, Buildings, and Classrooms",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/rooms/health")
def health_check():
    return {
        "service": "CAP Room Service",
        "status": "Active",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

# Register routers
app.include_router(faculty_routes.router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)