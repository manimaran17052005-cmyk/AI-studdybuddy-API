# AI StudyBuddy API

A FastAPI + MongoDB backend for an AI-powered study assistant.

## Features
- JWT authentication
- Student profile
- Notes CRUD
- AI doubt answering (mock mode included)
- AI note summarization (mock mode included)
- Quiz generation
- Flashcard generation
- Study progress tracking
- Personalized recommendations
- Swagger API documentation

## Project Structure
See `05_Project_Development/Source_Code`.

## Run
```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open http://127.0.0.1:8000/docs

Copy `.env.example` to `.env` and configure MongoDB. AI features work in demo/mock mode when no AI API key is supplied.
