from pydantic import BaseModel, Field

class NoteCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(min_length=1)

class NoteUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
