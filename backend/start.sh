#!/usr/bin/env bash
# Script para iniciar el servidor FastAPI en producción
# Render inyecta automáticamente la variable $PORT

uvicorn app.main:app --host 0.0.0.0 --port $PORT

