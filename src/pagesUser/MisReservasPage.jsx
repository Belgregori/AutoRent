import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './misReservas.module.css';
import Header from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';
import { UserNavControls } from '../components/UserNavControls.jsx';
import { useReservas } from '../hooks/useReservas.js';

export const MisReservasPage = () => {
  const navigate = useNavigate();
  const { reservas, obtenerReservasUsuario, isLoading, error } = useReservas();
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('TODAS');

  useEffect(() => {
    obtenerReservasUsuario();
  }, [obtenerReservasUsuario]);

  useEffect(() => {
    if (filtroEstado === 'TODAS') {
      setReservasFiltradas(reservas);
    } else {
      setReservasFiltradas(reservas.filter(reserva => reserva.estado === filtroEstado));
    }
  }, [reservas, filtroEstado]);

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

  const obtenerTextoEstado = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return 'Pendiente de confirmación';
      case 'CONFIRMADA': return 'Confirmada';
      case 'CANCELADA': return 'Cancelada';
      case 'COMPLETADA': return 'Completada';
      default: return estado;
    }
  };

  const calcularDias = (fechaInicio, fechaFin) => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferencia = fin.getTime() - inicio.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
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
                : `No tienes reservas en estado "${obtenerTextoEstado(filtroEstado)}"`
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
                  <div className={styles.estadoReserva}>
                    <span 
                      className={styles.estadoBadge}
                      style={{ backgroundColor: obtenerColorEstado(reserva.estado) }}
                    >
                      {obtenerTextoEstado(reserva.estado)}
                    </span>
                  </div>
                  <div className={styles.fechaCreacion}>
                    Creada: {formatearFechaCorta(reserva.fechaCreacion)}
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
                  {reserva.estado === 'PENDIENTE' && (
                    <button 
                      onClick={() => navigate(`/producto/${reserva.productoId}`)}
                      className={styles.btnVerProducto}
                    >
                      Ver Producto
                    </button>
                  )}
                  
                  {reserva.estado === 'CONFIRMADA' && (
                    <button 
                      onClick={() => navigate(`/producto/${reserva.productoId}`)}
                      className={styles.btnVerProducto}
                    >
                      Ver Detalles
                    </button>
                  )}
                  
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
