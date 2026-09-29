import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME = os.getenv("DATABASE_NAME", "ai_studybuddy")
    JWT_SECRET = os.getenv("JWT_SECRET", "change-me")
    JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))
    AI_API_KEY = os.getenv("AI_API_KEY", "")

settings = Settings()
