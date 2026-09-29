from pydantic import BaseModel, Field

class AskRequest(BaseModel):
    question: str = Field(min_length=1)

class SummarizeRequest(BaseModel):
    text: str = Field(min_length=1)
