from fastapi import FastAPI
from app.routes import auth, users, notes, ai, quizzes, flashcards, progress

app = FastAPI(
    title="AI StudyBuddy API",
    description="AI-powered study assistant REST API",
    version="1.0.0"
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(notes.router)
app.include_router(ai.router)
app.include_router(quizzes.router)
app.include_router(flashcards.router)
app.include_router(progress.router)

@app.get("/")
def home():
    return {"message": "Welcome to AI StudyBuddy API", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "running"}
