from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from database import SessionLocal
from models import Note
from auth import get_current_user
from models import Users

router = APIRouter(
    prefix="/notes",
    tags=["notes"]
)

class NoteCreate(BaseModel):
    content: str

class NoteResponse(BaseModel):
    id: int
    content: str

    class Config:
        from_attributes = True
        
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[NoteResponse])
def get_notes(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    return db.query(Note).filter(Note.owner_id == user_id).all()

@router.post("/", response_model=NoteResponse)
def create_note(note: NoteCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    db_note = Note(content=note.content, owner_id=user_id)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note
