from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import discovery, posts
from .database import engine
from . import models

# Crear las tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Pinteractive API",
    description="API para la aplicación Pinteractive - compartir y descubrir imágenes",
    version="1.0.0"
)

# Configuración de CORS para permitir peticiones del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default
        "http://localhost:3000",  # Alternativa común
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(discovery.router)
app.include_router(posts.router)


@app.get("/")
def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "Pinteractive API is running"}
