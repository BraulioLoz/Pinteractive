from fastapi import APIRouter, Query
from typing import List
from ..services import unsplash

router = APIRouter(
    prefix="/discovery",
    tags=["discovery"]
)

def transform_photo_data(photo):
    """
    Transforma los datos de Unsplash a un formato limpio para el frontend.
    Incluye UTM parameters según los términos de uso de Unsplash.
    """
    # Construir el profile_link con UTM parameters (requerido por Unsplash ToS)
    base_profile_url = photo["user"]["links"]["html"]
    profile_link = f"{base_profile_url}?utm_source=pinteractive&utm_medium=referral"
    
    return {
        "id": photo["id"],
        "description": photo.get("alt_description") or photo.get("description") or "Sin descripción",
        "url": photo["urls"]["regular"],
        "thumb": photo["urls"]["thumb"],
        "user": {
            "name": photo["user"]["name"],
            "username": photo["user"]["username"],
            "profile_link": profile_link
        }
    }

@router.get("/photos")
def fetch_discovery_photos(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=30),
    order_by: str = Query("popular", regex="^(latest|oldest|popular)$")
):
    """
    Obtiene fotos para discovery/feed y las transforma para el frontend
    """
    # Llama al servicio genérico
    photos = unsplash.get_discovery_photos(page=page, per_page=per_page, order_by=order_by)
    
    # TRANSFORMACIÓN DE DATOS (como en el código de Gemini)
    clean_data = [transform_photo_data(photo) for photo in photos]
    
    return clean_data

@router.get("/search")
def search_photos(
    query: str = Query(..., min_length=1),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=30),
    orientation: str = Query(None, regex="^(landscape|portrait|squarish)$"),
    order_by: str = Query("relevant", regex="^(relevant|latest)$"),
    color: str = Query(None, regex="^(black_and_white|black|white|yellow|orange|red|purple|magenta|green|teal|blue)$"),
    content_filter: str = Query("low", regex="^(low|high)$")
):
    """
    Busca fotos y las transforma para el frontend.
    
    Args:
        query: Término de búsqueda (requerido)
        page: Número de página (default: 1)
        per_page: Items por página (default: 10, max: 30)
        orientation: Filtrar por orientación (landscape, portrait, squarish)
        order_by: Criterio de ordenamiento (relevant, latest) - default: relevant
        color: Filtrar por color predominante
        content_filter: Nivel de seguridad de contenido (low, high) - default: low
    """
    result = unsplash.search_photos(
        query=query, 
        page=page, 
        per_page=per_page,
        orientation=orientation,
        order_by=order_by,
        color=color,
        content_filter=content_filter
    )
    
    # Transformar los resultados de búsqueda
    clean_data = [transform_photo_data(photo) for photo in result.get("results", [])]
    
    return {
        "total": result.get("total", 0),
        "total_pages": result.get("total_pages", 0),
        "results": clean_data
    }