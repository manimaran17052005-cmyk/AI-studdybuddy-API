def make_recommendation(subject: str, minutes: int):
    if minutes < 30:
        return f"Consider a 30-minute focused {subject} study session."
    if minutes < 60:
        return f"Good progress on {subject}. Add a short practice quiz."
    return f"Strong study session for {subject}. Review mistakes and revise key points."
