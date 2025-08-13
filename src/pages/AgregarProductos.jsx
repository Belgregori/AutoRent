import React, { useEffect, useState } from 'react';
import styles from './agregados.module.css';

export const AgregarProductos = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(0);
  const [imagenes, setImagenes] = useState([]);

  const [mostrarNombre, setMostrarNombre] = useState(false);
  const [mostrarImagen, setMostrarImagen] = useState(false);
  const [mostrarDescripcion, setMostrarDescripcion] = useState(false);
  const [mostrarPrecio, setMostrarPrecio] = useState(false);

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

  const handleSubirImagenes = (e) => {
    setImagenes([...imagenes, ...Array.from(e.target.files)]);
    setMostrarImagen(false);
  };

  const handleGuardarPrecio = () => {
    setMostrarPrecio(false);
  };

  const handleAgregarProducto = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !descripcion.trim() || !precio) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre.trim());
    formData.append('descripcion', descripcion.trim());
    formData.append('precio', precio);

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    

    imagenes.forEach((imagen) => {
      formData.append(`imagen_`, imagen);
    });

    try {
      const token = localStorage.getItem('token');
     
      console.log('🧾 Descripción enviada:', descripcion);

      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      console.log('📌 STATUS:', response.status, response.statusText);
      console.log('📌 HEADERS:', [...response.headers]);

      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log('📌 BODY CRUDO DEL BACKEND:', data);

      if (response.ok) {
        alert('✅ Producto agregado con éxito');
        setNombre('');
        setDescripcion('');
        setPrecio(0);
        setImagenes([]);
      } else {
        alert('❌ Error al agregar el producto');
      }
    } catch (error) {
      alert('❌ Error en la conexión al servidor');
      alert('Detalles del error: ' + error.message);
      console.error(error);
    }
  };

  if (isMobile) {  //No pueden acceder desde dispositivos móviles
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h2>⚠️ Acceso restringido</h2>
        <p>Esta sección no está disponible en dispositivos móviles.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleAgregarProducto}>
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
                required
              />
              <button type="button" onClick={handleAgregarNombre} className={styles.confirmar}>
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
              <input
                type="file"
                className={styles.input}
                onChange={handleSubirImagenes}
                accept="image/*"
                multiple
              />
              {imagenes.length > 0 && (
                <ul>
                  {imagenes.map((img, idx) => (
                    <li key={idx}>{img.name}</li>
                  ))}
                </ul>
              )}
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
                value={precio === 0 ? '' : precio}
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
      </div>

      <div className={styles.botonEnviar}>
        <button type="submit" className={styles.enviar}>
          Guardar Producto
        </button>
      </div>
    </form>
  );
};
