import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            dbname=os.getenv("DB_NAME")
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise e

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS rooms (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL,
                capacity INTEGER NOT NULL,
                type VARCHAR(50) NOT NULL,
                is_active BOOLEAN DEFAULT TRUE
            );
        """)
        conn.commit()
        print("PostgreSQL database connected and rooms table synchronized.")
    except Exception as e:
        print(f"Error synchronizing database: {e}")
    finally:
        cursor.close()
        conn.close()

# Initialize the database upon module load
init_db()