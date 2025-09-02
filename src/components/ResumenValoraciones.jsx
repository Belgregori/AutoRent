import React from 'react';
import { EstrellasValoracion } from './EstrellasValoracion.jsx';
import styles from './ResumenValoraciones.module.css';

export const ResumenValoraciones = ({ resumen }) => {
  if (!resumen || resumen.totalResenas === 0) {
    return (
      <div className={styles.sinValoraciones}>
        <p>No hay valoraciones para este producto.</p>
      </div>
    );
  }

  const porcentajePuntuacion = (puntuacion) => {
    if (resumen.totalResenas === 0) return 0;
    return Math.round((puntuacion / resumen.totalResenas) * 100);
  };

  return (
    <div className={styles.resumenValoraciones}>
      <div className={styles.puntuacionGeneral}>
        <div className={styles.puntuacionMedia}>
          <span className={styles.numeroPuntuacion}>
            {resumen.puntuacionMedia}
          </span>
          <EstrellasValoracion
            puntuacion={Math.round(resumen.puntuacionMedia)}
            soloLectura={true}
            tamaño="grande"
          />
        </div>
        <div className={styles.totalResenas}>
          <span className={styles.numeroTotal}>
            {resumen.totalResenas}
          </span>
          <span className={styles.textoTotal}>
            {resumen.totalResenas === 1 ? 'valoración' : 'valoraciones'}
          </span>
        </div>
      </div>

      <div className={styles.distribucionPuntuaciones}>
        {[5, 4, 3, 2, 1].map((puntuacion) => {
          const cantidad = resumen[`puntuacion${puntuacion}`] || 0;
          const porcentaje = porcentajePuntuacion(cantidad);
          
          return (
            <div key={puntuacion} className={styles.barraPuntuacion}>
              <div className={styles.labelPuntuacion}>
                <span>{puntuacion}</span>
                <EstrellasValoracion
                  puntuacion={1}
                  soloLectura={true}
                  tamaño="pequeña"
                />
              </div>
              <div className={styles.barraContainer}>
                <div 
                  className={styles.barra}
                  style={{ width: `${porcentaje}%` }}
                ></div>
              </div>
              <span className={styles.cantidad}>
                {cantidad}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};