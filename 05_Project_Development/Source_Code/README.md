# AI StudyBuddy API - Source Code

## Run from this folder

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Swagger:
http://127.0.0.1:8000/docs

## Authentication

Register first:

`POST /auth/register`

Then login:

`POST /auth/login`

Copy the returned JWT and use the **Authorize** button in Swagger with:

`Bearer YOUR_TOKEN`
