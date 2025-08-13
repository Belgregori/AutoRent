import React, { useState, useEffect } from 'react';
import styles from './Main.module.css';
import { useNavigate } from 'react-router-dom';
import { Footer } from './Footer';

export const Main = () => {
  const navigate = useNavigate();


  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [aleatorios, setAleatorios] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(null);

  // Buscador
  const [busquedaTexto, setBusquedaTexto] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [isBuscando, setIsBuscando] = useState(false);



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
        JSON.parse(productosGuardados).map(transformProducto);
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
          .map(transformProducto)
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



  const transformProducto = (producto) => {
    if (!producto || typeof producto !== 'object') return null;


    const imagenesData = producto.imagenesData || [];
    if (imagenesData.length > 0) {
      return {
        id: String(producto.id),
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: Number(producto.precio || 0).toFixed(2),
        disponible: Boolean(producto.disponible),
        imagenUrl: `data:image/jpeg;base64,${imagenesData[0]}`,
      };
    }


    if (producto.imagenUrl) {
      return {
        id: String(producto.id),
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: Number(producto.precio || 0).toFixed(2),
        disponible: Boolean(producto.disponible),
        imagenUrl: producto.imagenUrl,
      };
    }


    return {
      id: String(producto.id),
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: Number(producto.precio || 0).toFixed(2),
      disponible: Boolean(producto.disponible),
      imagenUrl: '',
    };
  };

  useEffect(() => {
    const texto = busquedaTexto.trim().toLowerCase();
    if (!texto) { setSugerencias([]); return; }
    const matches = productos.filter(p => {
      const nombre = (p.nombre || '').toLowerCase();
      const cat = (p.categoria?.nombre || p.categoria || '').toLowerCase();
      return nombre.includes(texto) || cat.includes(texto);
    }).slice(0, 8);
    setSugerencias(matches);
  }, [busquedaTexto, productos]);

  const ejecutarBusqueda = async (e) => {
    if (e) e.preventDefault();
    setIsBuscando(true);
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
            setIsBuscando(false);
            return;
          }
        } catch {
          
        }
      }
      const filtrados = productos.filter(p => {
        if (!texto) return true;
        const nombre = (p.nombre || '').toLowerCase();
        const cat = (p.categoria?.nombre || p.categoria || '').toLowerCase();
        return nombre.includes(texto) || cat.includes(texto);
      });
      setResultados(filtrados);
    } finally {
      setIsBuscando(false);
    }
  };

  const seleccionarSugerencia = (p) => {
    setBusquedaTexto(p.nombre);
    setSugerencias([]);
    setResultados([p]);
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
        <div className={styles.disponibilidadBadge}>
          <span className={producto.disponible ? styles.disponible : styles.noDisponible}>
            {producto.disponible ? 'Disponible' : 'No disponible'}
          </span>
        </div>
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
          <button className={styles.reservarButton} disabled={!producto.disponible}>
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
    <main className={styles.main}>

      
      <section className={styles.searchSection}>
        <h2 className={styles.searchTitle}>Buscá tu próximo auto</h2>
        <p className={styles.searchDesc}>Ingresá un término y un rango de fechas para ver resultados relevantes.</p>
        <form className={styles.searchForm} onSubmit={ejecutarBusqueda}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Marca, modelo o categoría"
            value={busquedaTexto}
            onChange={(e) => setBusquedaTexto(e.target.value)}
            aria-label="Buscar por texto"
          />
          <div className={styles.dateInputs}>
            <input
              type="date"
              className={styles.dateInput}
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              aria-label="Fecha desde"
            />
            <input
              type="date"
              className={styles.dateInput}
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              aria-label="Fecha hasta"
              min={fechaDesde || undefined}
            />
          </div>
          <button type="submit" className={styles.searchButton} disabled={isBuscando}>
            {isBuscando ? 'Buscando…' : 'Realizar búsqueda'}
          </button>
        </form>
        {sugerencias.length > 0 && (
          <ul className={styles.suggestions} role="listbox">
            {sugerencias.map(s => (
              <li key={s.id} className={styles.suggestionItem} role="option" onClick={() => seleccionarSugerencia(s)}>
                {s.nombre} {s.categoria?.nombre ? `— ${s.categoria.nombre}` : ''}
              </li>
            ))}
          </ul>
        )}
        {resultados.length > 0 && (
          <div className={styles.resultsGrid}>
            {resultados.map(prod => (
              <ProductoCard key={prod.id} producto={prod} />
            ))}
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
    
  )
}