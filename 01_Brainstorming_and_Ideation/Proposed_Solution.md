# Proposed Solution

The system uses FastAPI as the REST API layer, MongoDB for persistent storage and JWT for authentication.

AI-related operations are isolated in service modules so an AI provider can be changed without redesigning the whole API.
