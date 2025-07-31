import React, { useState, useEffect } from 'react';
import styles from './Main.module.css';
import { useNavigate } from 'react-router-dom';

export const Main = () => {
  const navigate = useNavigate();

  // Estados
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [aleatorios, setAleatorios] = useState([]);
  
  
  useEffect(() => {
    fetch('/api/categorias')
      .then(res => res.json())
      .then(data => {
        setCategorias(data);
      })
      .catch(err => console.error('Error cargando categorías:', err));
  }, []);

  
  useEffect(() => {
    fetch('/api/productos')
      .then(res => res.json())
      .then(data => {
        const productosTransformados = data.map(transformProducto).filter(p => p !== null)
        setProductos(productosTransformados);
        setRecomendaciones(productosTransformados.slice(0, 5));
      })
      .catch(err => console.error('Error cargando productos:', err));
  }, []);

  useEffect(() => {// 1) Leemos el flag
    const yaCargo = sessionStorage.getItem('primerCargaAleatorios');
  
    
    if (yaCargo) {
      setAleatorios([]);
      return;
    }
  
    
    const fetchProductosAleatorios = async () => {
      try {
        const response = await fetch('/api/productos/random?cantidad=10');
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

  return (
    <main className={styles.main}>

{/* Productos Aleatorios al iniciar */}
<section className={styles.aleatorios}>
  
  <div className={styles.productosGrid}>
    {aleatorios.map(producto => (
      <ProductoCard key={producto.id} producto={producto} />
    ))}
  </div>
</section>
 

      {/* Categorías con sus productos */}
      <section className={styles.categorias}>
        <h2>Categorías</h2>
        {categorias.map(cat => (
          <div key={cat.id} className={styles.categoria}>
            <h3>{cat.nombre}</h3>
            <div className={styles.productosGrid}>
              {/* Filtramos productos que pertenezcan a esta categoría */}
              {productos
                .filter(prod => prod.categoria && (prod.categoria.id === cat.id || prod.categoria === cat.nombre))
                .map(prod => (
                  <ProductoCard key={prod.id} producto={prod} />
                ))
              }
            </div>
          </div>
        ))}
      </section>

      {/* Recomendaciones fijas */}
      <section className={styles.recomendaciones}>
        <h2>Recomendaciones</h2>
        <div className={styles.productosGrid}>
          {recomendaciones.map(prod => (
            <ProductoCard key={prod.id} producto={prod} />
          ))}
        </div>
      </section>

    </main>
  );
}
