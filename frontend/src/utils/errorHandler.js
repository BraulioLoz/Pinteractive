/**
 * Utilidad para manejo de errores de API.
 * Proporciona mensajes de error amigables para el usuario.
 */

/**
 * Obtiene un mensaje de error amigable basado en el código de estado HTTP.
 *
 * @param {Error|number} error - El error o código de estado HTTP
 * @returns {string} - Mensaje de error amigable en español
 */
export function handleApiError(error) {
  // Si es un número, es un código de estado HTTP
  if (typeof error === "number") {
    return getErrorMessageByStatus(error);
  }

  // Si es un objeto Error con mensaje
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Detectar códigos de estado en el mensaje
    if (message.includes("401") || message.includes("no autenticado")) {
      return "Por favor inicia sesión para continuar.";
    }
    if (message.includes("403") || message.includes("permisos")) {
      return "No tienes permisos para realizar esta acción.";
    }
    if (message.includes("404") || message.includes("no encontrado")) {
      return "No se encontró el recurso solicitado.";
    }
    if (message.includes("500") || message.includes("servidor")) {
      return "Error del servidor. Por favor intenta más tarde.";
    }
    if (message.includes("network") || message.includes("fetch")) {
      return "Error de conexión. Verifica tu internet.";
    }

    // Retornar el mensaje original si no se detecta un patrón
    return error.message;
  }

  // Si es un string, retornarlo directamente
  if (typeof error === "string") {
    return error;
  }

  // Mensaje por defecto
  return "Ocurrió un error inesperado. Por favor intenta de nuevo.";
}

/**
 * Obtiene un mensaje de error basado en el código de estado HTTP.
 *
 * @param {number} statusCode - Código de estado HTTP
 * @returns {string} - Mensaje de error amigable
 */
function getErrorMessageByStatus(statusCode) {
  const errorMessages = {
    400: "Solicitud inválida. Verifica los datos ingresados.",
    401: "Por favor inicia sesión para continuar.",
    403: "No tienes permisos para realizar esta acción.",
    404: "No se encontró el recurso solicitado.",
    409: "Ya existe un recurso con estos datos.",
    422: "Los datos proporcionados no son válidos.",
    500: "Error del servidor. Por favor intenta más tarde.",
    502: "El servidor no está disponible temporalmente.",
    503: "Servicio no disponible. Por favor intenta más tarde.",
  };

  return (
    errorMessages[statusCode] ||
    `Error ${statusCode}. Por favor intenta de nuevo.`
  );
}

/**
 * Muestra un error en la consola y retorna un mensaje amigable.
 * Útil para logging y debugging.
 *
 * @param {Error} error - El error a manejar
 * @param {string} context - Contexto donde ocurrió el error (opcional)
 * @returns {string} - Mensaje de error amigable
 */
export function logAndHandleError(error, context = "") {
  const friendlyMessage = handleApiError(error);
  const logMessage = context
    ? `[${context}] ${error.message || error}`
    : error.message || error;

  console.error(logMessage, error);
  return friendlyMessage;
}

