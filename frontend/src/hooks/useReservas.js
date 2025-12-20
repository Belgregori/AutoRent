import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();



  const obtenerDisponibilidad = useCallback(async (productoId, meses = 6) => {
    try {
      const response = await fetch(`/api/reservas/producto/${productoId}/disponibilidad?meses=${meses}`);
      if (!response.ok) throw new Error('Error al obtener disponibilidad');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return { fechasDisponibles: [], fechasOcupadas: [] };
    }
  }, []);

  const obtenerReservasUsuario = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/reservas/usuario', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        setError('Sesión expirada. Por favor inicia sesión nuevamente.');
        navigate('/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setReservas(data);
      } else {
        setError(`Error al obtener reservas: ${response.status}`);
      }
    } catch (error) {
      console.error('Error obteniendo reservas:', error);
      setError('Error de conexión. Verifica tu internet e inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const cancelarReserva = useCallback(async (reservaId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return false;
    }

    try {
      const response = await fetch(`/api/reservas/${reservaId}/cancelar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        navigate('/login');
        return false;
      }

      if (response.ok) {
        setReservas(prev => prev.filter(r => r.id !== reservaId));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error cancelando reserva:', error);
      return false;
    }
  }, [navigate]);

  const eliminarReserva = useCallback(async (reservaId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return false;
    }

    try {
      const response = await fetch(`/api/reservas/usuario/${reservaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        navigate('/login');
        return false;
      }

      if (response.ok) {
        setReservas(prev => prev.filter(r => r.id !== reservaId));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error eliminando reserva:', error);
      return false;
    }
  }, [navigate]);

  const confirmarReserva = useCallback(async (reservaId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return false;
    }

    try {
      const response = await fetch(`/api/reservas/usuario/${reservaId}/confirmar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        navigate('/login');
        return false;
      }

      if (response.ok) {
        // Actualizar estado local
        setReservas(prev => 
          prev.map(r => 
            r.id === reservaId 
              ? { ...r, estado: 'CONFIRMADA' }
              : r
          )
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error confirmando reserva:', error);
      return false;
    }
  }, [navigate]);

  return {
    reservas,
    obtenerDisponibilidad,
    obtenerReservasUsuario,
    cancelarReserva,
    eliminarReserva,
    confirmarReserva,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};
