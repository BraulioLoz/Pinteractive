from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session 
from typing import List, Optional
from datetime import datetime
from .. import models, schemas, database
from ..dependencies import get_current_user # func de seguridad. 

router = APIRouter(
    prefix="/posts",
    tags=["posts"]
)

# 1. CREATE (crear post)
# se necesita autenticación. (x-user-id)

@router.post("/", response_model=schemas.PostResponse)
def create_post(
    post: schemas.PostCreate, 
    db: Session = Depends(database.get_db), 
    current_user: str = Depends(get_current_user)
): 
    new_post = models.Post(**post.dict(), owner=current_user)
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post 

# 2. READ ALL (Listar post con paginación y sincronización)
# Accesible para todos (no necesita autenticación [x-user-id])
@router.get("/", response_model=List[schemas.PostResponse])
def read_posts(
    skip: int = 0, # cuantos saltar
    limit: int = 10, # cuantos traer.
    after_date: Optional[datetime] = None, # Filtrado por fecha (Sync)
    db: Session = Depends(database.get_db)
): 
    query = db.query(models.Post)

    # Si se proporciona after_date, filtrar posts creados después de esa fecha
    if after_date:
        query = query.filter(models.Post.created_at > after_date)

    # Ordenar por fecha descendente (más reciente primero)
    post = query.order_by(models.Post.created_at.desc()).offset(skip).limit(limit).all()
    return post

# 3. READ ONE (Obtener solo 1) 
@router.get("/{post_id}", response_model=schemas.PostResponse)
def read_post(post_id: int, db: Session = Depends(database.get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post: 
        raise HTTPException(status_code=404, detail="Post no encontrado")
    return post

# 4. UPDATE (Actualizar post)
# Protegido, necesita autenticación. (x-user-id)
@router.put("/{post_id}", response_model=schemas.PostResponse)
def update_post(
    post_id: int,
    updated_post: schemas.PostCreate,
    db: Session = Depends(database.get_db),
    current_user: str = Depends(get_current_user)
):
    # buscamos post (mantener como query para poder hacer update)
    post_query = db.query(models.Post).filter(models.Post.id == post_id)
    post = post_query.first()
    
    if not post: 
        raise HTTPException(status_code=404, detail="Post no encontrado")
    
    # Validación de usuario. 
    if post.owner != current_user:
        raise HTTPException(status_code=403, detail="No tienes permisos para actualizar este post")
    
    post_query.update(updated_post.dict(), synchronize_session=False)
    db.commit()
    return post_query.first()

# 5. DELETE (Eliminar post)
# Protegido, necesita autenticación. (x-user-id)
@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(database.get_db),
    current_user: str = Depends(get_current_user)
):
    post_query = db.query(models.Post).filter(models.Post.id == post_id)
    post = post_query.first()
    
    if not post: 
        raise HTTPException(status_code=404, detail="Post no encontrado")
    
    # Validación de usuario. 
    if post.owner != current_user:
        raise HTTPException(status_code=403, detail="No tienes permisos para eliminar este post")
    
    db.delete(post)
    db.commit()
    return None