import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './administrarCaract.module.css';

export const AdministrarCaracteristicas = () => {
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [nuevaCaracteristica, setNuevaCaracteristica] = useState('');
  const [editando, setEditando] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState('');
  const [caracteristicaId, setCaracteristicaId] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [imagenCaracteristica, setImagenCaracteristica] = useState(null);
  const [imagenPreview, setImagenPreview] = useState('');
  const fileInputRef = useRef(null);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const [isLoadingCaract, setIsLoadingCaract] = useState(true);
  const [isLoadingProd, setIsLoadingProd] = useState(true);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [isAssociating, setIsAssociating] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [isEditingId, setIsEditingId] = useState(null);


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

  const apiFetch = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const mergedHeaders = {
      ...(options.headers || {}),
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
    const response = await fetch(url, { ...options, headers: mergedHeaders });
    if (!response.ok) {
      let errorMessage = '';
      try {
        const asJson = await response.json();
        errorMessage = asJson?.message || asJson?.error || '';
      } catch {
        try {
          errorMessage = await response.text();
        } catch {
          errorMessage = '';
        }
      }
      throw new Error(errorMessage || `Error HTTP ${response.status}`);
    }
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) return response.json();
    return response.text();
  }, []);

  const cargarCaracteristicas = useCallback(async () => {
    setIsLoadingCaract(true);
    try {
      const data = await apiFetch(`/api/caracteristicas`, {
        headers: { 'Content-Type': 'application/json' },
      });
      setCaracteristicas(Array.isArray(data) ? data : []);
    } catch (error) {
      setMensaje({ texto: 'Error al cargar características.', tipo: 'error' });
    } finally {
      setIsLoadingCaract(false);
    }
  }, [apiFetch]);

  const cargarProductos = useCallback(async () => {
    setIsLoadingProd(true);
    try {
      const data = await apiFetch('/api/productos', {
        headers: { 'Content-Type': 'application/json' },
      });
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      setMensaje({ texto: 'Error al cargar productos.', tipo: 'error' });
    } finally {
      setIsLoadingProd(false);
    }
  }, [apiFetch]);

  const crearCaracteristica = async () => {
    if (!nuevaCaracteristica.trim()) return;
    setIsSubmittingCreate(true);
    try {
      const formData = new FormData();
      formData.append('nombre', nuevaCaracteristica);
      if (imagenCaracteristica) {
        formData.append('imagen', imagenCaracteristica);
      }

      await apiFetch('/api/caracteristicas', {
      
        method: 'POST',
        body: formData,
      });
      setMensaje({ texto: '¡Característica creada con éxito!', tipo: 'exito' });
    } catch {
      setMensaje({ texto: 'Error al crear característica.', tipo: 'error' });
    } finally {
      setNuevaCaracteristica('');
      setImagenCaracteristica(null);
      setImagenPreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      cargarCaracteristicas();
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
      setIsSubmittingCreate(false);
    }
  };

  const eliminarCaracteristica = async (id) => {
    const confirmado = window.confirm('¿Seguro que deseas eliminar esta característica?');
    if (!confirmado) return;
    setIsDeletingId(id);
    try {
      await apiFetch(`/api/caracteristicas/${id}`, { method: 'DELETE' });
      setMensaje({ texto: 'Característica eliminada.', tipo: 'exito' });
    } catch {
      setMensaje({ texto: 'Error al eliminar característica.', tipo: 'error' });
    } finally {
      setIsDeletingId(null);
      cargarCaracteristicas();
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    }
  };


  const editarCaracteristica = async (id, nombre) => {
    setIsEditingId(id);
    try {
      await apiFetch(`/api/caracteristicas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre }),
      });
      setMensaje({ texto: '¡Característica actualizada!', tipo: 'exito' });
      setEditando(null);
      setEditNombre('');
      cargarCaracteristicas();
    } catch {
      setMensaje({ texto: 'Error al editar característica.', tipo: 'error' });
    } finally {
      setIsEditingId(null);
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    }
  };

  const asociarCaracteristica = async () => {
    if (!productoId || !caracteristicaId) return;
    setIsAssociating(true);
    try {
      await apiFetch(`/api/productos/${Number(productoId)}/caracteristicas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(caracteristicaId) }),
      });
      setMensaje({ texto: '¡Asociada con éxito!', tipo: 'exito' });
    } catch {
      setMensaje({ texto: 'Error al asociar característica.', tipo: 'error' });
    } finally {
      setProductoId('');
      setCaracteristicaId('');
      cargarProductos();
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
      setIsAssociating(false);
    }
  };

  useEffect(() => {
    if (!imagenCaracteristica) {
      setImagenPreview('');
      return;
    }
    const objectUrl = URL.createObjectURL(imagenCaracteristica);
    setImagenPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imagenCaracteristica]);

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
      {mensaje.texto && (
        <div className={`${styles.notificacion} ${styles[mensaje.tipo]}`} aria-live="polite" role="status">
          {mensaje.texto}
        </div>
      )}

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
            ref={fileInputRef}
            onChange={e => setImagenCaracteristica(e.target.files[0] || null)}
            style={{ display: 'none' }}
          />
        </label>
        {imagenPreview && (
          <img src={imagenPreview} alt="Previsualización" className={styles.thumbnail} />
        )}

        <button type="button" className={styles.botonAgregar} onClick={crearCaracteristica} disabled={isSubmittingCreate}>
          {isSubmittingCreate ? 'Agregando…' : 'Agregar'}
        </button>
      </div>

      <ul className={styles.listaCaracteristicas}>
        {isLoadingCaract && <li className={styles.caracteristicaItem}>Cargando características…</li>}
        {!isLoadingCaract && caracteristicas.length === 0 && (
          <li className={styles.caracteristicaItem}>No hay características</li>
        )}
        {!isLoadingCaract && caracteristicas.map(c => (
          <li key={c.id} className={styles.caracteristicaItem}>
            {editando === c.id ? (
              <>
                <input
                  className={styles.inputEditar}
                  value={editNombre}
                  onChange={e => setEditNombre(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') editarCaracteristica(c.id, editNombre.trim());
                    if (e.key === 'Escape') { setEditando(null); setEditNombre(''); }
                  }}
                  autoFocus
                />
                <div className={styles.botones}>
                  <button
                    type="button"
                    className={styles.botonEditar}
                    onClick={() => editarCaracteristica(c.id, editNombre.trim())}
                    disabled={isEditingId === c.id || !editNombre.trim()}
                  >
                    {isEditingId === c.id ? 'Guardando…' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    className={styles.botonEliminar}
                    onClick={() => { setEditando(null); setEditNombre(''); }}
                    disabled={isEditingId === c.id}
                  >
                    Cancelar
                  </button>
                </div>
              </>
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
                  <button type="button" className={styles.botonEditar} onClick={() => { setEditando(c.id); setEditNombre(c.nombre); }}>Editar</button>
                  <button type="button" className={styles.botonEliminar} onClick={() => eliminarCaracteristica(c.id)} disabled={isDeletingId === c.id}>
                    {isDeletingId === c.id ? 'Eliminando…' : 'Eliminar'}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <h3 className={styles.title}>Asociar característica a producto</h3>

      <select className={styles.select} value={productoId} onChange={e => setProductoId(e.target.value)}>
        <option value="">-- Seleccionar producto --</option>
        {!isLoadingProd && productos.map(p => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>

      <select className={styles.select} value={caracteristicaId} onChange={e => setCaracteristicaId(e.target.value)}>
        <option value="">-- Seleccionar característica --</option>
        {!isLoadingCaract && caracteristicas.map(c => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>

      <button type="button" className={styles.botonAsociar} onClick={asociarCaracteristica} disabled={isAssociating || !productoId || !caracteristicaId}>
        {isAssociating ? 'Asociando…' : 'Asociar'}
      </button>

      <h3 className={styles.title}>Productos y sus características</h3>
      <ul className={styles.listaProductos}>
        {isLoadingProd && <li className={styles.productoItem}>Cargando productos…</li>}
        {!isLoadingProd && productos.length === 0 && (
          <li className={styles.productoItem}>No hay productos</li>
        )}
        {!isLoadingProd && productos.map(p => (
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
