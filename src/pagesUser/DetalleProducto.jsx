import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './detalle.module.css';
import Header from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';
import { UserNavControls } from '../components/UserNavControls.jsx';
import { FormularioReserva } from '../components/FormularioReserva.jsx';
import { useReservas } from '../hooks/useReservas.js';
import { ModalCompartir } from '../components/ModalCompartir.jsx';
import { SistemaValoracion } from '../components/SistemaValoracion.jsx';
import { ListaResenas } from '../components/ListaResenas.jsx';
import { ResumenValoraciones } from '../components/ResumenValoraciones.jsx';
import { useResenas } from '../hooks/useResenas.js';

const CalendarioDisponibilidad = ({ productoId, producto }) => {
  const { obtenerDisponibilidad } = useReservas();
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mesActual, setMesActual] = useState(new Date());
  const [modalReservaAbierto, setModalReservaAbierto] = useState(false);
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState({ fechaInicio: null, fechaFin: null });

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
    
    // Verificar si es fecha de inicio seleccionada
    if (fechasSeleccionadas.fechaInicio && 
        fecha.fecha.toISOString().split('T')[0] === fechasSeleccionadas.fechaInicio.toISOString().split('T')[0]) {
      return 'seleccionada-inicio';
    }
    
    // Verificar si es fecha de fin seleccionada
    if (fechasSeleccionadas.fechaFin && 
        fecha.fecha.toISOString().split('T')[0] === fechasSeleccionadas.fechaFin.toISOString().split('T')[0]) {
      return 'seleccionada-fin';
    }
    
    // Verificar si está en el rango seleccionado
    if (fechasSeleccionadas.fechaInicio && fechasSeleccionadas.fechaFin) {
      const fechaStr = fecha.fecha.toISOString().split('T')[0];
      const inicioStr = fechasSeleccionadas.fechaInicio.toISOString().split('T')[0];
      const finStr = fechasSeleccionadas.fechaFin.toISOString().split('T')[0];
      
      if (fechaStr >= inicioStr && fechaStr <= finStr) {
        return 'en-rango';
      }
    }
    
    if (esFechaDisponible(fecha.fecha)) return 'disponible';
    return 'indefinida';
  };

  const handleFechaClick = (fecha) => {
    if (fecha.esMesActual && !esFechaOcupada(fecha.fecha)) {
      if (!fechasSeleccionadas.fechaInicio) {
        // Primera fecha seleccionada - fecha de inicio
        setFechasSeleccionadas({ fechaInicio: fecha.fecha, fechaFin: null });
      } else if (!fechasSeleccionadas.fechaFin) {
        // Segunda fecha seleccionada - fecha de fin
        if (fecha.fecha > fechasSeleccionadas.fechaInicio) {
          setFechasSeleccionadas(prev => ({ ...prev, fechaFin: fecha.fecha }));
          setModalReservaAbierto(true);
        } else {
          // Si la segunda fecha es anterior, reiniciar selección
          setFechasSeleccionadas({ fechaInicio: fecha.fecha, fechaFin: null });
        }
      } else {
        // Reiniciar selección
        setFechasSeleccionadas({ fechaInicio: fecha.fecha, fechaFin: null });
      }
    }
  };

  const handleReservaExitosa = async (nuevaReserva) => {
    // Refrescar disponibilidad desde el servidor para obtener datos actualizados
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/reservas/producto/${productoId}/disponibilidad`, {
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFechasDisponibles(data.fechasDisponibles || []);
        setFechasOcupadas(data.fechasOcupadas || []);
      }
    } catch (error) {
      console.error('Error refrescando disponibilidad:', error);
    }
  };

  useEffect(() => {
    const cargarDisponibilidad = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/reservas/producto/${productoId}/disponibilidad`, {
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Producto no encontrado');
          } else if (response.status === 401) {
            throw new Error('Debes iniciar sesión para ver la disponibilidad');
          } else if (response.status === 403) {
            throw new Error('🔐 Necesitas iniciar sesión para ver la disponibilidad y hacer reservas');
          } else {
            throw new Error(`Error del servidor: ${response.status}`);
          }
        }

        const data = await response.json();
        
        
        setFechasDisponibles(data.fechasDisponibles || []);
        setFechasOcupadas(data.fechasOcupadas || []);
        
      } catch (error) {
        console.error('Error cargando disponibilidad:', error);
        setError(`Error al cargar la disponibilidad: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (productoId) {
      cargarDisponibilidad();
    }
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
            onClick={() => {
              setError(null);
              const cargarDisponibilidad = async () => {
                setIsLoading(true);
                try {
                  const token = localStorage.getItem('token');
                  const response = await fetch(`/api/reservas/producto/${productoId}/disponibilidad`, {
                    headers: {
                      'Accept': 'application/json',
                      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    }
                  });
                  if (response.ok) {
                    const data = await response.json();
                    setFechasDisponibles(data.fechasDisponibles || []);
                    setFechasOcupadas(data.fechasOcupadas || []);
                    setError(null);
                  } else {
                    setError('Error al cargar la disponibilidad. Inténtalo más tarde.');
                  }
                } catch (err) {
                  setError('Error de conexión. Verifica tu internet e inténtalo de nuevo.');
                } finally {
                  setIsLoading(false);
                }
              };
              cargarDisponibilidad();
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.calendarioContainer}>
        <h2 className={styles.subtitulo}>Calendario de Disponibilidad</h2>
        
        <div className={styles.instrucciones}>
          <p>💡 <strong>Instrucciones:</strong> Haz clic en una fecha para seleccionar el inicio, luego en otra fecha para seleccionar el fin. El formulario se abrirá automáticamente.</p>
        </div>
        
        <div className={styles.calendarioWrapper}>
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
                const esSeleccionada = (fechasSeleccionadas.fechaInicio && fecha.fecha.toISOString().split('T')[0] === fechasSeleccionadas.fechaInicio.toISOString().split('T')[0]) ||
                                      (fechasSeleccionadas.fechaFin && fecha.fecha.toISOString().split('T')[0] === fechasSeleccionadas.fechaFin.toISOString().split('T')[0]);
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
                const esSeleccionada = (fechasSeleccionadas.fechaInicio && fecha.fecha.toISOString().split('T')[0] === fechasSeleccionadas.fechaInicio.toISOString().split('T')[0]) ||
                                      (fechasSeleccionadas.fechaFin && fecha.fecha.toISOString().split('T')[0] === fechasSeleccionadas.fechaFin.toISOString().split('T')[0]);
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

        <div className={styles.reservaRapida}>
          <button 
            onClick={() => setModalReservaAbierto(true)}
            className={styles.btnReservar}
          >
            🗓️ Reservar Fechas
          </button>
        </div>
      </div>


      <FormularioReserva
        producto={producto}
        isOpen={modalReservaAbierto}
        onClose={() => {
          setModalReservaAbierto(false);
          setFechaSeleccionada(null);
          setFechasSeleccionadas({ fechaInicio: null, fechaFin: null });
        }}
        onReservaExitosa={handleReservaExitosa}
        fechasOcupadas={fechasOcupadas}
        fechasPreseleccionadas={fechasSeleccionadas}
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
  const [modalCompartirAbierto, setModalCompartirAbierto] = useState(false);

  // Hook para manejar reseñas
  const { 
    resenas, 
    resumenValoraciones, 
    isLoading, 
    error, 
    obtenerResenas, 
    obtenerResumenValoraciones 
  } = useResenas();

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

  // Cargar reseñas cuando el producto esté disponible
  useEffect(() => {
    if (producto?.id) {
      obtenerResenas(producto.id);
      obtenerResumenValoraciones(producto.id);
    }
  }, [producto, obtenerResenas, obtenerResumenValoraciones]);

  // Scroll automático a la sección de reserva si hay hash #reservar
  useEffect(() => {
    if (window.location.hash === '#reservar') {
      // Esperar un poco para que el componente se renderice completamente
      const timer = setTimeout(() => {
        const element = document.getElementById('reservar');
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [producto]); // Se ejecuta cuando el producto se carga

  // Función para manejar cuando se crea una reseña
  const handleResenaCreada = () => {
    if (producto?.id) {
      obtenerResenas(producto.id);
      obtenerResumenValoraciones(producto.id);
    }
  };

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
        <div className={styles.productoInfoContainer}>
          <div className={styles.headerInfo}>
            <h1 className={styles.nombre}>{producto.nombre}</h1>
            <p className={styles.descripcion}>{producto.descripcion}</p>
            <p className={styles.precio}>{producto.precio.toFixed(2)}</p>
          </div>

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
          
          <div className={styles.verMas}>
            <button onClick={() => setModalAbierto(true)}>Ver Más Imágenes</button>
            <button onClick={() => setModalCompartirAbierto(true)} className={styles.btnCompartir}>
              📤 Compartir
            </button>
          </div>
        </div>
        
        <div className={styles.flechaVolver} onClick={() => navigate(-1)}>← Volver</div>
        
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

        <div id="reservar" className={styles.calendarioSection}>
          <CalendarioDisponibilidad productoId={id} producto={producto} />
        </div>

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

        <section className={styles.politicasSection}>
          <h2 className={styles.subtitulo}>📋 Políticas del Producto</h2>
          <div className={styles.politicasGrid}>
            <div className={styles.politicaItem}>
              <div className={styles.politicaIcon}>🎂</div>
              <div className={styles.politicaContenido}>
                <h3>Edad Mínima</h3>
                <p>Solo mayores de 21 años pueden alquilar vehículos. Se requiere presentar documento de identidad válido.</p>
              </div>
            </div>

            <div className={styles.politicaItem}>
              <div className={styles.politicaIcon}>🚗</div>
              <div className={styles.politicaContenido}>
                <h3>Licencia de Conducir</h3>
                <p>Es obligatorio presentar licencia de conducir vigente y en buen estado. No se aceptan licencias vencidas o dañadas.</p>
              </div>
            </div>

            <div className={styles.politicaItem}>
              <div className={styles.politicaIcon}>⚖️</div>
              <div className={styles.politicaContenido}>
                <h3>Condiciones de Uso</h3>
                <p>El vehículo debe ser utilizado de acuerdo a las leyes locales de tránsito. El cliente es responsable de cualquier infracción cometida durante el período de alquiler.</p>
              </div>
            </div>

            <div className={styles.politicaItem}>
              <div className={styles.politicaIcon}>⏰</div>
              <div className={styles.politicaContenido}>
                <h3>Devolución Puntual</h3>
                <p>Las devoluciones deben realizarse en el horario acordado. Las devoluciones tardías pueden generar cargos adicionales e intereses.</p>
              </div>
            </div>

            <div className={styles.politicaItem}>
              <div className={styles.politicaIcon}>🔄</div>
              <div className={styles.politicaContenido}>
                <h3>Cancelaciones y Modificaciones</h3>
                <p>Se requiere un aviso previo de 48 horas para cancelaciones o modificaciones de reserva. Las cancelaciones tardías pueden incurrir en cargos.</p>
              </div>
            </div>

            <div className={styles.politicaItem}>
              <div className={styles.politicaIcon}>🔍</div>
              <div className={styles.politicaContenido}>
                <h3>Inspección del Vehículo</h3>
                <p>Se realiza una inspección completa del vehículo al momento de la entrega y al momento de la devolución. El cliente debe verificar el estado antes de recibirlo.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.valoracionesSection}>
          <h2 className={styles.subtitulo}>⭐ Valoraciones y Reseñas</h2>
          
          {resumenValoraciones && (
            <ResumenValoraciones resumen={resumenValoraciones} />
          )}
          
          <SistemaValoracion 
            producto={producto} 
            onResenaCreada={handleResenaCreada}
          />
          
          {isLoading ? (
            <div className={styles.loadingResenas}>
              <p>Cargando reseñas...</p>
            </div>
          ) : (
            <ListaResenas resenas={resenas} />
          )}
          
          {error && (
            <div className={styles.errorResenas}>
              <p>Error al cargar las reseñas: {error}</p>
            </div>
          )}
        </section>
      </div>

      <ModalCompartir
        isOpen={modalCompartirAbierto}
        onClose={() => setModalCompartirAbierto(false)}
        producto={producto}
        urlProducto={window.location.href}
      />

      <UserNavControls />
      <Footer />
    </>
  );
};

