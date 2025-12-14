# Pinteractive

## Integrantes del equipo
| Fotografía | Nombre | Rol |
|-------------|---------|------|
| <img src="img/Ari.jpeg" width="100" height="100" style="border-radius:50%;object-fit:cover;object-position:center top;"> | **Arindal Contreras** | Desarrollo LogIn y Landing Pages |
| <img src="img/Brau.jpeg" width="100" height="100" style="border-radius:50%;object-fit:cover;object-position:center top;"> | **Braulio Alejandro Lozano Cuevasda** | Diseño del backend  | 
| <img src="" width="100" height="100" style="border-radius:50%;object-fit:cover;object-position:center top;"> | **Brenda Montaño Oseguera** | Desarrollo de Feed Page|
---

## Documentación del Backend

Esta API está construida con **FastAPI** y utiliza **SQLAlchemy** para la base de datos (SQLite).

### 1. Guía de Configuración (Para Frontend Devs)

**Requisitos Previos:**
- Python 3.11+
- Virtualenv (recomendado)

**Pasos de Instalación:**

1.  **Navegar al directorio del backend:**
    ```bash
    cd backend
    ```

2.  **Crear y activar entorno virtual:**
    ```bash
    # Windows
    python -m venv .venv
    .venv\Scripts\activate

    # Mac/Linux
    python3 -m venv .venv
    source .venv/bin/activate
    ```

3.  **Instalar dependencias:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configurar Variables de Entorno (.env):**
    Crea un archivo `.env` en la carpeta `backend/` con las siguientes variables:
    ```env
    UNSPLASH_ACCESS_KEY=tu_api_key_de_unsplash
    ```
    *Nota: Pide la API Key al equipo de backend si no la tienes.*

5.  **Ejecutar el servidor:**
    ```bash
    # Opción 1 (Recomendada)
    uvicorn app.main:app --reload

    # Opción 2 (FastAPI CLI)
    fastapi dev app/main.py
    ```
    El servidor correrá en: `http://localhost:8000`

### 2. Referencia del API

Puedes ver la documentación interactiva y probar los endpoints en:
- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

#### Endpoints Principales

| Método | Endpoint | Descripción | Auth Requerida |
|--------|----------|-------------|----------------|
| `GET` | `/posts` | Lista todos los posts (paginado). | No |
| `GET` | `/posts/{id}` | Obtiene detalles de un post. | No |
| `POST` | `/posts` | Crea un nuevo post. | **Sí** (`x-user-id`) |
| `PUT` | `/posts/{id}` | Actualiza un post existente. | **Sí** (`x-user-id`) |
| `DELETE` | `/posts/{id}` | Elimina un post. | **Sí** (`x-user-id`) |
| `GET` | `/posts/{id}/meta` | Obtiene metadatos para OpenGraph (crawlers). | No |
| `GET` | `/discovery/photos` | Obtiene fotos populares de Unsplash. | No |
| `GET` | `/discovery/search` | Busca fotos en Unsplash. | No |
| `GET` | `/health` | Verifica si el API está corriendo. | No |

### 3. Flujo de Autenticación

Actualmente utilizamos una autenticación simplificada para el MVP.

**Header Requerido:**
Para endpoints protegidos (POST, PUT, DELETE), debes enviar el header `x-user-id` con el identificador del usuario.

**Ejemplo de Fetch (Frontend):**
```javascript
const createPost = async (postData) => {
  const response = await fetch('http://localhost:8000/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': 'usuario_123' // ID del usuario logueado (simulado o de contexto)
    },
    body: JSON.stringify(postData)
  });
  return response.json();
};
```

### 4. Estructura de Datos (Modelos)

**Objeto Post (Respuesta):**
```json
{
  "id": 1,
  "title": "Un atardecer hermoso",
  "description": "Foto tomada en la playa",
  "image_url": "https://images.unsplash.com/photo-...",
  "owner": "usuario_123",
  "created_at": "2023-10-27T10:00:00"
}
```
