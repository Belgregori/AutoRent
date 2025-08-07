import React, { useEffect, useState } from 'react';
import styles from './administrarCaract.module.css';

export const AdministrarCaracteristicas = () => {
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [nuevaCaracteristica, setNuevaCaracteristica] = useState('');
  const [editando, setEditando] = useState(null);
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState('');
  const [caracteristicaId, setCaracteristicaId] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [imagenCaracteristica, setImagenCaracteristica] = useState(null);


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    cargarCaracteristicas();
    cargarProductos();
  }, []);

  const cargarCaracteristicas = async () => {
    const token = localStorage.getItem('token');

    const res = await fetch(`/api/caracteristicas`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    setCaracteristicas(data);
  };


  const cargarProductos = async () => {
    const token = localStorage.getItem('token');

    const res = await fetch('/api/productos', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    setProductos(data);
  };

  const crearCaracteristica = async () => {
    if (!nuevaCaracteristica.trim()) return;
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('nombre', nuevaCaracteristica);
    if (imagenCaracteristica) {
      formData.append('imagen', imagenCaracteristica);
    }

    await fetch('/api/caracteristicas', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,

      },
      body: formData
    });

    setNuevaCaracteristica('');
    setImagenCaracteristica(null);
    cargarCaracteristicas();
  };

  const eliminarCaracteristica = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/caracteristicas/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    cargarCaracteristicas();
  };


  const editarCaracteristica = async (id, nombre) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/caracteristicas/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre })
    });
    setEditando(null);
    cargarCaracteristicas();
  };

  const asociarCaracteristica = async () => {
    if (!productoId || !caracteristicaId) return;
    const token = localStorage.getItem('token');
    await fetch(`/api/productos/${productoId}/caracteristicas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: caracteristicaId })
    });
    alert('¡Asociada con éxito!');
    setProductoId('');
    setCaracteristicaId('');
    cargarProductos();
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
    <div className={styles.container}>
      <h2 className={styles.title}>Administrar Características</h2>

      <div className={styles.nuevaCaracteristicaWrapper}>
        <input
          className={styles.input}
          placeholder="Nueva característica"
          value={nuevaCaracteristica}
          onChange={e => setNuevaCaracteristica(e.target.value)}
        />
        <label className={styles.botonArchivo}>
          📁 Elegir imagen
          <input
            type="file"
            accept="image/*"
            onChange={e => setImagenCaracteristica(e.target.files[0])}
            style={{ display: 'none' }}
          />
        </label>

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
                {c.imagenUrl && (
                  <img
                    src={c.imagenUrl}
                    alt={c.nombre}
                    className={styles.thumbnail}
                  />
                )}
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
