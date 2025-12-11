import os
import requests
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")
UNSPLASH_BASE_URL = "https://api.unsplash.com"

# Headers para la API. 
def get_headers():
    """Devuelve headers para la API de Unsplash."""
    if not UNSPLASH_ACCESS_KEY:
        raise HTTPException(status_code=500, detail="API key no configurada")
    return {
        "Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"
    }

def get_discovery_photos(page: int = 1, per_page: int = 10, order_by: str = "popular"):
    """
    Obtiene fotos para discovery/feed (fotos populares)
    
    Args:
        page: Número de página
        per_page: Resultados por página (max: 30)
        order_by: Orden (latest, oldest, popular)
    
    Returns:
        list: Lista de fotos de Unsplash (datos completos)
    """
    url = f"{UNSPLASH_BASE_URL}/photos"
    params = {
        "page": page,
        "per_page": min(per_page, 30),
        "order_by": order_by
    }
    
    try:
        response = requests.get(url, headers=get_headers(), params=params)
        
        if response.status_code != 200:
            print(f"Error Unsplash: {response.text}")
            raise HTTPException(
                status_code=response.status_code, 
                detail="Error al conectar con el servicio de imágenes externas."
            )
        
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error de conexión: {e}")
        raise HTTPException(
            status_code=503, 
            detail="Servicio de descubrimiento no disponible temporalmente."
        )

def search_photos(
    query: str, 
    page: int = 1, 
    per_page: int = 10, 
    orientation: str = None,
    order_by: str = "relevant",
    color: str = None,
    content_filter: str = "low"
): 
    """
    Busca fotos en Unsplash basado en una query
    
    Args:
        query: Término de búsqueda
        page: Número de página (default: 1)
        per_page: Resultados por página (max: 30, default: 10)
        orientation: Orientación de la foto (landscape, portrait, squarish)
        order_by: Criterio de ordenamiento (relevant, latest) - default: relevant
        color: Filtrar por color (black_and_white, black, white, yellow, orange, red, purple, magenta, green, teal, blue)
        content_filter: Nivel de seguridad de contenido (low, high) - default: low
    
    Returns:
        dict: Respuesta de la API de Unsplash con las fotos
    """
    url = f"{UNSPLASH_BASE_URL}/search/photos"
    params = {
        "query": query,
        "page": page,
        "per_page": min(per_page, 30),
        "order_by": order_by,
        "content_filter": content_filter
    }
    
    # Agregar parámetros opcionales solo si tienen valor
    if orientation:
        params["orientation"] = orientation
    if color:
        params["color"] = color
    
    try:
        response = requests.get(url, headers=get_headers(), params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al buscar fotos en Unsplash: {str(e)}"
        )
