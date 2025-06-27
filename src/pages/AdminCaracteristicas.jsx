import React, { useEffect, useState } from 'react';
import styles from './adminCaracteristicas.module.css';

export const AdminCaracteristicas = () => {
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [caracteristicaEdit, setCaracteristicaEdit] = useState(null);

  useEffect(() => {
    fetch('/api/caracteristicas')
      .then(res => res.json())
      .then(data => setCaracteristicas(data));
    fetch('/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    const method = caracteristicaEdit ? 'PUT' : 'POST';
    const url = caracteristicaEdit
      ? `/api/caracteristicas/${caracteristicaEdit.id}`
      : '/api/caracteristicas';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, descripcion }),
    })
      .then(res => res.json())
      .then(data => {
        if (caracteristicaEdit) {
          setCaracteristicas(caracteristicas.map(c => c.id === data.id ? data : c));
          setCaracteristicaEdit(null);
        } else {
          setCaracteristicas([...caracteristicas, data]);
        }
        setNombre('');
        setDescripcion('');
      });
  };

  const handleEliminar = id => {
    if (!window.confirm('¿Eliminar característica?')) return;
    fetch(`/api/caracteristicas/${id}`, { method: 'DELETE' })
      .then(() => setCaracteristicas(caracteristicas.filter(c => c.id !== id)));
  };


  const handleEditar = carac => {
    setCaracteristicaEdit(carac);
    setNombre(carac.nombre);
    setDescripcion(carac.descripcion);
  };

  
  const handleAsociar = (caracteristicaId, productoId) => {
    fetch(`/api/productos/${productoId}/caracteristicas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caracteristicaId }),
    }).then(() => alert('Característica asociada'));
  };

  return (
    <div className={styles.container}>
      <h2>Administrar Características</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Descripción:</label>
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            required
          />
        </div>
        <button type="submit">
          {caracteristicaEdit ? 'Guardar Cambios' : 'Agregar Característica'}
        </button>
        {caracteristicaEdit && (
          <button
            type="button"
            className={styles.cancelar}
            onClick={() => {
              setCaracteristicaEdit(null);
              setNombre('');
              setDescripcion('');
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <h3   
      >Características Registradas</h3>
      <ul>
        {caracteristicas.map(carac => (
          <li key={carac.id}>
            <span>
              <b>{carac.nombre}</b> - {carac.descripcion}
            </span>
            <div className={styles.acciones}>
              <button
                className={styles.editar}
                onClick={() => handleEditar(carac)}
              >
                Editar
              </button>
              <button
                className={styles.eliminar}
                onClick={() => handleEliminar(carac.id)}
              >
                Eliminar
              </button>
              <select
                value=""
                onChange={e => handleAsociar(carac.id, e.target.value)}
              >
                <option value="">Asociar a producto...</option>
                {productos.map(prod => (
                  <option key={prod.id} value={prod.id}>{prod.nombre}</option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
