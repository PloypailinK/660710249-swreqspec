# รองรับ: CON-TECH-01
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:postgres@localhost:5432/bookingdb",
)
