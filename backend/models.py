from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey
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
    content = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("Users", back_populates="notes")
    