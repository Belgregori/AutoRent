import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Footer } from './Footer';
import styles from './AdminDesktopOnly.module.css';

export const AdminDesktopOnly = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <>
        <Header />
        <div className={styles.blockedContainer}>
          <div className={styles.blockedMessage}>
            <div className={styles.icon}>⚠️</div>
            <h2 className={styles.title}>Acceso Restringido</h2>
            <p className={styles.message}>
              Esta sección solo está disponible desde una computadora.
            </p>
            <p className={styles.submessage}>
              Por favor, accedé desde un dispositivo con resolución mayor a 992px.
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return <>{children}</>;
};

