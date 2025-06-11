import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './admin.module.css'


export const Adminpage = () => {
  const navigate = useNavigate();

  const handleAgregarProducto = () => {
    navigate('/AgregarProductos');
  };

  const handleListaProductos = () => {
    navigate('/ListaProductos');
  };

  return (
    <>
     <h1>Panel del Administrador</h1>
    <button type="button" 
    className={styles.agregarProducto}
    onClick={handleAgregarProducto}>
      Agregar Producto
    </button>

    <button type="button" 
    className={styles.listaProductos}
    onClick={handleListaProductos}>
      Ver lista de productos
    </button>
    </>
  )
}
