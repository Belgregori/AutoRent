import React, { useEffect, useState } from 'react';
import styles from './administrarCaract.module.css';

export const AdministrarCaracteristicas = () => {
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [nuevaCaracteristica, setNuevaCaracteristica] = useState('');
  const [editando, setEditando] = useState(null);
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState('');
  const [caracteristicaId, setCaracteristicaId] = useState('');

  useEffect(() => {
    cargarCaracteristicas();
    cargarProductos();
  }, []);

  const cargarCaracteristicas = async () => {
    const res = await fetch(`/api/caracteristicas`);
    const data = await res.json();
    setCaracteristicas(data);
  };

  const cargarProductos = async () => {
    const res = await fetch('/api/productos');
    const data = await res.json();
    setProductos(data);
  };

  const crearCaracteristica = async () => {
    if (!nuevaCaracteristica.trim()) return;
    await fetch('/api/caracteristicas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nuevaCaracteristica })
    });
    setNuevaCaracteristica('');
    cargarCaracteristicas();
  };

  const eliminarCaracteristica = async (id) => {
    await fetch(`/api/caracteristicas/${id}`, { method: 'DELETE' });
    cargarCaracteristicas();
  };

  const editarCaracteristica = async (id, nombre) => {
    await fetch(`/api/caracteristicas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre })
    });
    setEditando(null);
    cargarCaracteristicas();
  };

  const asociarCaracteristica = async () => {
    if (!productoId || !caracteristicaId) return;
    await fetch(`/api/productos/${productoId}/caracteristicas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: caracteristicaId })
    });
    alert('¡Asociada con éxito!');
    setProductoId('');
    setCaracteristicaId('');
    cargarProductos(); // Refrescar las características asignadas
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Administrar Características</h2>

      <div className={styles.nuevaCaracteristicaWrapper}>
        <input
          className={styles.input}
          placeholder="Nueva característica"
          value={nuevaCaracteristica}
          onChange={e => setNuevaCaracteristica(e.target.value)}
        />
        <button className={styles.botonAgregar} onClick={crearCaracteristica}>Agregar</button>
      </div>

      <ul className={styles.listaCaracteristicas}>
        {caracteristicas.map(c => (
          <li key={c.id} className={styles.caracteristicaItem}>
            {editando === c.id ? (
              <input
                className={styles.inputEditar}
                defaultValue={c.nombre}
                onBlur={e => editarCaracteristica(c.id, e.target.value)}
                autoFocus
              />
            ) : (
              <>
                <span>{c.nombre}</span>
                <div className={styles.botones}>
                  <button className={styles.botonEditar} onClick={() => setEditando(c.id)}>Editar</button>
                  <button className={styles.botonEliminar} onClick={() => eliminarCaracteristica(c.id)}>Eliminar</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <h3 className={styles.title}>Asociar característica a producto</h3>

      <select className={styles.select} value={productoId} onChange={e => setProductoId(e.target.value)}>
        <option value="">-- Seleccionar producto --</option>
        {productos.map(p => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>

      <select className={styles.select} value={caracteristicaId} onChange={e => setCaracteristicaId(e.target.value)}>
        <option value="">-- Seleccionar característica --</option>
        {caracteristicas.map(c => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>

      <button className={styles.botonAsociar} onClick={asociarCaracteristica}>Asociar</button>

      <h3 className={styles.title}>Productos y sus características</h3>
      <ul className={styles.listaProductos}>
        {productos.map(p => (
          <li key={p.id} className={styles.productoItem}>
            <strong>{p.nombre}</strong>  
            <small className={styles.caracteristicasAsignadas}>
              {p.caracteristicas && p.caracteristicas.length > 0
                ? p.caracteristicas.map(c => c.nombre).join(', ')
                : 'Sin características asignadas'}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};



