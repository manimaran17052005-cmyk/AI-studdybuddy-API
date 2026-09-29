from pydantic import BaseModel, Field

class FlashcardGenerateRequest(BaseModel):
    topic: str = Field(min_length=1)
    number_of_cards: int = Field(default=5, ge=1, le=20)
