# Risk Management

| Risk | Mitigation |
|---|---|
| AI API unavailable | Keep AI service abstraction and demo fallback |
| Database unavailable | Validate connection and use clear errors |
| API key exposure | Store secrets in `.env` |
| Invalid input | Pydantic validation |
| Unauthorized access | JWT authentication |
