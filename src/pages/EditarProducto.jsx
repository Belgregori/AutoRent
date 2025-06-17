import React from 'react'
import styles from './editarProducto.module.css'
export const EditarProducto = () => {
    return (
        <>
            <h1>Editar Producto</h1>
            <button type="button" className={styles.btnVerCaracteristicas}>Ver Caracteristicas Registradas</button>
            <div className={styles.editarCaract}>
                <div className={styles.agregarCaracteristicas}>
                </div>
                <div className={styles.editarCaracteristicas}></div>
                <div className={styles.eliminarCaracteristicas}></div>
            </div>
        </>
    )
}
