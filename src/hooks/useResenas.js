import { useState, useCallback } from 'react';

export const useResenas = () => {
  const [resenas, setResenas] = useState([]);
  const [resumenValoraciones, setResumenValoraciones] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerResenas = useCallback(async (productoId) => {
    if (!productoId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/resenas/producto/${productoId}`);
      
      if (response.status === 401) {
        setError('Sesión expirada. Por favor inicia sesión nuevamente.');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Error al cargar las reseñas');
      }
      
      const data = await response.json();
      setResenas(data);
    } catch (error) {
      setError(error.message);
      console.error('Error cargando reseñas:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const obtenerResumenValoraciones = useCallback(async (productoId) => {
    if (!productoId) return;
    
    try {
      const response = await fetch(`/api/resenas/producto/${productoId}/resumen`);
      
      if (response.status === 401) {
        console.error('Token expirado al obtener resumen de valoraciones');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Error al cargar el resumen de valoraciones');
      }
      
      const data = await response.json();
      setResumenValoraciones(data);
    } catch (error) {
      console.error('Error cargando resumen de valoraciones:', error);
    }
  }, []);

  const crearResena = useCallback(async (resenaData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Debes iniciar sesión para crear reseñas');
    }

    const response = await fetch('/api/resenas', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resenaData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear la reseña');
    }

    const nuevaResena = await response.json();
    return nuevaResena;
  }, []);

  const verificarPuedeValorar = useCallback(async (productoId) => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const response = await fetch(`/api/resenas/producto/${productoId}/puede-valorar`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        return await response.json();
      }
      return false;
    } catch (error) {
      console.error('Error verificando si puede valorar:', error);
      return false;
    }
  }, []);

  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  return {
    resenas,
    resumenValoraciones,
    isLoading,
    error,
    obtenerResenas,
    obtenerResumenValoraciones,
    crearResena,
    verificarPuedeValorar,
    limpiarError
  };
};