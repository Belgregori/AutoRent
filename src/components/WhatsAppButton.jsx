import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import styles from './WhatsAppButton.module.css';

export const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useNotifications();

  // Número de WhatsApp del proveedor (puedes cambiarlo)
  const numeroProveedor = '5491123456789'; // Formato internacional sin + ni espacios
  const mensajePorDefecto = 'Hola! Me interesa conocer más sobre sus servicios de alquiler de autos.';

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setMensaje(mensajePorDefecto);
    }
  };

  const handleEnviarMensaje = async () => {
    if (!mensaje.trim()) {
      showError('Por favor escribe un mensaje');
      return;
    }

    setIsLoading(true);

    try {
      // Codificar el mensaje para URL
      const mensajeCodificado = encodeURIComponent(mensaje.trim());
      
      // Crear el enlace de WhatsApp
      const urlWhatsApp = `https://wa.me/${numeroProveedor}?text=${mensajeCodificado}`;
      
      // Abrir WhatsApp en nueva ventana
      const nuevaVentana = window.open(urlWhatsApp, '_blank');
      
      if (nuevaVentana) {
        showSuccess('Redirigiendo a WhatsApp...');
        setIsOpen(false);
        setMensaje('');
      } else {
        throw new Error('No se pudo abrir WhatsApp. Verifica que tengas la aplicación instalada.');
      }
      
    } catch (error) {
      console.error('Error al abrir WhatsApp:', error);
      showError(error.message || 'Error al abrir WhatsApp');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleEnviarMensaje();
    }
  };

  return (
    <div className={styles.whatsappContainer}>
      {/* Botón flotante */}
      <button
        className={`${styles.whatsappButton} ${isOpen ? styles.open : ''}`}
        onClick={handleToggle}
        aria-label="Contactar por WhatsApp"
        title="Contactar por WhatsApp"
      >
        <svg
          className={styles.whatsappIcon}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      </button>

      {/* Panel de mensaje */}
      {isOpen && (
        <div className={styles.mensajePanel}>
          <div className={styles.panelHeader}>
            <h4>Contactar por WhatsApp</h4>
            <button
              className={styles.closeButton}
              onClick={handleToggle}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
          
          <div className={styles.panelContent}>
            <label htmlFor="mensaje" className={styles.label}>
              Tu mensaje:
            </label>
            <textarea
              id="mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje aquí..."
              className={styles.textarea}
              rows="4"
              maxLength="500"
              disabled={isLoading}
            />
            <div className={styles.contador}>
              {mensaje.length}/500
            </div>
            
            <div className={styles.botones}>
              <button
                onClick={handleEnviarMensaje}
                disabled={isLoading || !mensaje.trim()}
                className={styles.btnEnviar}
              >
                {isLoading ? 'Enviando...' : 'Enviar por WhatsApp'}
              </button>
            </div>
            
            <div className={styles.ayuda}>
              <small>💡 Tip: Presiona Ctrl+Enter para enviar rápidamente</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
