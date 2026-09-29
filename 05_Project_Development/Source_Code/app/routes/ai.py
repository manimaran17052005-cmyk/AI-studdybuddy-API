from fastapi import APIRouter, Depends
from app.schemas.ai import AskRequest, SummarizeRequest
from app.services.ai_service import ask_ai, summarize_text
from app.utils.jwt import get_current_user_id

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/ask")
def ask(data: AskRequest, user_id: str = Depends(get_current_user_id)):
    return {"question": data.question, "answer": ask_ai(data.question)}

@router.post("/summarize")
def summarize(data: SummarizeRequest, user_id: str = Depends(get_current_user_id)):
    return {"summary": summarize_text(data.text)}
