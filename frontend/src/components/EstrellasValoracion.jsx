import React, { useState } from 'react';
import styles from './EstrellasValoracion.module.css';

export const EstrellasValoracion = ({ 
  puntuacion, 
  onCambioPuntuacion, 
  soloLectura = false, 
  tamaño = 'normal' 
}) => {
  const [hoverPuntuacion, setHoverPuntuacion] = useState(0);

  const handleClick = (estrella) => {
    if (!soloLectura && onCambioPuntuacion) {
      onCambioPuntuacion(estrella);
    }
  };

  const handleMouseEnter = (estrella) => {
    if (!soloLectura) {
      setHoverPuntuacion(estrella);
    }
  };

  const handleMouseLeave = () => {
    if (!soloLectura) {
      setHoverPuntuacion(0);
    }
  };

  const puntuacionAMostrar = hoverPuntuacion || puntuacion;

  return (
    <div className={`${styles.estrellasContainer} ${styles[tamaño]}`}>
      {[1, 2, 3, 4, 5].map((estrella) => (
        <span
          key={estrella}
          className={`${styles.estrella} ${
            estrella <= puntuacionAMostrar ? styles.activa : styles.inactiva
          }`}
          onClick={() => handleClick(estrella)}
          onMouseEnter={() => handleMouseEnter(estrella)}
          onMouseLeave={handleMouseLeave}
        >
          ★
        </span>
      ))}
    </div>
  );
};