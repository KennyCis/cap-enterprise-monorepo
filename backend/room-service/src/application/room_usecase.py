from src.infrastructure.database import get_db_connection
from src.domain.room_model import RoomCreateDTO
from psycopg2.extras import RealDictCursor

class RoomUseCase:
    def create_room(self, room_data: RoomCreateDTO):
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        try:
            cursor.execute("""
                INSERT INTO rooms (name, capacity, type)
                VALUES (%s, %s, %s) RETURNING *;
            """, (room_data.name, room_data.capacity, room_data.type))
            
            new_room = cursor.fetchone()
            conn.commit()
            return {"message": "Room created successfully", "data": new_room}
        except Exception as e:
            conn.rollback()
            raise Exception(f"Failed to create room: {str(e)}")
        finally:
            cursor.close()
            conn.close()

    def get_all_rooms(self):
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        try:
            cursor.execute("SELECT * FROM rooms;")
            rooms = cursor.fetchall()
            return {"data": rooms}
        except Exception as e:
            raise Exception(f"Failed to retrieve rooms: {str(e)}")
        finally:
            cursor.close()
            conn.close()

room_usecase = RoomUseCase()