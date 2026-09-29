from pymongo import MongoClient
from app.config import settings

client = MongoClient(settings.MONGODB_URL, serverSelectionTimeoutMS=3000)
db = client[settings.DATABASE_NAME]

users_collection = db["users"]
notes_collection = db["notes"]
quizzes_collection = db["quizzes"]
flashcards_collection = db["flashcards"]
progress_collection = db["progress"]
