/**
 * Utilidades para manejo centralizado de errores
 */

// Tipos de errores comunes
export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  AUTH: 'AUTH',
  VALIDATION: 'VALIDATION',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN'
};

// Mapeo de códigos HTTP a tipos de error
export const HTTP_ERROR_MAPPING = {
  400: ERROR_TYPES.VALIDATION,
  401: ERROR_TYPES.AUTH,
  403: ERROR_TYPES.AUTH,
  404: ERROR_TYPES.VALIDATION,
  409: ERROR_TYPES.VALIDATION,
  500: ERROR_TYPES.SERVER,
  502: ERROR_TYPES.SERVER,
  503: ERROR_TYPES.SERVER,
  504: ERROR_TYPES.SERVER
};

// Función para clasificar errores
export const classifyError = (error, statusCode = null) => {
  // Si tenemos un código HTTP, usarlo para clasificar
  if (statusCode && HTTP_ERROR_MAPPING[statusCode]) {
    return HTTP_ERROR_MAPPING[statusCode];
  }

  // Clasificar por mensaje de error
  const message = error.message || error.toString();
  
  if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
    return ERROR_TYPES.NETWORK;
  }
  
  if (message.includes('401') || message.includes('unauthorized') || message.includes('token')) {
    return ERROR_TYPES.AUTH;
  }
  
  if (message.includes('400') || message.includes('validation') || message.includes('invalid')) {
    return ERROR_TYPES.VALIDATION;
  }
  
  if (message.includes('500') || message.includes('server') || message.includes('internal')) {
    return ERROR_TYPES.SERVER;
  }
  
  return ERROR_TYPES.UNKNOWN;
};

// Función para obtener mensaje de error amigable
export const getFriendlyErrorMessage = (error, statusCode = null) => {
  const errorType = classifyError(error, statusCode);
  
  switch (errorType) {
    case ERROR_TYPES.NETWORK:
      return 'Error de conexión. Verifica tu conexión a internet.';
    
    case ERROR_TYPES.AUTH:
      if (statusCode === 403) {
        return 'No cuenta con los permisos necesarios para realizar esta acción.';
      }
      return 'Sesión expirada. Por favor, inicia sesión nuevamente.';
    
    case ERROR_TYPES.VALIDATION:
      return 'Datos inválidos. Verifica la información ingresada.';
    
    case ERROR_TYPES.SERVER:
      return 'Error del servidor. Inténtalo más tarde.';
    
    case ERROR_TYPES.UNKNOWN:
    default:
      return 'Ocurrió un error inesperado. Inténtalo nuevamente.';
  }
};

// Función para logging profesional
export const logError = (context, error, additionalInfo = {}) => {
  if (process.env.NODE_ENV === 'development') {
    const errorInfo = {
      context,
      error: error.message || error.toString(),
      stack: error.stack,
      timestamp: new Date().toISOString(),
      ...additionalInfo
    };
    
    console.group(`[${context}] Error`);
    console.error('Error details:', errorInfo);
    console.groupEnd();
  }
};

// Función para limpiar sesión del usuario
export const clearUserSession = () => {
  const keysToRemove = ['token', 'rol', 'email', 'nombre', 'apellido'];
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

// Función para validar token
export const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Verificar si el token no está expirado (JWT básico)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    return payload.exp > currentTime;
  } catch (error) {
    // Si no se puede parsear, asumir que es inválido
    return false;
  }
};

// Función para manejar errores de fetch con timeout
export const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Timeout: La petición tardó demasiado');
    }
    
    throw error;
  }
};
