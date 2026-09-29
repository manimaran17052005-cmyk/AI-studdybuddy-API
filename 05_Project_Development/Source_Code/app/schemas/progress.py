from pydantic import BaseModel, Field

class ProgressCreate(BaseModel):
    subject: str
    minutes: int = Field(ge=1)
    score: float | None = Field(default=None, ge=0, le=100)
