import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './detalle.module.css';
import Header from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';
import { UserNavControls } from '../components/UserNavControls.jsx';
import { FormularioReserva } from '../components/FormularioReserva.jsx';
import { useReservas } from '../hooks/useReservas.js';

const CalendarioDisponibilidad = ({ productoId, producto }) => {
  const { obtenerDisponibilidad } = useReservas();
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mesActual, setMesActual] = useState(new Date());
  const [modalReservaAbierto, setModalReservaAbierto] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const generarFechasMes = (fecha) => {
    const año = fecha.getFullYear();
    const mes = fecha.getMonth();
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const primerDiaSemana = primerDia.getDay();
    
    const fechas = [];
    
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
      const fechaAnterior = new Date(año, mes, -i);
      fechas.push({ fecha: fechaAnterior, esMesActual: false });
    }
    
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const fechaActual = new Date(año, mes, dia);
      fechas.push({ fecha: fechaActual, esMesActual: true });
    }
    
    const ultimoDiaSemana = ultimoDia.getDay();
    for (let i = 1; i <= 6 - ultimoDiaSemana; i++) {
      const fechaSiguiente = new Date(año, mes + 1, i);
      fechas.push({ fecha: fechaSiguiente, esMesActual: false });
    }
    
    return fechas;
  };

  const esFechaDisponible = (fecha) => {
    const fechaStr = fecha.toISOString().split('T')[0];
    return fechasDisponibles.includes(fechaStr);
  };

  const esFechaOcupada = (fecha) => {
    const fechaStr = fecha.toISOString().split('T')[0];
    return fechasOcupadas.includes(fechaStr);
  };

  const obtenerEstadoFecha = (fecha) => {
    if (!fecha.esMesActual) return 'otro-mes';
    if (esFechaOcupada(fecha.fecha)) return 'ocupada';
    if (esFechaDisponible(fecha.fecha)) return 'disponible';
    return 'indefinida';
  };

  const handleFechaClick = (fecha) => {
    if (fecha.esMesActual && !esFechaOcupada(fecha.fecha)) {
      setFechaSeleccionada(fecha.fecha);
      setModalReservaAbierto(true);
    }
  };

  const handleReservaExitosa = (nuevaReserva) => {
    // Actualizar el calendario con la nueva reserva
    const fechaInicio = new Date(nuevaReserva.fechaInicio);
    const fechaFin = new Date(nuevaReserva.fechaFin);
    const nuevasFechasOcupadas = [];
    
    for (let fecha = new Date(fechaInicio); fecha <= fechaFin; fecha.setDate(fecha.getDate() + 1)) {
      const fechaStr = fecha.toISOString().split('T')[0];
      nuevasFechasOcupadas.push(fechaStr);
    }
    
    setFechasOcupadas(prev => [...prev, ...nuevasFechasOcupadas]);
    setFechasDisponibles(prev => prev.filter(f => !nuevasFechasOcupadas.includes(f)));
  };

  useEffect(() => {
    const cargarDisponibilidad = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Por ahora, usar datos simulados para evitar errores del backend
        const hoy = new Date();
        const fechasDisponiblesTemp = [];
        const fechasOcupadasTemp = [];
        
        for (let i = 0; i < 180; i++) {
          const fecha = new Date(hoy);
          fecha.setDate(hoy.getDate() + i);
          const fechaStr = fecha.toISOString().split('T')[0];
          
          if (Math.random() < 0.1) { 
            fechasOcupadasTemp.push(fechaStr);
          } else {
            fechasDisponiblesTemp.push(fechaStr);
          }
        }
        
        setFechasDisponibles(fechasDisponiblesTemp);
        setFechasOcupadas(fechasOcupadasTemp);
        
        // TODO: Cuando el backend esté funcionando, usar esto:
        // const disponibilidad = await obtenerDisponibilidad(productoId, 6);
        // if (disponibilidad) {
        //   setFechasDisponibles(disponibilidad.fechasDisponibles || []);
        //   setFechasOcupadas(disponibilidad.fechasOcupadas || []);
        // }
        
      } catch (error) {
        console.error('Error cargando disponibilidad:', error);
        setError('Error al cargar la disponibilidad de fechas. Inténtalo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    cargarDisponibilidad();
  }, [productoId]);

  const mesAnterior = () => {
    setMesActual(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const mesSiguiente = () => {
    setMesActual(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const formatearMes = (fecha) => {
    return fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  const fechas = generarFechasMes(mesActual);
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  if (isLoading) {
    return (
      <div className={styles.calendarioContainer}>
        <div className={styles.calendarioLoading}>
          <div className={styles.spinner}></div>
          <p>Cargando disponibilidad...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.calendarioContainer}>
        <div className={styles.calendarioError}>
          <div className={styles.errorIcon}>⚠️</div>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Intentar más tarde
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.calendarioContainer}>
        <h2 className={styles.subtitulo}>Calendario de Disponibilidad</h2>
        
        <div className={styles.calendarioWrapper}>
          {/* Calendario izquierdo */}
          <div className={styles.calendario}>
            <div className={styles.calendarioHeader}>
              <button onClick={mesAnterior} className={styles.navButton}>‹</button>
              <h3>{formatearMes(mesActual)}</h3>
              <button onClick={mesSiguiente} className={styles.navButton}>›</button>
            </div>
            
            <div className={styles.diasSemana}>
              {diasSemana.map(dia => (
                <div key={dia} className={styles.diaSemana}>{dia}</div>
              ))}
            </div>
            
            <div className={styles.fechasGrid}>
              {fechas.map((fecha, index) => {
                const estado = obtenerEstadoFecha(fecha);
                const esSeleccionada = fechaSeleccionada && fecha.fecha.toISOString().split('T')[0] === fechaSeleccionada.toISOString().split('T')[0];
                return (
                  <div
                    key={index}
                    className={`${styles.fecha} ${styles[estado]} ${esSeleccionada ? styles.seleccionada : ''}`}
                    onClick={() => handleFechaClick(fecha)}
                    title={`${fecha.fecha.toLocaleDateString('es-ES')} - ${estado === 'disponible' ? 'Disponible (Click para reservar)' : estado === 'ocupada' ? 'Ocupada' : 'Indefinida'}`}
                  >
                    {fecha.fecha.getDate()}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendario derecho */}
          <div className={styles.calendario}>
            <div className={styles.calendarioHeader}>
              <button onClick={mesAnterior} className={styles.navButton}>‹</button>
              <h3>{formatearMes(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1))}</h3>
              <button onClick={mesSiguiente} className={styles.navButton}>›</button>
            </div>
            
            <div className={styles.diasSemana}>
              {diasSemana.map(dia => (
                <div key={dia} className={styles.diaSemana}>{dia}</div>
              ))}
            </div>
            
            <div className={styles.fechasGrid}>
              {generarFechasMes(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1)).map((fecha, index) => {
                const estado = obtenerEstadoFecha(fecha);
                const esSeleccionada = fechaSeleccionada && fecha.fecha.toISOString().split('T')[0] === fechaSeleccionada.toISOString().split('T')[0];
                return (
                  <div
                    key={index}
                    className={`${styles.fecha} ${styles[estado]} ${esSeleccionada ? styles.seleccionada : ''}`}
                    onClick={() => handleFechaClick(fecha)}
                    title={`${fecha.fecha.toLocaleDateString('es-ES')} - ${estado === 'disponible' ? 'Disponible (Click para reservar)' : estado === 'ocupada' ? 'Ocupada' : 'Indefinida'}`}
                  >
                    {fecha.fecha.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Leyenda */}
        <div className={styles.leyenda}>
          <div className={styles.leyendaItem}>
            <div className={`${styles.leyendaColor} ${styles.disponible}`}></div>
            <span>Disponible (Click para reservar)</span>
          </div>
          <div className={styles.leyendaItem}>
            <div className={`${styles.leyendaColor} ${styles.ocupada}`}></div>
            <span>Ocupada</span>
          </div>
          <div className={styles.leyendaItem}>
            <div className={`${styles.leyendaColor} ${styles.indefinida}`}></div>
            <span>Indefinida</span>
          </div>
        </div>

        {/* Botón de reserva rápida */}
        <div className={styles.reservaRapida}>
          <button 
            onClick={() => setModalReservaAbierto(true)}
            className={styles.btnReservar}
          >
            🗓️ Reservar Fechas
          </button>
        </div>
      </div>

      {/* Formulario de reserva */}
      <FormularioReserva
        producto={producto}
        isOpen={modalReservaAbierto}
        onClose={() => {
          setModalReservaAbierto(false);
          setFechaSeleccionada(null);
        }}
        onReservaExitosa={handleReservaExitosa}
        fechasOcupadas={fechasOcupadas}
      />
    </>
  );
};

export const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`/api/productos/${id}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
    })
      .then(res => res.json())
      .then(data => {
        setProducto(data);
        setCaracteristicas(Array.isArray(data.caracteristicas) ? data.caracteristicas : []);
        
        let urls = [];
        if (Array.isArray(data.imagenesUrls)) {
          urls = data.imagenesUrls.filter(Boolean);
        } else if (Array.isArray(data.imagenes)) {
          urls = data.imagenes
            .map(x => {
              if (!x) return null;
              if (typeof x === 'string') return x;
              return x.url || x.imagenUrl || null;
            })
            .filter(Boolean);
        }
        const imagenesFinal = urls.length > 0
          ? urls
          : (data.imagenesData?.map(img => `data:image/jpeg;base64,${img}`) || []);
        setImagenes(imagenesFinal);
        setImagenPrincipal(imagenesFinal[0]);
      });
  }, [id]);

  useEffect(() => {
    if (!producto) return;
    if (caracteristicas && caracteristicas.length > 0) return;
    const controller = new AbortController();
    const token = localStorage.getItem('token');
    fetch(`/api/productos/${id}/caracteristicas`, {
      signal: controller.signal,
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
    })
      .then(res => (res.ok ? res.json() : []))
      .then(list => {
        if (Array.isArray(list) && list.length > 0) setCaracteristicas(list);
      })
      .catch(() => { });
    return () => controller.abort();
  }, [id, producto, caracteristicas]);

  if (!producto) {
    return (
      <div className={styles.container}>
        <h2>Producto no encontrado</h2>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.nombre}>{producto.nombre.toUpperCase()}</h1>
        <p className={styles.descripcion}>{producto.descripcion}</p>
        <p className={styles.precio}>${producto.precio.toFixed(2)}</p>

        <div className={styles.galeria}>
          <div className={styles.imagenPrincipal}>
            <img src={imagenPrincipal} alt={`Imagen principal de ${producto.nombre}`} loading="eager" decoding="async" />
          </div>
          <div className={styles.imagenesSecundarias}>
            {imagenes.slice(1, 5).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Imagen ${idx + 2} de ${producto.nombre}`}
                onClick={() => setImagenPrincipal(img)}
                className={img === imagenPrincipal ? styles.selected : ''}
              />
            ))}
          </div>
        </div>
        
        <div className={styles.flechaVolver} onClick={() => navigate(-1)}>← Volver</div>
        
        <div className={styles.verMas}>
          <button onClick={() => setModalAbierto(true)}>Ver Más Imágenes</button>
        </div>
        
        {modalAbierto && (
          <div className={styles.modalOverlay} onClick={() => setModalAbierto(false)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h2>Galería completa</h2>
              <div className={styles.modalGaleria}>
                {imagenes.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Imagen ${idx + 1} de ${producto.nombre}`}
                    onClick={() => setImagenPrincipal(img)}
                    className={img === imagenPrincipal ? styles.selected : ''}
                  />
                ))}
              </div>
              <button className={styles.cerrarModal} onClick={() => setModalAbierto(false)}>Cerrar</button>
            </div>
          </div>
        )}

        {/* Calendario de disponibilidad */}
        <CalendarioDisponibilidad productoId={id} producto={producto} />

        <section className={styles.caracteristicasSection}>
          <h2 className={styles.subtitulo}>Características</h2>
          {caracteristicas && caracteristicas.length > 0 ? (
            <div className={styles.caracteristicasGrid}>
              {caracteristicas.map((car) => (
                <div key={car.id} className={styles.caracteristicaItem}>
                  {car.imagenUrl ? (
                    <img
                      src={car.imagenUrl}
                      alt={car.nombre}
                      className={styles.caracteristicaIcon}
                    />
                  ) : (
                    <div className={styles.caracteristicaIconFallback} aria-hidden="true">⭐</div>
                  )}
                  <span className={styles.caracteristicaNombre}>{car.nombre}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.sinCaracteristicas}>Sin características</p>
          )}
        </section>
      </div>
      <UserNavControls />
      <Footer />
    </>
  );
};

