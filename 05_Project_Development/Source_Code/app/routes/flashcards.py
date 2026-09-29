from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from app.database import flashcards_collection
from app.schemas.flashcard import FlashcardGenerateRequest
from app.services.ai_service import generate_flashcards
from app.utils.jwt import get_current_user_id

router = APIRouter(prefix="/flashcards", tags=["Flashcards"])

@router.post("/generate")
def generate(data: FlashcardGenerateRequest, user_id: str = Depends(get_current_user_id)):
    cards = generate_flashcards(data.topic, data.number_of_cards)
    result = flashcards_collection.insert_one({
        "user_id": user_id,
        "topic": data.topic,
        "cards": cards,
        "created_at": datetime.now(timezone.utc)
    })
    return {"id": str(result.inserted_id), "topic": data.topic, "cards": cards}

@router.get("")
def list_flashcards(user_id: str = Depends(get_current_user_id)):
    items = list(flashcards_collection.find({"user_id": user_id}))
    for item in items:
        item["_id"] = str(item["_id"])
    return items
