import React, { useState } from 'react';
import styles from './agregados.module.css';

export const AgregarProductos = () => {

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(0);
  const [categoria, setCategoria] = useState('');
  const [imagen, setImagen] = useState(null);


  const [mostrarNombre, setMostrarNombre] = useState(false);
  const [mostrarImagen, setMostrarImagen] = useState(false);
  const [mostrarDescripcion, setMostrarDescripcion] = useState(false);
  const [mostrarPrecio, setMostrarPrecio] = useState(false);
  const [mostrarCategoria, setMostrarCategoria] = useState(false);


  const [errorNombre, setErrorNombre] = useState('');


  const handleAgregarNombre = () => {
    if (!nombre.trim()) {
      setErrorNombre('El nombre es obligatorio');
    } else {
      setErrorNombre('');
      setMostrarNombre(false);
    }
  };

  const handleGuardarDescripcion = () => {
    setMostrarDescripcion(false);
  };


  const handleSubirImagen = () => {
    setMostrarImagen(false);
  };

  const handleGuardarPrecio = () => {
    setMostrarPrecio(false);
  }

  const handleGuardarCategoria = () => {
    setMostrarCategoria(false);
  }

  const handleAgregarProducto = async (e) => {
    e.preventDefault();


    if (!nombre.trim() || !descripcion.trim() || !precio || !categoria) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre.trim());
    formData.append('descripcion', descripcion.trim());
    formData.append('precio', precio);
    formData.append('categoria', categoria);
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      const response = await fetch('/api/productos/agregar', {
        method: 'POST',
        body: formData,
        headers: {

        }
      });

      const text = await response.text();
      const resultado = text ? JSON.parse(text) : {};
      console.log('Respuesta del servidor:', resultado);


      if (response.ok) {
        alert('✅ Producto agregado con éxito');

        setNombre('');
        setDescripcion('');
        setPrecio(0);
        setCategoria('');
        setImagen(null);
      } else {
        alert('❌ Error al agregar el producto');
      }
    } catch (error) {
      alert('❌ Error en la conexión al servidor');
      alert('Detalles del error: ' + error.message);
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleAgregarProducto}>
      <h1 className={styles.titulo}>Agregar Producto</h1>
      <div className={styles.botones}>
        {/* Sección Nombre */}
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
                required
              />
              <button type="button" onClick={handleAgregarNombre} className={styles.confirmar}>
                Confirmar
              </button>
              {errorNombre && <p className={styles.error}>{errorNombre}</p>}
            </div>
          )}
        </div>
        {/* Sección Imagen */}
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
              <input
                type="file"
                className={styles.input}
                onChange={(e) => setImagen(e.target.files[0])}
                accept="image/*"
              />
              <button type="button" className={styles.confirmar} onClick={handleSubirImagen}>
                Subir Imagen
              </button>
            </div>
          )}
        </div>
        {/* Sección Descripción */}
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
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
              <button type="button" className={styles.confirmar} onClick={handleGuardarDescripcion}>
                Guardar Descripción
              </button>
            </div>
          )}
        </div>
        {/* Sección Precio */}
        <div className={styles.bloque}>
          <button
            type="button"
            className={styles.agregarNombre}
            onClick={() => setMostrarPrecio(!mostrarPrecio)}
          >
            Agregar Precio
          </button>
          {mostrarPrecio && (
            <div className={styles.seccion}>
              <input
                type="number"
                value={precio}
                placeholder="Precio"
                onChange={(e) => setPrecio(parseFloat(e.target.value))}
                className={styles.input}
                required
              />
              <button type="button" className={styles.confirmar} onClick={handleGuardarPrecio}>
                Guardar Precio
              </button>
            </div>
          )}
        </div>
        {/* Sección Categoría */}
        <div className={styles.bloque}>
          <button
            type="button"
            className={styles.agregarNombre}
            onClick={() => setMostrarCategoria(!mostrarCategoria)}
          >
            Agregar Categoría
          </button>
          {mostrarCategoria && (
            <div className={styles.seccion}>
              <input
                type="text"
                value={categoria}
                placeholder="Categoría"
                onChange={(e) => setCategoria(e.target.value)}
                className={styles.input}
                required
              />
              <button type="button" className={styles.confirmar} onClick={handleGuardarCategoria}>
                Guardar Categoria
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={styles.botonEnviar}>
        <button type="submit" className={styles.enviar}>
          Guardar Producto</button>
      </div>
    </form>
  );
}

