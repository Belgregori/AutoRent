import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './admin.module.css';
import { useState, useEffect } from 'react';

export const Adminpage = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile(); // Verifica al cargar
    window.addEventListener('resize', checkMobile); // Verifica si se redimensiona

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Petición GET a /admin con JWT
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/admin', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('Admin data:', data);
      } catch (error) {
        console.error('Error al cargar datos de admin:', error);
      }
    };

    fetchAdminData();
  }, []);

  if (isMobile) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h2>⚠️ Acceso restringido</h2>
        <p>El panel de administración no está disponible en dispositivos móviles.</p>
      </div>
    );
  }


  const handleAgregarProducto = () => {
    navigate('/AgregarProductos');
  };

  const handleListaProductos = () => {
    navigate('/ListaProductos');
  };

  const handleAgregarCategoria = () => {
    navigate('/AgregarCategoria');
  };

  const handleAdministarCaracteristicas = () => {
    navigate('/AdministrarCaracteristicas');
  }

  const handleAdministrarPermisos = () => {
    navigate('/AdministrarPermisos');
  }

  return (
    <>
      <h1>Panel del Administrador</h1>

      <button
        type="button"
        className={styles.agregarProducto}
        onClick={handleAgregarProducto}
      >
        Agregar Producto
      </button>

      <button
        type="button"
        className={styles.listaProductos}
        onClick={handleListaProductos}
      >
        Ver lista de productos
      </button>

      <button type="button"
        className={styles.AgregarCategoria}
        onClick={handleAgregarCategoria}>
        Agregar Categoria
      </button>

      <button type="button"
        className={styles.AdministrarCaracteristicas}
        onClick={handleAdministarCaracteristicas}>
        Administrar Caracteristicas
      </button>
 
      <button type="button"
        className={styles.AdministrarPermisos}  
        onClick={handleAdministrarPermisos}>
        Administrar Permisos
      </button>

    </>
  )
}
