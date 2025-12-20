import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './admin.module.css';
import { useEffect } from 'react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import { AdminDesktopOnly } from '../components/AdminDesktopOnly';

export const Adminpage = () => {
  const navigate = useNavigate();

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
    <AdminDesktopOnly>
      <Header />
      <div className={styles.adminContainer}>
        <div className={styles.adminContent}>
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
        </div>
      </div>
      <Footer />
    </AdminDesktopOnly>
  )
}
