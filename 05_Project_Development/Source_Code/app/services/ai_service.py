def ask_ai(question: str) -> str:
    # Demo mode. Replace this function with your chosen AI provider SDK/API.
    return (
        f"StudyBuddy demo answer: {question}. "
        "Configure AI_API_KEY and connect your preferred AI provider "
        "inside this service for real AI-generated answers."
    )

def summarize_text(text: str) -> str:
    # Simple demo fallback.
    words = text.split()
    preview = " ".join(words[:60])
    return (
        "Demo summary: " + preview +
        ("..." if len(words) > 60 else "")
    )

def generate_quiz(topic: str, count: int):
    return [
        {
            "question": f"What is an important concept in {topic}?",
            "options": ["Concept A", "Concept B", "Concept C", "Concept D"],
            "answer": "Concept A"
        }
        for _ in range(count)
    ]

def generate_flashcards(topic: str, count: int):
    return [
        {
            "front": f"{topic} - key concept {i + 1}",
            "back": f"Review the definition and example of concept {i + 1}."
        }
        for i in range(count)
    ]
