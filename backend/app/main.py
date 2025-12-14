import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import discovery 
from .routers import posts
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
# Lee ALLOWED_ORIGINS desde variable de entorno, con fallback a localhost para desarrollo
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
if allowed_origins_env:
    # Si hay variable de entorno, separar por comas y limpiar espacios
    allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",")]
else:
    # Default para desarrollo local
    allowed_origins = [
        "http://localhost:5173",  # Vite default
        "http://localhost:3000",  # Alternativa común
        "http://127.0.0.1:5173",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(discovery.router)
app.include_router(posts.router)


@app.get("/")
def root():
    """Documentación de endpoints de la API"""
    return {
        "name": "Pinteractive API",
        "description": "API para compartir y descubrir imágenes",
        "documentation": {
            "swagger_ui": "/docs",
            "redoc": "/redoc",
            "openapi_schema": "/openapi.json"
        },
        "endpoints": {
            "posts": {
                "create_post": "POST /posts",
                "list_posts": "GET /posts?skip=0&limit=10&after_date=...",
                "get_post": "GET /posts/{post_id}",
                "get_post_meta": "GET /posts/{post_id}/meta",
                "update_post": "PUT /posts/{post_id}",
                "delete_post": "DELETE /posts/{post_id}"
            },
            "discovery": {
                "get_photos": "GET /discovery/photos?page=1&per_page=10&order_by=popular",
                "search_photos": "GET /discovery/search?query=...&page=1&per_page=10"
            },
            "health": "GET /health"
        },
        "authentication": {
            "method": "Header-based",
            "header_name": "x-user-id",
            "protected_endpoints": [
                "POST /posts",
                "PUT /posts/{post_id}",
                "DELETE /posts/{post_id}"
            ]
        }
    }

@app.get("/health")
def health():
    """Health check endpoint"""
    return {"status": "ok", "message": "Pinteractive API corriendo"}