import React, { useState, useEffect } from 'react'
import styles from './Main.module.css'
import { useNavigate } from 'react-router-dom';

export const Main = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);

  const transformProducto = (producto) => {
    if (!producto || typeof producto !== 'object') {
      return null;
    }

    return {
      id: String(producto.id || Math.random().toString()),
      nombre: String(producto.nombre || 'Producto sin nombre'),
      categoria: String(producto.categoria || 'Sin categoría'),
      precio: Number(producto.precio || 0).toFixed(2),
      disponible: Boolean(producto.disponible),
      imagenUrl: producto.imagenUrl || producto.imagen || ''
    };
  };

  useEffect(() => {
    const productosGuardados = sessionStorage.getItem('productosAleatorios');

    if (productosGuardados) {
      setProductos(JSON.parse(productosGuardados));
      return;
    }

    const fetchProductosAleatorios = async () => {
      try {
        const response = await fetch('/api/productos/random?cantidad=10');
        if (!response.ok) {
          throw new Error('Error al obtener productos');
        }

        const data = await response.json();
        const productosValidos = data
          .map(transformProducto)
          .filter(producto => producto !== null)
          .slice(0, 10);

        console.log('Productos procesados:', productosValidos);
        setProductos(productosValidos);
        sessionStorage.setItem('productosAleatorios', JSON.stringify(productosValidos));
      } catch (error) {
        console.error('Error al obtener productos:', error);
        setProductos([]);
      }
    };

    fetchProductosAleatorios();
  }, []);




  return (
    <main className={styles.main}>
      <div className={styles.productosContainer}>
        <div className={styles.productosGrid}>
          {productos.map((producto) => (
            <div key={producto.id} className={styles.productoCard}>
              <div className={styles.productoImagen}>
                {producto.imagenUrl ? (
                  <img
                    src={producto.imagenUrl}
                    alt={producto.nombre}
                    className={styles.productoImagenImg}
                  />
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
                <p className={styles.productoCategoria}>{producto.categoria}</p>
                <div className={styles.productoPrecio}>
                  <span className={styles.precio}>${producto.precio}</span>
                  <span className={styles.periodo}>/día</span>
                </div>

                <div className={styles.productoAcciones}>
                  <button
                    className={styles.verDetalleButton}
                    onClick={() => navigate(`/producto/${producto.id}`)}
                  >
                    Ver Detalle
                  </button>
                  <button
                    className={styles.reservarButton}
                    disabled={!producto.disponible}
                  >
                    {producto.disponible ? 'Reservar' : 'No Disponible'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}