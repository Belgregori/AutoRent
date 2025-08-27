import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Constantes para manejo de errores
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'No tienes permisos para acceder a esta funcionalidad',
  NOT_FOUND: 'Servicio de favoritos no disponible',
  SERVER_ERROR: 'Error interno del servidor. Inténtalo más tarde',
  SERVER_UNAVAILABLE: 'Servidor temporalmente no disponible',
  TIMEOUT: 'El servidor tardó demasiado en responder',
  NETWORK_ERROR: 'No se pudo conectar con el servidor. Verifica tu conexión',
  CONNECTION_ERROR: 'Error de conexión. Verifica tu conexión a internet',
  INVALID_DATA: 'Datos inválidos para la operación',
  FAVORITE_NOT_FOUND: 'El favorito no fue encontrado',
  ALREADY_FAVORITE: 'Este producto ya está en tus favoritos',
  FAVORITE_ID_ERROR: 'No se pudo identificar el favorito a eliminar'
};

// Constantes para reintentos
const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  DELAY: 2000,
  TIMEOUT: 10000
};

export const useFavoritos = () => {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función auxiliar para limpiar datos de sesión
  const clearSessionData = useCallback(() => {
    const sessionKeys = ['token', 'rol', 'email', 'nombre', 'apellido'];
    sessionKeys.forEach(key => localStorage.removeItem(key));
  }, []);

  // Función auxiliar para manejar errores de autenticación
  const handleAuthError = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[useFavoritos] Token expirado (401), redirigiendo al login');
    }
    clearSessionData();
    navigate('/login');
  }, [clearSessionData, navigate]);

  // Función auxiliar para manejar respuestas HTTP
  const handleHttpResponse = useCallback(async (response, operation) => {
    if (response.ok || response.status === 201 || response.status === 204) {
      return { success: true, data: response.status !== 204 ? await response.json() : null };
    }

    // Manejar errores específicos por código de estado
    switch (response.status) {
      case 400:
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.message || errorData.error || ERROR_MESSAGES.INVALID_DATA 
        };
      
      case 401:
        handleAuthError();
        return { success: false, error: 'Sesión expirada' };
      
      case 403:
        return { success: false, error: ERROR_MESSAGES.UNAUTHORIZED };
      
      case 404:
        return { 
          success: false, 
          error: operation === 'delete' ? ERROR_MESSAGES.FAVORITE_NOT_FOUND : ERROR_MESSAGES.NOT_FOUND 
        };
      
      case 409:
        return { success: false, error: ERROR_MESSAGES.ALREADY_FAVORITE };
      
      case 500:
        return { success: false, error: ERROR_MESSAGES.SERVER_ERROR };
      
      case 502:
      case 503:
        return { success: false, error: ERROR_MESSAGES.SERVER_UNAVAILABLE };
      
      case 504:
        return { success: false, error: ERROR_MESSAGES.TIMEOUT };
      
      default:
        const fallbackErrorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: fallbackErrorData.message || fallbackErrorData.error || `Error del servidor: ${response.status}` 
        };
    }
  }, [handleAuthError]);

  // Función auxiliar para manejar errores de red
  const handleNetworkError = useCallback((error, intentos = 0) => {
    if (error.name === 'AbortError') {
      return ERROR_MESSAGES.TIMEOUT;
    }
    
    if (error.message.includes('ERR_INCOMPLETE_CHUNKED_ENCODING')) {
      return intentos < RETRY_CONFIG.MAX_ATTEMPTS 
        ? null // Retornar null para indicar que se debe reintentar
        : 'Error de conexión con el servidor después de 3 intentos. Inténtalo manualmente.';
    }
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    
    return ERROR_MESSAGES.CONNECTION_ERROR;
  }, []);

  // Función auxiliar para disparar eventos de actualización
  const triggerFavoritosUpdate = useCallback(() => {
    localStorage.setItem('favoritosUpdated', Date.now().toString());
    window.dispatchEvent(new Event('favoritosUpdated'));
  }, []);

  const cargarFavoritos = useCallback(async (intentos = 0) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), RETRY_CONFIG.TIMEOUT);
      
      const response = await fetch('/api/favoritos', {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const result = await handleHttpResponse(response, 'get');
      
      if (result.success) {
        setFavoritos(result.data);
      } else {
        setError(result.error);
      }
      
    } catch (error) {
      console.error('Error cargando favoritos:', error);
      
      const errorMessage = handleNetworkError(error, intentos);
      
      if (errorMessage === null && intentos < RETRY_CONFIG.MAX_ATTEMPTS) {
        // Reintentar automáticamente
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[useFavoritos] Reintentando cargar favoritos (intento ${intentos + 1}/${RETRY_CONFIG.MAX_ATTEMPTS})...`);
        }
        setTimeout(() => cargarFavoritos(intentos + 1), RETRY_CONFIG.DELAY);
        return;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, handleHttpResponse, handleNetworkError]);

  const agregarFavorito = useCallback(async (productoId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return false;
    }

    try {
      const response = await fetch('/api/favoritos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productoId: Number(productoId) })
      });

      const result = await handleHttpResponse(response, 'add');
      
      if (result.success) {
        await cargarFavoritos();
        triggerFavoritosUpdate();
        return true;
      } else {
        setError(result.error);
        return false;
      }
      
    } catch (error) {
      console.error('Error agregando favorito:', error);
      const errorMessage = handleNetworkError(error);
      setError(errorMessage);
      return false;
    }
  }, [navigate, cargarFavoritos, handleHttpResponse, handleNetworkError, triggerFavoritosUpdate]);

  const eliminarFavorito = useCallback(async (favoritoId) => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const favorito = favoritos.find(fav => fav.id === favoritoId);
      if (!favorito) {
        setError(ERROR_MESSAGES.FAVORITE_ID_ERROR);
        return false;
      }

      const response = await fetch(`/api/favoritos/${favorito.producto.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await handleHttpResponse(response, 'delete');
      
      if (result.success) {
        setFavoritos(prev => prev.filter(fav => fav.id !== favoritoId));
        triggerFavoritosUpdate();
        return true;
      } else {
        setError(result.error);
        return false;
      }
      
    } catch (error) {
      console.error('Error eliminando favorito:', error);
      const errorMessage = handleNetworkError(error);
      setError(errorMessage);
      return false;
    }
  }, [navigate, favoritos, handleHttpResponse, handleNetworkError, triggerFavoritosUpdate]);

  const esFavorito = useCallback((productoId) => {
    return favoritos.some(fav => String(fav.productoId) === String(productoId));
  }, [favoritos]);

  const toggleFavorito = useCallback(async (productoId) => {
    const esFav = esFavorito(productoId);
    
    if (esFav) {
      const favorito = favoritos.find(fav => String(fav.productoId) === String(productoId));
      if (favorito) {
        return await eliminarFavorito(favorito.id);
      }
    } else {
      return await agregarFavorito(productoId);
    }
    
    return false;
  }, [esFavorito, favoritos, eliminarFavorito, agregarFavorito]);

  useEffect(() => {
    cargarFavoritos();
    
    const handleFavoritosUpdate = () => {
      cargarFavoritos();
    };
    
    window.addEventListener('storage', handleFavoritosUpdate);
    window.addEventListener('favoritosUpdated', handleFavoritosUpdate);
    
    return () => {
      window.removeEventListener('storage', handleFavoritosUpdate);
      window.removeEventListener('favoritosUpdated', handleFavoritosUpdate);
    };
  }, [cargarFavoritos]);

  return {
    favoritos,
    isLoading,
    error,
    cargarFavoritos,
    agregarFavorito,
    eliminarFavorito,
    esFavorito,
    toggleFavorito,
    setError
  };
};
