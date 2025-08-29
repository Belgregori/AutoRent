import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './misReservas.module.css';
import Header from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';
import { UserNavControls } from '../components/UserNavControls.jsx';
import { useReservas } from '../hooks/useReservas.js';

export const MisReservasPage = () => {
  const navigate = useNavigate();
  const { reservas, obtenerReservasUsuario, eliminarReserva, confirmarReserva, isLoading, error } = useReservas();
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('TODAS');
  const [showConfirmMessage, setShowConfirmMessage] = useState(false);

  useEffect(() => {
    obtenerReservasUsuario();
  }, [obtenerReservasUsuario]);

  useEffect(() => {
    if (filtroEstado === 'TODAS') {
      setReservasFiltradas(reservas);
    } else {
      setReservasFiltradas(reservas.filter(reserva => 
        filtroEstado === 'PENDIENTE' 
          ? (reserva.estado === 'PENDIENTE' || !reserva.estado)
          : reserva.estado === filtroEstado
      ));
    }
  }, [reservas, filtroEstado]);

  const handleConfirmarReserva = async (reservaId) => {
    const confirmada = await confirmarReserva(reservaId);
    
    if (confirmada) {
      // Mostrar mensaje de confirmación
      setShowConfirmMessage(true);
      setTimeout(() => {
        setShowConfirmMessage(false);
      }, 3000);
    } else {
      alert('Error al confirmar la reserva. Por favor, inténtalo de nuevo.');
    }
  };

  const handleEliminarReserva = async (reservaId) => {
    const confirmacion = window.confirm('¿Estás seguro de que quieres eliminar esta reserva? Esta acción no se puede deshacer.');
    
    if (confirmacion) {
      const eliminada = await eliminarReserva(reservaId);
      
      if (eliminada) {
        // La reserva se eliminó exitosamente del estado local
        setReservasFiltradas(prev => prev.filter(r => r.id !== reservaId));
      } else {
        alert('Error al eliminar la reserva. Por favor, inténtalo de nuevo.');
      }
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatearFechaCorta = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return '#f59e0b';
      case 'CONFIRMADA': return '#10b981';
      case 'CANCELADA': return '#ef4444';
      case 'COMPLETADA': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const calcularDias = (fechaInicio, fechaFin) => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferencia = fin.getTime() - inicio.getTime();
    return Math.floor(diferencia / (1000 * 60 * 60 * 24)) + 1;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Cargando tus reservas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>Error al cargar las reservas</h2>
          <p>{error}</p>
          <button onClick={() => obtenerReservasUsuario()} className={styles.retryButton}>
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>Mis Reservas</h1>
          <p className={styles.subtitulo}>
            Gestiona y revisa todas tus reservas de productos
          </p>
        </div>

        {/* Cartel de confirmación */}
        {showConfirmMessage && (
          <div className={styles.confirmMessage}>
            <div className={styles.confirmIcon}>🎉</div>
            <h3>¡Reserva Confirmada!</h3>
            <p>Tu reserva ha sido confirmada exitosamente en el sistema. ¡Disfruta de tu experiencia!</p>
          </div>
        )}

        {/* Filtros */}
        <div className={styles.filtros}>
          <div className={styles.filtroGrupo}>
            <label htmlFor="filtroEstado">Filtrar por estado:</label>
            <select
              id="filtroEstado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className={styles.selectFiltro}
            >
              <option value="TODAS">Todas las reservas</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="CONFIRMADA">Confirmadas</option>
              <option value="CANCELADA">Canceladas</option>
              <option value="COMPLETADA">Completadas</option>
            </select>
          </div>
          
          <div className={styles.contador}>
            <span>{reservasFiltradas.length} reserva{reservasFiltradas.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Lista de reservas */}
        {reservasFiltradas.length === 0 ? (
          <div className={styles.sinReservas}>
            <div className={styles.sinReservasIcon}>📋</div>
            <h3>No tienes reservas</h3>
            <p>
              {filtroEstado === 'TODAS' 
                ? 'Aún no has hecho ninguna reserva. ¡Explora nuestros productos y haz tu primera reserva!'
                : `No tienes reservas en estado "${filtroEstado}"`
              }
            </p>
            <button 
              onClick={() => navigate('/')} 
              className={styles.btnExplorar}
            >
              Explorar Productos
            </button>
          </div>
        ) : (
          <div className={styles.reservasGrid}>
            {reservasFiltradas.map((reserva) => (
              <div key={reserva.id} className={styles.reservaCard}>
                {/* Header de la reserva */}
                <div className={styles.reservaHeader}>
                  <div className={styles.fechaCreacion}>
                    Creada: {formatearFechaCorta(reserva.fechaCreacion)}
                  </div>
                  <div className={styles.estadoReserva} style={{ color: obtenerColorEstado(reserva.estado || 'PENDIENTE') }}>
                    {reserva.estado || 'PENDIENTE'}
                  </div>
                </div>

                {/* Información del producto */}
                <div className={styles.productoInfo}>
                  <div className={styles.productoImagen}>
                    {(() => {
                      let imagenUrl = '/placeholder-producto.jpg';
                      if (reserva.producto?.imagenesData && reserva.producto.imagenesData.length > 0) {
                        imagenUrl = `data:image/jpeg;base64,${reserva.producto.imagenesData[0]}`;
                      } else if (reserva.producto?.imagenUrl) {
                        imagenUrl = reserva.producto.imagenUrl;
                      } else if (reserva.producto?.imagenPrincipal) {
                        imagenUrl = reserva.producto.imagenPrincipal;
                      } else if (reserva.producto?.imagenes && reserva.producto.imagenes.length > 0) {
                        imagenUrl = reserva.producto.imagenes[0];
                      }
                      return (
                        <img 
                          src={imagenUrl}
                          alt={reserva.producto?.nombre || 'Producto'} 
                        />
                      );
                    })()}
                  </div>
                  <div className={styles.productoDetalles}>
                    <h3 className={styles.productoNombre}>
                      {reserva.producto?.nombre || 'Producto no disponible'}
                    </h3>
                    <p className={styles.productoPrecio}>
                      ${reserva.producto?.precio?.toFixed(2) || '0.00'} por día
                    </p>
                  </div>
                </div>

                {/* Detalles de la reserva */}
                <div className={styles.reservaDetalles}>
                  <div className={styles.detalleItem}>
                    <span className={styles.detalleLabel}>📅 Fecha de inicio:</span>
                    <span className={styles.detalleValor}>
                      {formatearFecha(reserva.fechaInicio)}
                    </span>
                  </div>
                  
                  <div className={styles.detalleItem}>
                    <span className={styles.detalleLabel}>📅 Fecha de fin:</span>
                    <span className={styles.detalleValor}>
                      {formatearFecha(reserva.fechaFin)}
                    </span>
                  </div>
                  
                  <div className={styles.detalleItem}>
                    <span className={styles.detalleLabel}>⏱️ Duración:</span>
                    <span className={styles.detalleValor}>
                      {calcularDias(reserva.fechaInicio, reserva.fechaFin)} día{calcularDias(reserva.fechaInicio, reserva.fechaFin) !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className={styles.detalleItem}>
                    <span className={styles.detalleLabel}>💰 Precio total:</span>
                    <span className={styles.detalleValor}>
                      <strong>${reserva.precioTotal?.toFixed(2) || '0.00'}</strong>
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className={styles.reservaAcciones}>
                  <button 
                    onClick={() => navigate(`/producto/${reserva.productoId}`)}
                    className={styles.btnVerProducto}
                  >
                    Ver Producto
                  </button>
                  
                  {/* Botón Confirmar solo para reservas PENDIENTES */}
                  {(reserva.estado === 'PENDIENTE' || !reserva.estado) && (
                    <button 
                      onClick={() => handleConfirmarReserva(reserva.id)}
                      className={styles.btnConfirmarReserva}
                    >
                      ✅ Confirmar Reserva
                    </button>
                  )}
                  
                  {/* Botón Eliminar para todas las reservas */}
                  <button 
                    onClick={() => handleEliminarReserva(reserva.id)}
                    className={styles.btnEliminarReserva}
                  >
                    🗑️ Eliminar Reserva
                  </button>
                  
                  <button 
                    onClick={() => navigate(`/producto/${reserva.productoId}`)}
                    className={styles.btnReservarNuevamente}
                  >
                    Reservar Nuevamente
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botón para hacer nueva reserva */}
        <div className={styles.nuevaReserva}>
          <button 
            onClick={() => navigate('/')} 
            className={styles.btnNuevaReserva}
          >
            🗓️ Hacer Nueva Reserva
          </button>
        </div>
      </div>
      <UserNavControls />
      <Footer />
    </>
  );
};
