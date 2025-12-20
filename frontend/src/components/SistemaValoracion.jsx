import React, { useState, useEffect } from 'react';
import { EstrellasValoracion } from './EstrellasValoracion.jsx';
import { useResenas } from '../hooks/useResenas.js';
import styles from './SistemaValoracion.module.css';

export const SistemaValoracion = ({ producto, onResenaCreada }) => {
  const [puntuacion, setPuntuacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [puedeValorar, setPuedeValorar] = useState(false);
  
  const { crearResena, verificarPuedeValorar } = useResenas();

  useEffect(() => {
    const verificarPermisos = async () => {
      if (producto?.id) {
        const puede = await verificarPuedeValorar(producto.id);
        setPuedeValorar(puede);
      }
    };

    verificarPermisos();
  }, [producto, verificarPuedeValorar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    setIsSubmitting(true);

    try {
      // Obtener la primera reserva del usuario para este producto
      const reservaId = await obtenerReservaId();
      
      if (!reservaId) {
        throw new Error('No tienes reservas para este producto');
      }

      // Crear la reseña
      const resenaData = {
        reservaId,
        puntuacion,
        comentario: comentario.trim()
      };
      
      await crearResena(resenaData);

      // Limpiar formulario
      limpiarFormulario();
      
      // Notificar al componente padre
      if (onResenaCreada) {
        onResenaCreada();
      }

    } catch (error) {
      console.error('Error creando reseña:', error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validarFormulario = () => {
    if (puntuacion < 1 || puntuacion > 5) {
      alert('Debes seleccionar una puntuación entre 1 y 5 estrellas');
      return false;
    }

    if (!comentario.trim()) {
      alert('Debes escribir un comentario');
      return false;
    }

    if (comentario.trim().length < 10) {
      alert('El comentario debe tener al menos 10 caracteres');
      return false;
    }

    return true;
  };

  const obtenerReservaId = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/reservas/usuario', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener reservas');
    }

    const reservas = await response.json();
    const reservaProducto = reservas.find(r => r.producto.id === producto.id);
    
    return reservaProducto?.id;
  };

  const limpiarFormulario = () => {
    setPuntuacion(0);
    setComentario('');
  };

  if (!puedeValorar) {
    return null;
  }

  return (
    <div className={styles.sistemaValoracion}>
      <h3 className={styles.titulo}>Valora este producto</h3>
      
      <form onSubmit={handleSubmit} className={styles.formulario}>
        <div className={styles.puntuacionSection}>
          <label className={styles.label}>Tu puntuación:</label>
          <EstrellasValoracion
            puntuacion={puntuacion}
            onCambioPuntuacion={setPuntuacion}
            tamaño="grande"
          />
        </div>

        <div className={styles.comentarioSection}>
          <label htmlFor="comentario" className={styles.label}>
            Tu comentario:
          </label>
          <textarea
            id="comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Comparte tu experiencia con este producto..."
            className={styles.textarea}
            rows="4"
            maxLength="1000"
            required
          />
          <span className={styles.contador}>
            {comentario.length}/1000
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || puntuacion < 1 || puntuacion > 5 || !comentario.trim() || comentario.trim().length < 10}
          className={styles.btnEnviar}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Valoración'}
        </button>
      </form>
    </div>
  );
};