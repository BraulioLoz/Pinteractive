from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional


class PostCreate(BaseModel):
    """Schema para crear un nuevo post"""
    title: str
    description: Optional[str] = None
    image_url: str


class PostResponse(BaseModel):
    """Schema para respuesta de post"""
    id: int
    title: str
    description: Optional[str] = None
    image_url: str
    owner: str
    created_at: datetime

    class Config:
        from_attributes = True  # Permite crear desde objetos SQLAlchemy (antes orm_mode)

