from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship

class Users(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    
    notes = relationship("Note", back_populates="owner")
    
class Note(Base):
    __tablename__ = "notes"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(Integer, nullable=False)
    content = Column(String, nullable=False)
    pinned = Column(Boolean, default=False)
    pinned_at = Column(DateTime, nullable=True, default=None)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("Users", back_populates="notes")
    