from fastapi import Header, HTTPException

# Función que se ejecuta automáticamente antes de entrar a rutas protegidas. 
# busca 'x-user-id' 

async def get_current_user(x_user_id: str = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Usuario no autenticado")
    return x_user_id