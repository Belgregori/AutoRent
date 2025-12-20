import React, { useEffect, useState } from 'react';
import styles from './Notification.module.css';

export const Notification = ({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose, 
  position = 'top-right' 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300); // Tiempo de la animación de salida
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '✅';
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return styles.success;
      case 'error':
        return styles.error;
      case 'warning':
        return styles.warning;
      case 'info':
        return styles.info;
      default:
        return styles.success;
    }
  };

  return (
    <div className={`${styles.notification} ${getTypeClass()} ${styles[position]} ${isExiting ? styles.exiting : ''}`}>
      <div className={styles.content}>
        <span className={styles.icon}>{getIcon()}</span>
        <span className={styles.message}>{message}</span>
        <button 
          className={styles.closeButton} 
          onClick={handleClose}
          aria-label="Cerrar notificación"
        >
          ×
        </button>
      </div>
      <div className={styles.progressBar} />
    </div>
  );
};

export const NotificationContainer = ({ notifications, removeNotification }) => {
  return (
    <div className={styles.container}>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          position={notification.position}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};
