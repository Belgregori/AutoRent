import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './UserNavControls.module.css';

export const UserNavControls = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [index, setIndex] = useState(1);
  const [max, setMax] = useState(1);

  useEffect(() => {
    const currentPath = location.pathname;
    let navOrder;
    try {
      navOrder = JSON.parse(sessionStorage.getItem('navOrder') || 'null');
    } catch {
      navOrder = null;
    }
    // Siempre la página 1 es Home ('/')
    if (!Array.isArray(navOrder) || navOrder.length === 0) {
      navOrder = ['/'];
      sessionStorage.setItem('navOrder', JSON.stringify(navOrder));
    }
    if (currentPath !== '/' && !navOrder.includes(currentPath)) {
      navOrder = [...navOrder, currentPath];
      sessionStorage.setItem('navOrder', JSON.stringify(navOrder));
    }
    const idx = navOrder.indexOf(currentPath) + 1;
    setIndex(idx > 0 ? idx : 1);
    setMax(navOrder.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className={styles.navBar} role="navigation" aria-label="Navegación de páginas">
      <div className={styles.counter} aria-live="polite">Página {index} de {max}</div>
      <div className={styles.actions}>
        <button type="button" className={styles.btn} onClick={() => navigate('/')}>Inicio</button>
        <button type="button" className={styles.btn} onClick={() => navigate(-1)}>Atrás</button>
        <button type="button" className={styles.btn} onClick={() => navigate(1)}>Adelante</button>
      </div>
    </div>
  );
};

