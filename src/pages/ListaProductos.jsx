import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './lista.module.css';

export const ListaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetch('/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al cargar productos:', err));
  }, []);

  const handleEditarProductos = (id) => {
    navigate(`/EditarProducto/${id}`);
  };

  const eliminarProducto = (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    fetch(`/api/productos/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setProductos(productos.filter(prod => prod.id !== id));
          alert('Producto eliminado con éxito');
        } else {
          alert('Error al eliminar el producto');
        }
      })
      .catch(() => alert('Error al eliminar el producto en el servidor'));
  };

  if (isMobile) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h2>⚠️ Acceso restringido</h2>
        <p>Esta sección no está disponible en dispositivos móviles.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Productos Disponibles</h2>
      {productos.length === 0 ? (
        <p>No hay productos disponibles para mostrar.</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{ width: '100%', borderCollapse: 'collapse' }}
        >
          <thead style={{ backgroundColor: '#eee' }}>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(prod => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.nombre}</td>
                <td>
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
                      Editar Producto
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};



