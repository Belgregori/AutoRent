import React, { useEffect, useState } from 'react';
import styles from './agregarCategoria.module.css';

export const AgregarCategoria = ({ productoId }) => {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
  const token = localStorage.getItem('token'); 
  fetch('/api/categorias', {
    headers: {
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => setCategorias(data))
    .catch(err => console.error(err));
}, []);


  const handleAgregarCategoria = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !descripcion.trim()) {
      alert('Completa todos los campos');
      return;
    }


    const formData = new FormData();
    formData.append('nombre', nombre.trim());
    formData.append('descripcion', descripcion.trim());
    formData.append('imagen', imagen); // esta es la imagen seleccionada 
 
   const token = localStorage.getItem('token'); 

    fetch('/api/categorias', {
      method: 'POST',
      headeres: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

      .then(res => res.json())
      .then(cat => {
        setCategorias([...categorias, cat]);
        setNombre('');
        setDescripcion('');
        alert('Categoría agregada');
      })
      .catch(() => alert('Error al agregar categoría'));
  };

  const handleEliminarCategoria = (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta categoría?')) return;
    
    const token = localStorage.getItem('token');
    
    fetch(`/api/categorias/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        setCategorias(categorias.filter(cat => cat.id !== id));
        alert('Categoría eliminada');
      })
      .catch(() => alert('Error al eliminar categoría'));
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
    <>
      <h1>Agregar Categoría</h1>
      <form onSubmit={handleAgregarCategoria} className={styles.agregarCategoriaForm}>
        <label>
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
        </label>
        <label>
          Descripción:
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            required
          />
        </label>
        <label>
          Imagen representativa:
          <input
            type="file"
            accept="image/*"
            onChange={e => setImagen(e.target.files[0])}
            required
          />
        </label>
        {imagen && (
          <div className={styles.nombreArchivo}>
            Archivo seleccionado: {imagen.name}
          </div>
        )}
        <button type="submit" style={{ background: '#17a2b8' }}>
          Agregar Categoría
        </button>
      </form>

      <div className={styles.btnVerCategoriasContainer}>
        <button
          type="button"
          className={styles.btnVerCaracteristicas}
          onClick={() => setMostrarCategorias(!mostrarCategorias)}
        >
          Ver Categorías Registradas
        </button>
      </div>
      {mostrarCategorias && (
        <ul className={styles.categoriasList}>
          {categorias.map(cat => (
            <li key={cat.id} className={styles.categoriaItem}>
              <div className={styles.categoriaInfo}>
                {cat.imagenUrl && (
                  <img
                    src={`http://localhost:59216${cat.imagenUrl}`}
                    alt={cat.nombre}
                    className={styles.categoriaImagen}
                  />
                )}
                <span>{cat.nombre} - {cat.descripcion}</span>
              </div>
              <button
                className={styles.btnEliminar}
                onClick={() => handleEliminarCategoria(cat.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};