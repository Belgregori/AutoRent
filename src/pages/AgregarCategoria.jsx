import React, { useEffect, useState } from 'react'
import styles from './agregarCategoria.module.css'


export const AgregarCategoria = ({ productoId }) => {
    const [categorias, setCategorias] = useState([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState(null);
    const [mostrarCategorias, setMostrarCategorias] = useState(false);

    useEffect(() => {
        fetch('/api/categorias')
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

  fetch('/api/categorias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: nombre.trim(), descripcion: descripcion.trim() })
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
        fetch(`/api/categorias/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            setCategorias(categorias.filter(cat => cat.id !== id));
            alert('Categoría eliminada');
        })
        .catch(() => alert('Error al eliminar categoría'));
    };

   

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
        <ul>
            {categorias.map(cat => (
                <li key={cat.id}>
                    {cat.nombre} - {cat.descripcion}
                    <button
                        style={{ marginLeft: '1rem', color: 'red' }}
                        onClick={() => handleEliminarCategoria(cat.id)}
                    >
                        Eliminar
                    </button>
                </li>
            ))}
        </ul>
    )}
        </>
    )
}