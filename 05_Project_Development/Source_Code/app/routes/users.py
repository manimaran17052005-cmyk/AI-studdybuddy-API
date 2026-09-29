from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from app.database import users_collection
from app.utils.jwt import get_current_user_id

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me")
def get_me(user_id: str = Depends(get_current_user_id)):
    user = users_collection.find_one(
        {"_id": ObjectId(user_id)},
        {"password_hash": 0}
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user["_id"] = str(user["_id"])
    return user
