# 08. API Implementation — AI StudyBuddy API

## 1. Objective
This phase defines the API endpoints used by the AI StudyBuddy application. The API connects the frontend with authentication, study materials, quizzes, flashcards, and progress tracking.

## 2. Suggested Technology
- Backend: Node.js with Express
- Database: MongoDB with Mongoose
- Authentication: JSON Web Tokens (JWT)
- Request format: JSON
- API testing: Postman or Thunder Client

> Adapt the routes and field names to match the actual backend implementation.

## 3. API Base URL
- Local development: `http://localhost:5000/api`
- Production: Replace this with the deployed backend URL.

## 4. Main Endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/auth/register` | Create a user account | Public |
| POST | `/auth/login` | Authenticate a user | Public |
| GET | `/auth/me` | Get the current user's profile | Authenticated |
| GET | `/study-materials` | List study materials | Authenticated |
| POST | `/study-materials` | Add study material | Authenticated / role-based |
| GET | `/quizzes` | List available quizzes | Authenticated |
| GET | `/quizzes/:id` | Get quiz questions | Authenticated |
| POST | `/quizzes/:id/submit` | Submit answers and calculate score | Authenticated |
| GET | `/flashcards` | List flashcards | Authenticated |
| POST | `/flashcards` | Create a flashcard | Authenticated |
| GET | `/progress` | View the current user's progress | Authenticated |
| POST | `/ai/summarize` | Generate a study summary | Authenticated |
| POST | `/ai/generate-questions` | Generate practice questions | Authenticated |

## 5. Example Request and Response

### Login request
`POST /api/auth/login`

```json
{
  "email": "student@example.com",
  "password": "your-password"
}
```

Example successful response:

```json
{
  "message": "Login successful",
  "token": "<jwt-token>",
  "user": {
    "id": "user-id",
    "name": "Student",
    "email": "student@example.com"
  }
}
```

Do not store plain-text passwords. Store a secure password hash, and never return the password or password hash in an API response.

### Submit quiz request
`POST /api/quizzes/quiz-id/submit`

```json
{
  "answers": [
    {
      "questionId": "question-id",
      "selectedOption": "B"
    }
  ]
}
```

Example response:

```json
{
  "score": 1,
  "totalQuestions": 1,
  "percentage": 100
}
```

The example IDs and score are illustrative. The backend must calculate the actual result from stored quiz answers.

## 6. Standard Error Responses
Use suitable HTTP status codes:
- `200 OK`: Request completed.
- `201 Created`: A resource was created.
- `400 Bad Request`: Invalid input.
- `401 Unauthorized`: Missing or invalid authentication.
- `403 Forbidden`: User lacks permission.
- `404 Not Found`: Resource does not exist.
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: Unexpected server error.

Example:

```json
{
  "message": "Invalid request",
  "errors": ["A required field is missing"]
}
```

Avoid returning stack traces, secrets, database details, or provider API keys to clients.

## 7. Authentication and Security
1. Validate and normalize incoming data.
2. Hash passwords using a suitable password-hashing library.
3. Protect private routes with JWT middleware.
4. Enforce ownership checks so users can access only their own progress and private records.
5. Keep AI-provider keys in environment variables on the server.
6. Apply rate limits to login and AI endpoints.
7. Configure CORS for the frontend's trusted origin.
8. Use HTTPS in production.

## 8. AI Endpoint Notes
For `/ai/summarize` and `/ai/generate-questions`:
- Validate the submitted text and its length.
- Set request timeouts and usage limits.
- Handle provider errors and unavailable services.
- Tell users that AI-generated content may need verification.
- Do not send unnecessary personal information to an AI provider.

## 9. API Verification Checklist
- [ ] Valid registration succeeds.
- [ ] Duplicate or invalid registration is handled.
- [ ] Login rejects incorrect credentials.
- [ ] Private endpoints reject requests without a valid token.
- [ ] Users cannot access another user's private progress.
- [ ] Invalid IDs and malformed JSON return safe errors.
- [ ] AI endpoints handle empty input, timeouts, and rate limits.
- [ ] API secrets are not included in frontend code or responses.

## 10. Result
The API layer provides a consistent interface between the frontend and backend. Final endpoint names, access rules, and response fields should be confirmed against the implemented code and tested before deployment.
