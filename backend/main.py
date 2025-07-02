import uvicorn
from fastapi import FastAPI, status, Depends, HTTPException
from database import engine, SessionLocal
from typing import Annotated
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import auth
import notes
from auth import get_current_user, router
import models
from notes import router

app = FastAPI()
app.include_router(auth.router)
app.include_router(notes.router)

models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@app.get("/", status_code=status.HTTP_200_OK)
async def user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    return {"User": user}