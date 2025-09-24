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
        'Authorization': `Bearer ${token}`
      }
    })
      .then(async res => {
        if (!res.ok) return [];
        try { return await res.json(); } catch { return []; }
      })
      .then(data => setCategorias(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);


  const handleAgregarCategoria = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !descripcion.trim() || !imagen) {
      alert('Completa todos los campos');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre.trim());
    formData.append('descripcion', descripcion.trim());
    formData.append('imagen', imagen);

    const token = localStorage.getItem('token');

    fetch('/api/categorias', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
      .then(async res => {
        if (!res.ok) {
          if (res.status === 403) {
            alert('No cuenta con los permisos necesarios para realizar esta acción.');
          } else {
            const errorText = await res.text();
            alert('❌ Error al agregar la categoría:\n' + errorText);
          }
          return null;
        }
        // Intenta parsear el JSON, pero si falla igual muestra el alert
        try {
          const cat = await res.json();
          alert('✅ Categoría creada correctamente');
          setCategorias(prev => [...prev, cat]);
          setNombre('');
          setDescripcion('');
          setImagen(null);
        } catch {
          alert('✅ Categoría creada correctamente');
          setNombre('');
          setDescripcion('');
          setImagen(null);
        }
      })
      .catch(err => {
        alert('❌ Error de conexión al agregar categoría');
        console.error('Fallo:', err);
      });
  }


  const handleEliminarCategoria = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta categoría?')) return;

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/api/categorias/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const contentType = res.headers.get('content-type');
      let errorText = '';

      if (!res.ok) {
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          errorText = data.message || JSON.stringify(data);
        } else {
          errorText = await res.text();
        }

        console.error(`❌ Error ${res.status}:`, errorText);
        alert(`❌ No se pudo eliminar la categoría.\nCódigo: ${res.status}\nDetalle: ${errorText}`);
        return;
      }

      // Si todo salió bien
      setCategorias(categorias.filter(cat => cat.id !== id));
      alert('✅ Categoría eliminada correctamente');
    } catch (err) {
      console.error('❌ Error de conexión:', err);
      if (err.status === 403) {
        alert('No cuenta con los permisos necesarios para realizar esta acción.');
      } else {
        alert('❌ Error de conexión al eliminar categoría');
      }
    }
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
                    src={cat.imagenUrl}
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

