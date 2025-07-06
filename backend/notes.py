from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from database import SessionLocal
from models import Note
from auth import get_current_user
from models import Users

router = APIRouter(
    prefix="/notes",
    tags=["notes"]
)

class NoteCreate(BaseModel):
    title: str
    content: str

class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    pinned: bool
    pinned_at: Optional[datetime] = None

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
    db_note = Note(
        title = note.title, 
        content = note.content,
        pinned=False,
        owner_id = user_id
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    note = db.query(Note).filter(Note.id == note_id, Note.owner_id == current_user["id"]).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return


@router.patch("/{note_id}/pin", response_model=NoteResponse)
def toggle_pin(note_id: int = Path(...), db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    note = db.query(Note).filter(Note.id == note_id, Note.owner_id == current_user["id"]).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    note.pinned = not note.pinned
    note.pinned_at = datetime.utcnow() if note.pinned else None

    db.commit()
    db.refresh(note)
    return note