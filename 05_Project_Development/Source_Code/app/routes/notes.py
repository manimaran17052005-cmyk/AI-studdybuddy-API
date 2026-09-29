from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from app.database import notes_collection
from app.schemas.note import NoteCreate, NoteUpdate
from app.utils.jwt import get_current_user_id

router = APIRouter(prefix="/notes", tags=["Notes"])

@router.post("")
def create_note(data: NoteCreate, user_id: str = Depends(get_current_user_id)):
    now = datetime.now(timezone.utc)
    result = notes_collection.insert_one({
        "user_id": user_id,
        "title": data.title,
        "content": data.content,
        "created_at": now,
        "updated_at": now
    })
    return {"id": str(result.inserted_id), "message": "Note created"}

@router.get("")
def list_notes(user_id: str = Depends(get_current_user_id)):
    notes = list(notes_collection.find({"user_id": user_id}))
    for note in notes:
        note["_id"] = str(note["_id"])
    return notes

@router.get("/{note_id}")
def get_note(note_id: str, user_id: str = Depends(get_current_user_id)):
    note = notes_collection.find_one({"_id": ObjectId(note_id), "user_id": user_id})
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    note["_id"] = str(note["_id"])
    return note

@router.put("/{note_id}")
def update_note(
    note_id: str,
    data: NoteUpdate,
    user_id: str = Depends(get_current_user_id)
):
    update = {k: v for k, v in data.model_dump().items() if v is not None}
    update["updated_at"] = datetime.now(timezone.utc)

    result = notes_collection.update_one(
        {"_id": ObjectId(note_id), "user_id": user_id},
        {"$set": update}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note updated"}

@router.delete("/{note_id}")
def delete_note(note_id: str, user_id: str = Depends(get_current_user_id)):
    result = notes_collection.delete_one(
        {"_id": ObjectId(note_id), "user_id": user_id}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted"}
