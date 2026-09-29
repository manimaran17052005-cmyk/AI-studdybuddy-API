from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from app.database import quizzes_collection
from app.schemas.quiz import QuizGenerateRequest
from app.services.ai_service import generate_quiz
from app.utils.jwt import get_current_user_id

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])

@router.post("/generate")
def generate(data: QuizGenerateRequest, user_id: str = Depends(get_current_user_id)):
    questions = generate_quiz(data.topic, data.number_of_questions)
    result = quizzes_collection.insert_one({
        "user_id": user_id,
        "topic": data.topic,
        "questions": questions,
        "created_at": datetime.now(timezone.utc)
    })
    return {"id": str(result.inserted_id), "topic": data.topic, "questions": questions}

@router.get("")
def list_quizzes(user_id: str = Depends(get_current_user_id)):
    items = list(quizzes_collection.find({"user_id": user_id}))
    for item in items:
        item["_id"] = str(item["_id"])
    return items
