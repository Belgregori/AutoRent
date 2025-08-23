import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useFavoritos = () => {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      const timeoutId = setTimeout(() => controller.abort(), 10000); 
      const response = await fetch('http://localhost:63634/api/favoritos', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      

      if (response.ok) {
        const data = await response.json();
        setFavoritos(data);
        if (process.env.NODE_ENV === 'development') {
          console.info(`[useFavoritos] Favoritos cargados exitosamente: ${data.length} productos`);
        }
      } else if (response.status === 401) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useFavoritos] Token expirado (401), redirigiendo al login');
        }
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('email');
        localStorage.removeItem('nombre');
        localStorage.removeItem('apellido');
        navigate('/login');
      } else if (response.status === 403) {
        setError('No tienes permisos para acceder a esta funcionalidad');
      } else if (response.status === 404) {
        setError('Servicio de favoritos no disponible');
      } else if (response.status === 500) {
        setError('Error interno del servidor. Inténtalo más tarde');
      } else if (response.status === 502) {
        setError('Servidor temporalmente no disponible');
      } else if (response.status === 503) {
        setError('Servicio temporalmente no disponible');
      } else if (response.status === 504) {
        setError('El servidor tardó demasiado en responder');
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || `Error del servidor: ${response.status}`;
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error cargando favoritos:', error);
      
      if (error.name === 'AbortError') {
        setError('Timeout: La petición tardó demasiado. Inténtalo de nuevo.');
      } else if (error.message.includes('ERR_INCOMPLETE_CHUNKED_ENCODING')) {
        if (intentos < 3) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[useFavoritos] Reintentando cargar favoritos (intento ${intentos + 1}/3)...`);
          }
          setTimeout(() => cargarFavoritos(intentos + 1), 2000);
          return;
        } else {
          setError('Error de conexión con el servidor después de 3 intentos. Inténtalo manualmente.');
        }
      } else if (error.message.includes('Failed to fetch')) {
        
        setError('No se pudo conectar con el servidor. Verifica tu conexión.');
      } else if (error.message.includes('NetworkError')) {
        setError('Error de red. Verifica tu conexión a internet.');
      } else {
        setError('Error de conexión. Verifica tu conexión a internet.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const agregarFavorito = useCallback(async (productoId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return false;
    }

    try {
      const response = await fetch('http://localhost:63634/api/favoritos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productoId: Number(productoId) })
      });

      
      if (response.ok || response.status === 201) {
        await cargarFavoritos();
        
        localStorage.setItem('favoritosUpdated', Date.now().toString());
        window.dispatchEvent(new Event('favoritosUpdated'));
        
        return true;
      } else if (response.status === 400) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || 'Datos inválidos para agregar favorito';
        setError(errorMessage);
        return false;
      } else if (response.status === 401) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useFavoritos] Token expirado (401) al agregar favorito, redirigiendo al login');
        }
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('email');
        localStorage.removeItem('nombre');
        localStorage.removeItem('apellido');
        navigate('/login');
        return false;
      } else if (response.status === 403) {
        setError('No tienes permisos para agregar favoritos');
        return false;
      } else if (response.status === 409) {
        setError('Este producto ya está en tus favoritos');
        return false;
      } else if (response.status === 500) {
        setError('Error interno del servidor. Inténtalo más tarde');
        return false;
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || `Error del servidor: ${response.status}`;
        setError(errorMessage);
        return false;
      }
    } catch (error) {
      console.error('Error agregando favorito:', error);
      
      if (error.message.includes('Failed to fetch')) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión.');
      } else if (error.message.includes('NetworkError')) {
        setError('Error de red. Verifica tu conexión a internet.');
      } else {
        setError('Error de conexión al agregar favorito');
      }
      return false;
    }
  }, [navigate, cargarFavoritos]);

  const eliminarFavorito = useCallback(async (favoritoId) => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const favorito = favoritos.find(fav => fav.id === favoritoId);
      if (!favorito || !favorito.productoId) {
        setError('No se pudo identificar el producto a eliminar');
        return false;
      }

      const response = await fetch(`http://localhost:63634/api/favoritos/${favorito.productoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok || response.status === 204) {
        setFavoritos(prev => prev.filter(fav => fav.id !== favoritoId));
        
        localStorage.setItem('favoritosUpdated', Date.now().toString());
        window.dispatchEvent(new Event('favoritosUpdated'));
        
        return true;
      } else if (response.status === 400) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || 'Datos inválidos para eliminar favorito';
        setError(errorMessage);
        return false;
      } else if (response.status === 401) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useFavoritos] Token expirado (401) al eliminar favorito, redirigiendo al login');
        }
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('email');
        localStorage.removeItem('nombre');
        localStorage.removeItem('apellido');
        navigate('/login');
        return false;
      } else if (response.status === 403) {
        setError('No tienes permisos para eliminar favoritos');
        return false;
      } else if (response.status === 404) {
        setError('El favorito no fue encontrado');
        return false;
      } else if (response.status === 500) {
        setError('Error interno del servidor. Inténtalo más tarde');
        return false;
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || `Error del servidor: ${response.status}`;
        setError(errorMessage);
        return false;
      }
    } catch (error) {
      console.error('Error eliminando favorito:', error);
      
      if (error.message.includes('Failed to fetch')) {
        setError('No se pudo conectar con el servidor.');
      } else if (error.message.includes('NetworkError')) {
        setError('Error de red.');
      } else {
        setError('Error de conexión al eliminar favorito');
      }
      return false;
    }
  }, [navigate, favoritos]);

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
