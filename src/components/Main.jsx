import React, { useState, useEffect, useRef } from 'react';
import styles from './Main.module.css';
import { useNavigate } from 'react-router-dom';
import { Footer } from './Footer';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationContainer } from './Notification';

export const Main = () => {
  const navigate = useNavigate();
  const { notifications, showSuccess, showError, showWarning, showInfo, removeNotification } = useNotifications();
  const searchInputRef = useRef(null);

  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [aleatorios, setAleatorios] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(null);

  // Buscador mejorado
  const [busquedaTexto, setBusquedaTexto] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [isBuscando, setIsBuscando] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filtros por categoría
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [resultadosOriginales, setResultadosOriginales] = useState([]);

  const [favoritos, setFavoritos] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingFavoritos, setIsLoadingFavoritos] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isLoggedInUser = !!token;
    setIsLoggedIn(isLoggedInUser);
  }, []);


  useEffect(() => {
    const handleFavoritosUpdate = () => {
      const token = localStorage.getItem('token');
      if (token && favoritos.length > 0) {
        showInfo('Sincronizando favoritos desde otra página');
      }
    };

    window.addEventListener('favoritosUpdated', handleFavoritosUpdate);
    return () => window.removeEventListener('favoritosUpdated', handleFavoritosUpdate);
  }, [favoritos, showInfo]);

 
  const cargarFavoritosSiEsNecesario = async () => {
    const token = localStorage.getItem('token');
    if (!token || favoritos.length > 0) return; 

    try {
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); 
      
      const response = await fetch('/api/favoritos', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      
      if (response.ok) {
        const data = await response.json();
        setFavoritos(data);
        showSuccess(`Favoritos cargados: ${data.length} productos`);
      } else if (response.status === 401) {
        showWarning('Token expirado, redirigiendo al login');
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('email');
        localStorage.removeItem('nombre');
        localStorage.removeItem('apellido');
        setIsLoggedIn(false);
        setFavoritos([]);
        navigate('/login');
      } else if (response.status === 403) {
        showWarning('Usuario no autorizado para acceder a favoritos');
      } else if (response.status === 404) {
        showWarning('Servicio de favoritos no disponible');
      } else if (response.status === 500) {
        showError('Error interno del servidor');
      } else if (response.status === 502 || response.status === 503 || response.status === 504) {
        showError(`Error del servidor: ${response.status}`);
      } else {
        showWarning(`Código de error inesperado: ${response.status}`);
      }
    } catch (error) {
      console.error('Error cargando favoritos en Main:', error);
      
      if (error.name === 'AbortError') {
        showWarning('Timeout al cargar favoritos');
      } else if (error.message.includes('ERR_INCOMPLETE_CHUNKED_ENCODING')) {
        showError('Error de conexión con el servidor al cargar favoritos');
      } else if (error.message.includes('Failed to fetch')) {
        showError('No se pudo conectar con el servidor');
      } else if (error.message.includes('NetworkError')) {
        showError('Error de red');
      }
    }
  };

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && favoritos.length === 0) {
      cargarFavoritosSiEsNecesario();
    }
  }, [isLoggedIn]);


  const toggleFavorito = async (productoId) => {
    if (isLoadingFavoritos) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoadingFavoritos(true);
    
    try {
      const isFavorito = favoritos.some(fav => fav.productoId === Number(productoId));
      const method = isFavorito ? 'DELETE' : 'POST';
      
      let url;
      if (isFavorito) {
        const favorito = favoritos.find(fav => fav.productoId === Number(productoId));
        if (!favorito || !favorito.id) {
          console.error('No se encontró el favorito para eliminar');
          setIsLoadingFavoritos(false);
          return;
        }
        url = `/api/favoritos/${favorito.id}`;
      } else {
                  url = '/api/favoritos';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: method === 'POST' ? JSON.stringify({ productoId: Number(productoId) }) : undefined
      });

      if (response.ok) {
        if (isFavorito) {
          setFavoritos(prev => prev.filter(fav => fav.productoId !== Number(productoId)));
        } else {
          await cargarFavoritosSiEsNecesario();
        }
        
        localStorage.setItem('favoritosUpdated', Date.now().toString());
        window.dispatchEvent(new Event('favoritosUpdated'));
        
        showSuccess('Favorito actualizado correctamente');
      } else if (response.status === 401) {
        showWarning('Token expirado, limpiando sesión');
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('email');
        localStorage.removeItem('nombre');
        localStorage.removeItem('apellido');
        setIsLoggedIn(false);
        setFavoritos([]);
        navigate('/login');
      } else if (response.status === 400) {
        const errorData = await response.json().catch(() => ({}));
        showError(`Error en la petición: ${errorData.error || 'Datos inválidos'}`);
      } else {
        showError(`Error del servidor: ${response.status}`);
      }
    } catch (error) {
      console.error('Error gestionando favorito:', error);
    } finally {
      setIsLoadingFavoritos(false);
    }
  };

  
  const esFavorito = (productoId) => {
    return favoritos.some(fav => fav.productoId === Number(productoId));
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/categorias', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
    })
      .then(async res => {
        if (!res.ok) return [];
        try { return await res.json(); } catch { return []; }
      })
      .then(data => {
        setCategorias(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error('Error cargando categorías:', err));
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/productos', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
    })
      .then(async res => {
        if (!res.ok) return [];
        try { return await res.json(); } catch { return []; }
      })
      .then(data => {
        const lista = Array.isArray(data) ? data : [];
        const productosTransformados = lista.map(transformProducto).filter(p => p !== null)
        setProductos(productosTransformados);
        setRecomendaciones(productosTransformados.slice(0, 5));
      })
      .catch(err => console.error('Error cargando productos:', err));
  }, []);


  useEffect(() => {
    const productosGuardados = sessionStorage.getItem('productosAleatorios');
    const yaCargo = sessionStorage.getItem('primerCargaAleatorios');

    if (yaCargo) {
      setAleatorios([]);
      return;
    }

    if (productosGuardados) {
      const parsed =
        JSON.parse(productosGuardados).map(p => transformProducto(p, true));
      setAleatorios(parsed);
      sessionStorage.setItem('primerCargaAleatorios', 'true');
      return;
    }

    const fetchProductosAleatorios = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/productos/random?cantidad=10', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
        });
        if (!response.ok) throw new Error('Error al obtener productos aleatorios');

        const data = await response.json();
        const productosValidos = data
          .map(p => transformProducto(p, true))
          .filter(p => p !== null)
          .slice(0, 10);


        setAleatorios(productosValidos);
        sessionStorage.setItem('productosAleatorios', JSON.stringify(productosValidos));

        sessionStorage.setItem('primerCargaAleatorios', 'true');

      } catch (error) {
        console.error('Error al obtener productos aleatorios:', error);
        setAleatorios([]);
      }
    };

    fetchProductosAleatorios();
  }, []);

  const transformProducto = (producto, esAleatorio = false) => {
    if (!producto || typeof producto !== 'object') return null;

    const imagenesData = producto.imagenesData || [];
    if (imagenesData.length > 0) {
      return {
        id: String(producto.id),
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: Number(producto.precio || 0).toFixed(2),
        disponible: esAleatorio ? true : Boolean(producto.disponible),
        imagenUrl: `data:image/jpeg;base64,${imagenesData[0]}`,
      };
    }

    if (producto.imagenUrl) {
      return {
        id: String(producto.id),
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: Number(producto.precio || 0).toFixed(2),
        disponible: esAleatorio ? true : Boolean(producto.disponible),
        imagenUrl: producto.imagenUrl,
      };
    }

    return {
      id: String(producto.id),
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: Number(producto.precio || 0).toFixed(2),
      disponible: esAleatorio ? true : Boolean(producto.disponible),
      imagenUrl: '',
    };
  };

  useEffect(() => {
    const texto = busquedaTexto.trim().toLowerCase();
    if (!texto) { 
      setSugerencias([]); 
      setShowSuggestions(false);
      return; 
    }
    
    const matches = productos.filter(p => {
      const nombre = (p.nombre || '').toLowerCase();
      const cat = (p.categoria?.nombre || p.categoria || '').toLowerCase();
      return nombre.includes(texto) || cat.includes(texto);
    }).slice(0, 6);
    
    setSugerencias(matches);
    setShowSuggestions(matches.length > 0);
  }, [busquedaTexto, productos]);

  // useEffect para aplicar filtros cuando cambien las categorías seleccionadas
  useEffect(() => {
    if (categoriasSeleccionadas.length === 0) {
      setResultados(resultadosOriginales);
      return;
    }

    const filtrados = resultadosOriginales.filter(p => {
      const categoriaId = typeof p.categoria === 'object' 
        ? p.categoria?.id 
        : p.categoria;
      
      return categoriasSeleccionadas.includes(categoriaId);
    });
    
    setResultados(filtrados);
  }, [categoriasSeleccionadas, resultadosOriginales]);

  const ejecutarBusqueda = async (e) => {
    if (e) e.preventDefault();
    setIsBuscando(true);
    setShowSuggestions(false);
    
    try {
      const texto = busquedaTexto.trim().toLowerCase();
      if (fechaDesde && fechaHasta) {
        try {
          const qs = new URLSearchParams({
            desde: fechaDesde,
            hasta: fechaHasta,
            texto: busquedaTexto.trim(),
          }).toString();
          const res = await fetch(`/api/productos/disponibles?${qs}`);
          if (res.ok) {
            const data = await res.json();
            const tx = data.map(transformProducto).filter(Boolean);
            setResultados(tx);
            setResultadosOriginales(tx);
            setIsBuscando(false);
            return;
          }
        } catch {
          // Error silencioso en búsqueda por fechas
        }
      }
      
      const filtrados = productos.filter(p => {
        if (!texto) return true;
        const nombre = (p.nombre || '').toLowerCase();
        const cat = (p.categoria?.nombre || p.categoria || '').toLowerCase();
        return nombre.includes(texto) || cat.includes(texto);
      });
      setResultados(filtrados);
      setResultadosOriginales(filtrados);
    } finally {
      setIsBuscando(false);
    }
  };

  const seleccionarSugerencia = (p) => {
    setBusquedaTexto(p.nombre);
    setSugerencias([]);
    setShowSuggestions(false);
    setResultados([p]);
    setResultadosOriginales([p]);
  };

  const handleInputFocus = () => {
    if (sugerencias.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
 
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      searchInputRef.current?.blur();
    }
  };

  // Funciones para filtros por categoría
  const toggleCategoria = (categoriaId) => {
    setCategoriasSeleccionadas(prev => {
      return prev.includes(categoriaId) 
        ? prev.filter(id => id !== categoriaId)
        : [...prev, categoriaId];
    });
  };

  const limpiarFiltros = () => {
    setCategoriasSeleccionadas([]);
  };

  const ProductoCard = ({ producto }) => (
    <div key={producto.id} className={styles.productoCard}>
      <div className={styles.productoImagen}>
        {producto.imagenUrl ? (
          <img src={producto.imagenUrl} alt={producto.nombre} className={styles.productoImagenImg} />
        ) : (
          <div className={styles.productoIconPlaceholder}>
            <span className={styles.productoIcon}>🚗</span>
          </div>
        )}
        
        {/* Badge de disponibilidad */}
        <div className={styles.disponibilidadBadge}>
          <span className={producto.disponible ? styles.disponible : styles.noDisponible}>
            {producto.disponible ? 'Disponible' : 'No disponible'}
          </span>
        </div>

        {/* Botón de favorito */}
        <button
          className={`${styles.favoritoButton} ${esFavorito(producto.id) ? styles.favoritoActivo : ''}`}
          onClick={() => toggleFavorito(producto.id)}
          title={esFavorito(producto.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          disabled={isLoadingFavoritos}
        >
          {esFavorito(producto.id) ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className={styles.productoInfo}>
        <h3 className={styles.productoNombre}>{producto.nombre}</h3>
        <p className={styles.productoCategoria}>{producto.categoria ? producto.categoria.nombre || producto.categoria : 'Sin categoría'}</p>
        <div className={styles.productoPrecio}>
          <span className={styles.precio}>${producto.precio}</span>
          <span className={styles.periodo}>/día</span>
        </div>
        <div className={styles.productoAcciones}>
          <button className={styles.verDetalleButton} onClick={() => navigate(`/producto/${producto.id}`)}>
            Ver Detalle
          </button>
          <button 
            className={styles.reservarButton} 
            disabled={!producto.disponible}
            onClick={() => navigate(`/producto/${producto.id}#reservar`)}
          >
            {producto.disponible ? 'Reservar' : 'No Disponible'}
          </button>
        </div>
      </div>
    </div>
  );

  const resolveCategoriaImagenUrl = (cat) => {
    const raw = (cat && (cat.imagenUrl || cat.imagen || cat.imagenPath)) || '';
    if (!raw || typeof raw !== 'string') return '';
    if (/^data:|^https?:\/\//i.test(raw)) return raw;
    let path = raw.startsWith('/') ? raw : `/${raw}`;
    path = encodeURI(path);
    
    return path;
  };

  return (
    <>
      <main className={styles.main}>
        
        {/* Bloque de búsqueda mejorado */}
        <section className={styles.searchSection}>
          <div className={styles.searchHeader}>
            <h1 className={styles.searchTitle}>Encuentra tu auto ideal</h1>
            <p className={styles.searchSubtitle}>Descubre la libertad de movilidad con nuestra amplia flota de vehículos</p>
            <p className={styles.searchDesc}>
              Busca por marca, modelo o categoría y selecciona las fechas de tu viaje. 
              Encuentra las mejores opciones disponibles para tu próxima aventura.
            </p>
          </div>
          
          <form className={styles.searchForm} onSubmit={ejecutarBusqueda}>
            <div className={styles.searchInputContainer}>
              <input
                ref={searchInputRef}
                type="text"
                className={styles.searchInput}
                placeholder="¿Qué auto buscas? (ej: Toyota Corolla, SUV, deportivo...)"
                value={busquedaTexto}
                onChange={(e) => setBusquedaTexto(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                aria-label="Buscar vehículo"
              />
              
              {/* Sugerencias autocompletadas */}
              {showSuggestions && sugerencias.length > 0 && (
                <ul className={styles.suggestions} role="listbox">
                  {sugerencias.map(s => (
                    <li 
                      key={s.id} 
                      className={styles.suggestionItem} 
                      role="option" 
                      onClick={() => seleccionarSugerencia(s)}
                    >
                      <div className={styles.suggestionContent}>
                        <span className={styles.suggestionName}>{s.nombre}</span>
                        {s.categoria?.nombre && (
                          <span className={styles.suggestionCategory}>— {s.categoria.nombre}</span>
                        )}
                      </div>
                      <span className={styles.suggestionPrice}>${s.precio}/día</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.dateSection}>
              <div className={styles.dateInputs}>
                <div className={styles.dateField}>
                  <label htmlFor="fechaDesde" className={styles.dateLabel}>Fecha de inicio</label>
                  <input
                    id="fechaDesde"
                    type="date"
                    className={styles.dateInput}
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    aria-label="Fecha desde"
                  />
                </div>
                <div className={styles.dateField}>
                  <label htmlFor="fechaHasta" className={styles.dateLabel}>Fecha de fin</label>
                  <input
                    id="fechaHasta"
                    type="date"
                    className={styles.dateInput}
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    aria-label="Fecha hasta"
                    min={fechaDesde || undefined}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className={styles.searchButton} 
                disabled={isBuscando}
              >
                {isBuscando ? (
                  <span className={styles.searchButtonContent}>
                    <span className={styles.spinner}></span>
                    Buscando...
                  </span>
                ) : (
                  <span className={styles.searchButtonContent}>
                    🔍 Buscar autos disponibles
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Resultados de búsqueda */}
          {resultados.length > 0 && (
            <div className={styles.resultsSection}>
              <div className={styles.resultsHeader}>
                <h3 className={styles.resultsTitle}>
                  {resultados.length} {resultados.length === 1 ? 'auto encontrado' : 'autos encontrados'}
                </h3>
                <button 
                  className={styles.filterButton}
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                >
                  🔍 Filtrar
                </button>
              </div>

              {/* Panel de filtros */}
              {showFilterMenu && (
                <div className={styles.filterMenu}>
                  <div className={styles.filterHeader}>
                    <h4>Filtrar por categorías</h4>
                    <button 
                      className={styles.closeFilterButton}
                      onClick={() => setShowFilterMenu(false)}
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className={styles.categoriasFiltros}>
                    {categorias.map(cat => (
                      <label key={cat.id} className={styles.categoriaFiltro}>
                        <input
                          type="checkbox"
                          checked={categoriasSeleccionadas.includes(cat.id)}
                          onChange={() => toggleCategoria(cat.id)}
                        />
                        <span>{cat.nombre}</span>
                      </label>
                    ))}
                  </div>
                  
                  {categoriasSeleccionadas.length > 0 && (
                    <div className={styles.selectedFilters}>
                      <span>Categorías seleccionadas:</span>
                      {categoriasSeleccionadas.map(catId => {
                        const cat = categorias.find(c => c.id === catId);
                        return (
                          <span key={catId} className={styles.filterTag}>
                            {cat?.nombre}
                            <button 
                              onClick={() => toggleCategoria(catId)}
                              className={styles.removeFilterButton}
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                      <button 
                        className={styles.limpiarFiltrosButton}
                        onClick={limpiarFiltros}
                      >
                        Limpiar todo
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.resultsGrid}>
                {resultados.map(prod => (
                  <ProductoCard key={prod.id} producto={prod} />
                ))}
              </div>
            </div>
          )}
        </section>

        
        {aleatorios.length > 0 && (
          <section className={styles.aleatoriosSection}>
            <div className={styles.sectionHeader}>
              <h2>Descubrí autos</h2>
            </div>
            <div className={styles.aleatoriosGrid}>
              {aleatorios.slice(0, 10).map(prod => (
                <ProductoCard key={prod.id} producto={prod} />
              ))}
            </div>
          </section>
        )}

        <div className={styles.sectionsWrapper}>

          <section className={styles.categorias}>
            <h2>Categorías</h2>
            {categorias.map(cat => (
              <div key={cat.id}
                className={styles.categoria}
                onMouseEnter={() => setCategoriaActiva(cat.id)}
                onMouseLeave={() => setCategoriaActiva(null)}>
                {(() => {
                  const url = resolveCategoriaImagenUrl(cat);
                  return url ? (
                    <img
                      src={url}
                      alt={cat.nombre}
                      className={styles.categoriaImagen}
                      onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                    />
                  ) : null;
                })()}
                <h3>{cat.nombre}</h3>

                {categoriaActiva === cat.id && (
                  <div className={styles.popupProductos}>
                    {productos
                      .filter(p => {
                        if (!p) return false;
                        const c = p.categoria;
                        if (!c) return false;
                        if (typeof c === 'object' && c !== null) return c.id === cat.id;
                        
                        return c === cat.id || c === cat.nombre;
                      })
                      .map(p => (
                        <div key={p.id} className={styles.miniProducto}>
                          <img src={p.imagenUrl} alt={p.nombre} />
                          <p>{p.nombre}</p>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            ))}
          </section>

         
          <section className={styles.recomendaciones}>
            <h2>Recomendaciones</h2>
            <div className={styles.productosGrid}>
              {recomendaciones.map(prod => (
                <ProductoCard key={prod.id} producto={prod} />
              ))}
            </div>
          </section>

        </div>
      </main>
      
      <NotificationContainer 
        notifications={notifications} 
        removeNotification={removeNotification} 
      />
    </>
    )
}