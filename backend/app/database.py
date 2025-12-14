import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Obtener URL de base de datos desde variable de entorno, con fallback a SQLite
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./pinteractive.db")

# Configurar engine según el tipo de base de datos
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    # SQLite necesita connect_args específicos
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False}  # SQLite specific
    )
else:
    # Para PostgreSQL u otras bases de datos (si se usa en el futuro)
    # Si viene de Render con prefijo postgres://, cambiarlo a postgresql://
    if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency que provee una sesión de base de datos"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

