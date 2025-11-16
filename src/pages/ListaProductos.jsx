import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './lista.module.css';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import { AdminDesktopOnly } from '../components/AdminDesktopOnly';

export const ListaProductos = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    fetch('/api/productos', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('No autorizado o error al obtener productos');
        }
        return res.json();
      })
      .then(data => setProductos(data))
      .catch(err => console.error('Error al cargar productos:', err));
  }, []);

  const handleEditarProductos = (id) => {
    navigate(`/EditarProducto/${id}`);
  };

  const eliminarProducto = (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;

    const token = localStorage.getItem('token');
    fetch(`/api/productos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.ok) {
          setProductos(productos.filter(prod => prod.id !== id));
          alert('Producto eliminado con éxito');
        } else {
          if (res.status === 403) {
            alert('No cuenta con los permisos necesarios para realizar esta acción.');
          } else {
            alert('Error al eliminar el producto');
          }
        }
      })
      .catch(() => alert('Error al eliminar el producto en el servidor'));
  };

  return (
    <AdminDesktopOnly>
      <Header />
      <div className={styles.productosContainer}>
        <h2 className={styles.titulo}>Productos Disponibles</h2>
        {productos.length === 0 ? (
          <div className={styles.sinProductos}>
            <p>No hay productos disponibles para mostrar.</p>
          </div>
        ) : (
          <div className={styles.productosGrid}>
            {productos.map((prod, index) => (
              <div key={prod.id} className={styles.productoCard} style={{ animationDelay: `${index * 0.1}s` }}>
                {prod.imagenesData && prod.imagenesData.length > 0 ? (
                  <img
                    src={`data:image/jpeg;base64,${prod.imagenesData[0]}`}
                    alt={prod.nombre}
                    className={styles.productoImagen}
                  />
                ) : (
                  <div className={styles.productoImagen} style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '1.2rem'
                  }}>
                    Sin imagen
                  </div>
                )}
                <div className={styles.productoInfo}>
                  <h3 className={styles.productoNombre}>{prod.nombre}</h3>
                  <p className={styles.productoId}>ID: {prod.id}</p>
                  <div className={styles.Botones}>
                    <button
                      className={styles.botonEliminar}
                      onClick={() => eliminarProducto(prod.id)}
                    >
                      Eliminar
                    </button>
                    <button
                      className={styles.botonEditar}
                      onClick={() => handleEditarProductos(prod.id)}
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </AdminDesktopOnly>
  );
};


