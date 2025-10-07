import React, { useState, useEffect } from 'react';
import styles from './FormularioReserva.module.css';
import { Notification } from './Notification';

export const FormularioReserva = ({ producto, isOpen, onClose, onReservaExitosa, fechasOcupadas = [], fechasPreseleccionadas = null }) => {
  // Campos obligatorios
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  // Campos opcionales
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [metodoPago, setMetodoPago] = useState('');

  // Estados del formulario
  const [cantidadDias, setCantidadDias] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errores, setErrores] = useState({});
  const [reservaExitosa, setReservaExitosa] = useState(false);

  // Estados para notificaciones
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Obtener fecha mínima (hoy)
  const fechaMinima = new Date().toISOString().split('T')[0];

  // Calcular fecha máxima (6 meses adelante)
  const fechaMaxima = new Date();
  fechaMaxima.setMonth(fechaMaxima.getMonth() + 6);
  const fechaMaximaStr = fechaMaxima.toISOString().split('T')[0];

  // Función para formatear fecha preservando zona horaria local
  const formatDateToLocal = (date) => {
    const año = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  };

  // Establecer fechas preseleccionadas cuando se abra el modal
  useEffect(() => {
    if (isOpen && fechasPreseleccionadas?.fechaInicio && fechasPreseleccionadas?.fechaFin) {
      setFechaInicio(formatDateToLocal(fechasPreseleccionadas.fechaInicio));
      setFechaFin(formatDateToLocal(fechasPreseleccionadas.fechaFin));
    }
  }, [isOpen, fechasPreseleccionadas]);

  // Calcular precio total
  const calcularPrecioTotal = () => {
    if (!fechaInicio || !fechaFin) return 0;
    const inicio = new Date(fechaInicio + 'T08:00:00');
    const fin = new Date(fechaFin + 'T08:00:00');
    const dias = Math.floor((fin - inicio) / (1000 * 60 * 60 * 24));
    return (producto.precio * dias).toFixed(2);
  };

  // Generar texto descriptivo de las fechas
  const generarTextoFechas = () => {
    if (!fechaInicio || !fechaFin) return '';
    
    const inicio = new Date(fechaInicio + 'T08:00:00');
    const fin = new Date(fechaFin + 'T08:00:00');
    const dias = Math.floor((fin - inicio) / (1000 * 60 * 60 * 24));
    
    const opcionesFecha = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    const fechaInicioFormateada = inicio.toLocaleDateString('es-ES', opcionesFecha);
    const fechaFinFormateada = fin.toLocaleDateString('es-ES', opcionesFecha);
    
    return `Tu reserva comienza el ${fechaInicioFormateada} y debes devolver el vehículo el ${fechaFinFormateada}. Duración: ${dias} día${dias !== 1 ? 's' : ''} (${dias * 24} horas).`;
  };

  // Validar fechas
  const validarFechas = () => {
    if (!fechaInicio || !fechaFin) {
      setError('Por favor selecciona ambas fechas');
      return false;
    }

    if (fechaInicio >= fechaFin) {
      setError('La fecha de fin debe ser posterior a la fecha de inicio');
      return false;
    }

    if (fechaInicio < fechaMinima) {
      setError('No puedes reservar fechas pasadas');
      return false;
    }

    // Verificar que no haya fechas ocupadas en el rango
    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinObj = new Date(fechaFin);
    
    for (let fecha = new Date(fechaInicioObj); fecha <= fechaFinObj; fecha.setDate(fecha.getDate() + 1)) {
      const fechaStr = fecha.toISOString().split('T')[0];
      if (fechasOcupadas.includes(fechaStr)) {
        setError('El rango de fechas seleccionado incluye fechas no disponibles');
        return false;
      }
    }

    setError('');
    return true;
  };

  // Validar campos obligatorios
  const validarCamposObligatorios = () => {
    const nuevosErrores = {};

    if (!nombreCompleto.trim()) {
      nuevosErrores.nombreCompleto = 'El nombre completo es obligatorio';
    }

    if (!email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nuevosErrores.email = 'El email no tiene un formato válido';
    }

    if (!telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es obligatorio';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Actualizar cantidad de días cuando cambien las fechas
  useEffect(() => {
    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio + 'T08:00:00');
      const fin = new Date(fechaFin + 'T08:00:00');
      const dias = Math.floor((fin - inicio) / (1000 * 60 * 60 * 24));
      setCantidadDias(dias);
    }
  }, [fechaInicio, fechaFin]);

  // Limpiar formulario al cerrar
  useEffect(() => {
    if (!isOpen) {
      setFechaInicio('');
      setFechaFin('');
      setCantidadDias(1);
      setError('');
      setErrores({});
      setNombreCompleto('');
      setEmail('');
      setTelefono('');
      setDireccion('');
      setCiudad('');
      setCodigoPostal('');
      setComentarios('');
      setMetodoPago('');
      setShowSuccessNotification(false);
      setShowErrorNotification(false);
      setNotificationMessage('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFechas()) return;
    if (!validarCamposObligatorios()) return;

    setIsSubmitting(true);
    setError('');
    
    try {
      // Validar que el producto tenga los datos necesarios
      if (!producto || !producto.id || !producto.precio) {
        setError('Datos del producto inválidos. Recarga la página e inténtalo de nuevo.');
        return;
      }

      // Validar que las fechas no estén vacías
      if (!fechaInicio || !fechaFin) {
        setError('Por favor selecciona ambas fechas.');
        return;
      }

      const reservaData = {
        productoId: producto.id,
        fechaInicio,
        fechaFin
      };

      // Obtener token del usuario
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Debes iniciar sesión para hacer una reserva.');
        return;
      }

      // Llamada real al backend
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservaData)
      });
      const data = await response.json();
      setReservaExitosa(true); 
      if (onReservaExitosa) onReservaExitosa(data); else {
        const errorData = await response.json().catch(() => ({}));
        
        let mensajeError = 'Error al crear la reserva.';
        
        if (response.status === 401) {
          mensajeError = 'Debes iniciar sesión para hacer una reserva.';
        } else if (response.status === 409) {
          mensajeError = 'El producto no está disponible en las fechas seleccionadas.';
        } else if (response.status === 400) {
          mensajeError = errorData.message || 'Datos de reserva inválidos.';
        } else if (response.status === 404) {
          mensajeError = 'Producto no encontrado.';
        } else if (response.status === 500) {
          mensajeError = 'Error interno del servidor. Inténtalo más tarde.';
        }
        
        setNotificationMessage('Lamentamos, hay un error. Inténtalo más tarde.');
        setShowErrorNotification(true);
        setTimeout(() => {
          setShowErrorNotification(false);
        }, 5000);
        
        setError(mensajeError);
      }
      
    } catch (error) {
      console.error('Error de conexión:', error);
      setNotificationMessage('Lamentamos, hay un error. Inténtalo más tarde.');
      setShowErrorNotification(true);
      setTimeout(() => {
        setShowErrorNotification(false);
      }, 5000);
      
      setError('Error de conexión. Verifica tu internet e inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Reservar {producto.nombre}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.productoInfo}>
          {(() => {
            let imagenUrl = '/placeholder-producto.jpg';
            if (producto?.imagenesData && producto.imagenesData.length > 0) {
              imagenUrl = `data:image/jpeg;base64,${producto.imagenesData[0]}`;
            } else if (producto?.imagenUrl) {
              imagenUrl = producto.imagenUrl;
            } else if (producto?.imagenPrincipal) {
              imagenUrl = producto.imagenPrincipal;
            } else if (producto?.imagenes && producto.imagenes.length > 0) {
              imagenUrl = producto.imagenes[0];
            }
            return (
              <img src={imagenUrl} alt={producto.nombre} />
            );
          })()}
          <div>
            <h3>{producto.nombre}</h3>
            <p className={styles.precio}>${producto.precio.toFixed(2)} por día</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Sección de fechas */}
          <div className={styles.seccionFormulario}>
            <h4 className={styles.seccionTitulo}>📅 Selección de Fechas</h4>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="fechaInicio">
                  Fecha de inicio <span className={styles.obligatorio}>*</span>
                </label>
                <input
                  id="fechaInicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  min={fechaMinima}
                  max={fechaMaximaStr}
                  required
                  className={styles.dateInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="fechaFin">
                  Fecha de fin <span className={styles.obligatorio}>*</span>
                </label>
                <input
                  id="fechaFin"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  min={fechaInicio || fechaMinima}
                  max={fechaMaximaStr}
                  required
                  className={styles.dateInput}
                />
              </div>
            </div>

            {/* Texto descriptivo de las fechas */}
            {fechaInicio && fechaFin && (
              <div className={styles.textoFechas}>
                <p>{generarTextoFechas()}</p>
              </div>
            )}
          </div>

          {/* Sección de datos personales obligatorios */}
          <div className={styles.seccionFormulario}>
            <h4 className={styles.seccionTitulo}>👤 Datos Personales (Obligatorios)</h4>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="nombreCompleto">
                  Nombre completo <span className={styles.obligatorio}>*</span>
                </label>
                <input
                  id="nombreCompleto"
                  type="text"
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  required
                  className={`${styles.textInput} ${errores.nombreCompleto ? styles.inputError : ''}`}
                  placeholder="Tu nombre completo"
                />
                {errores.nombreCompleto && (
                  <span className={styles.errorCampo}>{errores.nombreCompleto}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">
                  Email <span className={styles.obligatorio}>*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`${styles.textInput} ${errores.email ? styles.inputError : ''}`}
                  placeholder="tu@email.com"
                />
                {errores.email && (
                  <span className={styles.errorCampo}>{errores.email}</span>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="telefono">
                  Teléfono <span className={styles.obligatorio}>*</span>
                </label>
                <input
                  id="telefono"
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                  className={`${styles.textInput} ${errores.telefono ? styles.inputError : ''}`}
                  placeholder="+34 600 000 000"
                />
                {errores.telefono && (
                  <span className={styles.errorCampo}>{errores.telefono}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="metodoPago">Método de pago preferido</label>
                <select
                  id="metodoPago"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="">Selecciona un método</option>
                  <option value="tarjeta">Tarjeta de crédito/débito</option>
                  <option value="transferencia">Transferencia bancaria</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sección de datos opcionales */}
          <div className={styles.seccionFormulario}>
            <h4 className={styles.seccionTitulo}>📍 Información Adicional (Opcional)</h4>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="direccion">Dirección</label>
                <input
                  id="direccion"
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className={styles.textInput}
                  placeholder="Calle, número, piso"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="ciudad">Ciudad</label>
                <input
                  id="ciudad"
                  type="text"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className={styles.textInput}
                  placeholder="Tu ciudad"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="codigoPostal">Código postal</label>
                <input
                  id="codigoPostal"
                  type="text"
                  value={codigoPostal}
                  onChange={(e) => setCodigoPostal(e.target.value)}
                  className={styles.textInput}
                  placeholder="28001"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="comentarios">Comentarios adicionales</label>
                <textarea
                  id="comentarios"
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  className={styles.textareaInput}
                  placeholder="Requisitos especiales, horarios preferidos, etc."
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Resumen de la reserva */}
          <div className={styles.resumenReserva}>
            <h4 className={styles.seccionTitulo}>📋 Resumen de la Reserva</h4>
            <div className={styles.resumenItem}>
              <span>Duración:</span>
              <strong>{cantidadDias} día{cantidadDias !== 1 ? 's' : ''}</strong>
            </div>
            <div className={styles.resumenItem}>
              <span>Precio por día:</span>
              <strong>${producto.precio.toFixed(2)}</strong>
            </div>
            <div className={styles.resumenItem}>
              <span>Precio total:</span>
              <strong className={styles.precioTotal}>${calcularPrecioTotal()}</strong>
            </div>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <span className={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          <div className={styles.formActions}>
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isSubmitting}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || !fechaInicio || !fechaFin}
              className={styles.submitButton}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Creando reserva...
                </>
              ) : (
                'Confirmar Reserva'
              )}
            </button>
          </div>
        </form>

        <div className={styles.modalFooter}>
          <p className={styles.disclaimer}>
            <span className={styles.obligatorio}>*</span> Campos obligatorios
          </p>
          <p className={styles.disclaimer}>
            La reserva se confirmará una vez procesado el pago
          </p>
        </div>
      </div>
      
      {showSuccessNotification && (
        <Notification
          message={notificationMessage}
          type="success"
          duration={3000}
          onClose={() => setShowSuccessNotification(false)}
          position="top-center"
        />
      )}
      
      {showErrorNotification && (
        <Notification
          message={notificationMessage}
          type="error"
          duration={5000}
          onClose={() => setShowErrorNotification(false)}
          position="top-center"
        />
      )}
    </div>
  );
};
