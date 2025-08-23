import React from 'react';
import styles from './ConfirmDialog.module.css';

export const ConfirmDialog = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar',
  onConfirm, 
  onCancel,
  type = 'warning' // warning, danger, info
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return styles.danger;
      case 'info':
        return styles.info;
      case 'warning':
      default:
        return styles.warning;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'warning':
      default:
        return '⚠️';
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={`${styles.dialog} ${getTypeStyles()}`}>
        <div className={styles.header}>
          <span className={styles.icon}>{getIcon()}</span>
          <h3 className={styles.title}>{title}</h3>
        </div>
        
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={handleCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`${styles.button} ${styles.confirmButton}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
