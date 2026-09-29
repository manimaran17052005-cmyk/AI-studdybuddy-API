from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from app.database import users_collection
from app.schemas.user import UserRegister, UserLogin
from app.utils.security import hash_password, verify_password
from app.utils.jwt import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
def register(data: UserRegister):
    if users_collection.find_one({"email": data.email}):
        raise HTTPException(status_code=409, detail="Email already registered")

    result = users_collection.insert_one({
        "name": data.name,
        "email": data.email,
        "password_hash": hash_password(data.password),
        "created_at": datetime.now(timezone.utc)
    })

    return {
        "message": "Registration successful",
        "user_id": str(result.inserted_id)
    }

@router.post("/login")
def login(data: UserLogin):
    user = users_collection.find_one({"email": data.email})

    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(str(user["_id"]))
    return {"access_token": token, "token_type": "bearer"}
