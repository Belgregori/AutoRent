import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from './useNotifications';
import { 
  classifyError, 
  getFriendlyErrorMessage, 
  logError, 
  clearUserSession,
  ERROR_TYPES 
} from '../utils/errorHandler';

export const useErrorHandler = () => {
  const navigate = useNavigate();
  const { showError, showWarning, showInfo } = useNotifications();

  // Función para manejar errores de autenticación
  const handleAuthError = useCallback((error, context = '') => {
    logError(context || 'Auth', error);
    
    // Limpiar sesión del usuario
    clearUserSession();
    
    // Mostrar notificación
    showWarning('Sesión expirada. Redirigiendo al login...');
    
    // Redirigir al login después de un breve delay
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  }, [navigate, showWarning]);

  // Función para manejar errores de red
  const handleNetworkError = useCallback((error, context = '') => {
    logError(context || 'Network', error);
    
    const message = getFriendlyErrorMessage(error);
    showError(message);
  }, [showError]);

  // Función para manejar errores de validación
  const handleValidationError = useCallback((error, context = '') => {
    logError(context || 'Validation', error);
    
    const message = getFriendlyErrorMessage(error);
    showError(message);
  }, [showError]);

  // Función para manejar errores del servidor
  const handleServerError = useCallback((error, context = '') => {
    logError(context || 'Server', error);
    
    const message = getFriendlyErrorMessage(error);
    showError(message);
  }, [showError]);

  // Función principal para manejar cualquier tipo de error
  const handleError = useCallback((error, context = '', options = {}) => {
    const errorType = classifyError(error, options.statusCode);
    
    // Log del error
    logError(context || 'General', error, options);
    
    // Manejar según el tipo
    switch (errorType) {
      case ERROR_TYPES.AUTH:
        if (options.statusCode === 403) {
          // Para 403, solo mostrar mensaje sin redirigir
          showError(getFriendlyErrorMessage(error, 403));
        } else if (options.shouldRedirect !== false) {
          handleAuthError(error, context);
        } else {
          showWarning('Error de autenticación');
        }
        break;
        
      case ERROR_TYPES.NETWORK:
        handleNetworkError(error, context);
        break;
        
      case ERROR_TYPES.VALIDATION:
        handleValidationError(error, context);
        break;
        
      case ERROR_TYPES.SERVER:
        handleServerError(error, context);
        break;
        
      case ERROR_TYPES.UNKNOWN:
      default:
        const message = getFriendlyErrorMessage(error, options.statusCode);
        showError(message);
        break;
    }
    
    // Callback personalizado si se proporciona
    if (options.onError) {
      options.onError(error, errorType);
    }
    
    return errorType;
  }, [
    handleAuthError, 
    handleNetworkError, 
    handleValidationError, 
    handleServerError, 
    showError, 
    showWarning
  ]);

  // Función para manejar respuestas HTTP
  const handleHttpResponse = useCallback((response, context = '', options = {}) => {
    if (response.ok) {
      return true; // Respuesta exitosa
    }
    
    // Crear un error estructurado
    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
    error.status = response.status;
    error.statusText = response.statusText;
    
    // Manejar el error
    return handleError(error, context, {
      statusCode: response.status,
      ...options
    });
  }, [handleError]);

  // Función para manejar errores de fetch
  const handleFetchError = useCallback((error, context = '', options = {}) => {
    // Clasificar el error
    const errorType = classifyError(error);
    
    // Si es un error de timeout, mostrar mensaje específico
    if (error.message.includes('Timeout')) {
      showWarning('La petición tardó demasiado. Inténtalo de nuevo.');
      return ERROR_TYPES.NETWORK;
    }
    
    // Manejar con la función principal
    return handleError(error, context, options);
  }, [handleError, showWarning]);

  return {
    handleError,
    handleAuthError,
    handleNetworkError,
    handleValidationError,
    handleServerError,
    handleHttpResponse,
    handleFetchError,
    classifyError,
    getFriendlyErrorMessage
  };
};
