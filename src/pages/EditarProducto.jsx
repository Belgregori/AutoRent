import React, { useEffect, useState } from 'react';
import styles from './editarProducto.module.css';

export const EditarProducto = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [categoriaId, setCategoriaId] = useState('');

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const cargarProductos = async () => {
    const res = await fetch('/api/productos');
    const data = await res.json();
    setProductos(data);
  };

  const cargarCategorias = async () => {
    const res = await fetch('/api/categorias');
    const data = await res.json();
    setCategorias(data);
  };

  const seleccionarProducto = (id) => {
    const prod = productos.find(p => p.id === parseInt(id));
    setProductoSeleccionado(prod);
    setNuevoNombre(prod?.nombre || '');
    setCategoriaId(prod?.categoria?.id || '');
  };

  const guardarCambios = async () => {
    if (!productoSeleccionado) return;

    await fetch(`/api/productos/${productoSeleccionado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nuevoNombre,
        categoria: { id: categoriaId }
      })
    });

    alert('Producto actualizado con éxito');
    setProductoSeleccionado(null);
    setNuevoNombre('');
    setCategoriaId('');
    cargarProductos();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Editar Producto</h2>

      <select className={styles.select} onChange={e => seleccionarProducto(e.target.value)}>
        <option value="">-- Seleccionar producto --</option>
        {productos.map(p => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>

      {productoSeleccionado && (
        <div className={styles.formulario}>
          <input
            className={styles.input}
            value={nuevoNombre}
            onChange={e => setNuevoNombre(e.target.value)}
            placeholder="Nuevo nombre del producto"
          />

          <select
            className={styles.select}
            value={categoriaId}
            onChange={e => setCategoriaId(e.target.value)}
          >
            <option value="">-- Seleccionar categoría --</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>

          <button className={styles.botonGuardar} onClick={guardarCambios}>
            Guardar Cambios
          </button>

          <p className={styles.infoActual}>
            <strong>Categoría actual:</strong>{' '}
            {productoSeleccionado.categoria?.nombre || 'Sin categoría asignada'}
          </p>
        </div>
      )}
    </div>
  );
};

