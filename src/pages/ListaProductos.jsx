import React from 'react'
import { useState } from 'react';
import styles from './lista.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';




export const ListaProductos = () => {
    const [productos, setProductos] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetch('/api/productos')
        .then(res => res.json())
        .then(data => setProductos(data))
        .catch(err =>console.error('Error al cargar productos:', err));
    }, []);

    const handleEditarProductos = (id) => {
        navigate(`/EditarProducto/${id}`);
    };

    const productosDisponibles = productos;

    const eliminarProducto = (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
        fetch(`/api/productos/${id}`, {method: 'DELETE'})
        .then(res => {
            if (res.ok) {
                setProductos(productos.filter(prod => prod.id !== id));
                alert('Producto eliminado con éxito');
            }else{
                alert('Error al eliminar el producto');
            }
    })
    .catch(() => alert('Error al eliminar el producto en el servidor'))
};

    return (
        <div>
            <h2>Productos Disponibles</h2>
            {productosDisponibles.length === 0 ? (
                <p>No hay productos disponibles para mostrar.</p>
            ) : (
                <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#eee' }}>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosDisponibles.map(prod => (
                            <tr key={prod.id}>
                                <td>{prod.id}</td>
                                <td>{prod.nombre}</td>
                                <td>
                                    <div className={styles.Botones}>
                                    <button className={styles.botonEliminar}
                                    
                                        onClick={() => eliminarProducto(prod.id)}
                                        
                                    >
                                        Eliminar
                                    </button>
                                    <button  
                                        className={styles.botonEditar}
                                        onClick={() => handleEditarProductos(prod.id)}>
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




