from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from app.database import progress_collection
from app.schemas.progress import ProgressCreate
from app.services.recommendation_service import make_recommendation
from app.utils.jwt import get_current_user_id

router = APIRouter(prefix="/progress", tags=["Progress"])

@router.post("")
def add_progress(data: ProgressCreate, user_id: str = Depends(get_current_user_id)):
    result = progress_collection.insert_one({
        "user_id": user_id,
        "subject": data.subject,
        "minutes": data.minutes,
        "score": data.score,
        "created_at": datetime.now(timezone.utc)
    })
    return {
        "id": str(result.inserted_id),
        "recommendation": make_recommendation(data.subject, data.minutes)
    }

@router.get("")
def get_progress(user_id: str = Depends(get_current_user_id)):
    items = list(progress_collection.find({"user_id": user_id}))
    for item in items:
        item["_id"] = str(item["_id"])
    return items
