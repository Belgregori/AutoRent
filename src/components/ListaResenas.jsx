import React from 'react';
import { EstrellasValoracion } from './EstrellasValoracion.jsx';
import styles from './ListaResenas.module.css';

export const ListaResenas = ({ resenas }) => {
  if (!resenas || resenas.length === 0) {
    return (
      <div className={styles.sinResenas}>
        <p>No hay reseñas para este producto aún.</p>
        <p>¡Sé el primero en compartir tu experiencia!</p>
      </div>
    );
  }

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.listaResenas}>
      <h3 className={styles.titulo}>Reseñas de usuarios</h3>
      
      <div className={styles.resenasContainer}>
        {resenas.map((resena) => (
          <div key={resena.id} className={styles.resenaItem}>
            <div className={styles.resenaHeader}>
              <div className={styles.usuarioInfo}>
                <span className={styles.nombreUsuario}>
                  {resena.nombreUsuario || resena.usuario?.nombre || 'Usuario Anónimo'} {resena.apellidoUsuario || resena.usuario?.apellido || ''}
                </span>
                <span className={styles.fecha}>
                  {formatearFecha(resena.fechaCreacion || resena.fecha_creacion)}
                </span>
              </div>
              <div className={styles.puntuacionContainer}>
                <EstrellasValoracion
                  puntuacion={resena.puntuacion}
                  soloLectura={true}
                  tamaño="pequeña"
                />
                <span className={styles.puntuacionNumero}>
                  {resena.puntuacion}/5
                </span>
              </div>
            </div>
            
            <div className={styles.comentario}>
              {resena.comentario}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};