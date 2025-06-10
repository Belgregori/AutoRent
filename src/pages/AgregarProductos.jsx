import React, { useState } from 'react';
import styles from './agregados.module.css';

export const AgregarProductos = () => {
  const [mostrarNombre, setMostrarNombre] = useState(false);
  const [mostrarImagen, setMostrarImagen] = useState(false);
  const [mostrarDescripcion, setMostrarDescripcion] = useState(false);

  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [errorNombre, setErrorNombre] = useState('');

  const handleAgregarNombre = () => {
    const nombreNormalizado = nombre.trim().toLowerCase();
    const yaExiste = productos.some(
      (prod) => prod.toLowerCase() === nombreNormalizado
    );

    if (yaExiste) {
      setErrorNombre('⚠️ Ese nombre de producto ya existe');
    } else {
      setProductos([...productos, nombre.trim()]);
      setErrorNombre('');
      alert('✅ Nombre agregado con éxito');
      setNombre('');
    }
  };

  return (
    <>
      <h1 className={styles.titulo}>Agregar Producto</h1>

      <div className={styles.botones}>
        <div className={styles.bloque}>
          <button
            type="button"
            className={styles.agregarNombre}
            onClick={() => setMostrarNombre(!mostrarNombre)}
          >
            Agregar Nombre
          </button>
          {mostrarNombre && (
            <div className={styles.seccion}>
              <input
                type="text"
                value={nombre}
                placeholder="Nombre del auto"
                onChange={(e) => setNombre(e.target.value)}
                className={styles.input}
              />
              <button onClick={handleAgregarNombre} className={styles.confirmar}>
                Confirmar
              </button>
              {errorNombre && <p className={styles.error}>{errorNombre}</p>}
            </div>
          )}
        </div>

        <div className={styles.bloque}>
          <button
            type="button"
            className={styles.agregarImagen}
            onClick={() => setMostrarImagen(!mostrarImagen)}
          >
            Agregar Imagen
          </button>
          {mostrarImagen && (
            <div className={styles.seccion}>
              <input type="file" className={styles.input} />
              <button className={styles.confirmar}>Subir Imagen</button>
            </div>
          )}
        </div>

        <div className={styles.bloque}>
          <button
            type="button"
            className={styles.agregarDescripcion}
            onClick={() => setMostrarDescripcion(!mostrarDescripcion)}
          >
            Agregar descripción
          </button>
          {mostrarDescripcion && (
            <div className={styles.seccion}>
              <textarea
                placeholder="Descripción del producto"
                className={styles.input}
                rows="4"
              />
              <button className={styles.confirmar}>Guardar Descripción</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
