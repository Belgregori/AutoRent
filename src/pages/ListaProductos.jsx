import React from 'react'
import { useState } from 'react';
import styles from './lista.module.css';




const datosIniciales = [
    { id: 1, nombre: 'Producto 1', disponible: true },
    { id: 2, nombre: 'Producto 2', disponible: true },
    { id: 3, nombre: 'Producto 3', disponible: true },
];

export const ListaProductos = () => {
    const [productos, setProductos] = useState(datosIniciales);

    // Filtramos solo los disponibles para mostrar
    const productosDisponibles = productos.filter(p => p.disponible);

    const eliminarProducto = (id) => {
        if (window.confirm('¿Querés eliminar este producto? No hay vuelta atrás.')) {
            setProductos(productos.filter(p => p.id !== id));
        }
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
                                    <button
                                        onClick={() => eliminarProducto(prod.id)}
                                        style={{ color: 'red', cursor: 'pointer' }}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

