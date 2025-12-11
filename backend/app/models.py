from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from .database import Base


class Post(Base):
    """Modelo SQLAlchemy para posts de imágenes"""
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=False)
    owner = Column(String(50), nullable=False, index=True)  # User identifier from x-user-id header
    created_at = Column(DateTime(timezone=True), server_default=func.now())

