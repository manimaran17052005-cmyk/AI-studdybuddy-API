# Deployment Guide

For deployment, configure environment variables on the hosting platform rather than uploading `.env`.

Typical deployment steps:
1. Provision MongoDB.
2. Provision a Python-compatible hosting service.
3. Add environment variables.
4. Install dependencies.
5. Start with `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
6. Test `/health` and `/docs`.
