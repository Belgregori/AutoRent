import React, { useEffect, useState, useCallback } from 'react';

// Si querés usar módulo CSS parecido a los otros, podés crear administrarPermisos.module.css
// import styles from './administrarPermisos.module.css';

export const AdministrarPermisos = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({}); // { [userId]: bool }
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [error, setError] = useState('');

  // Reutilizo tu apiFetch (idéntico al de AdministrarCaracteristicas)
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
        errorMessage = asJson?.message || asJson?.error || asJson?.mensaje || '';
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

  const parseJwt = (token) => {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decoded;
    } catch {
      return null;
    }
  };

  // Email del admin actual (para evitar auto-quitar ADMIN)
  const tokenPayload = parseJwt(localStorage.getItem('token'));
  const currentEmail = tokenPayload?.sub || tokenPayload?.email || tokenPayload?.username || null;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiFetch('/api/admin/users', { headers: { 'Content-Type': 'application/json' } });
      // Esperamos data = [{id, nombre, apellido, email, roles: []}, ...]
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios');
      setMensaje({ texto: 'Error al cargar usuarios', tipo: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const grantAdmin = async (user) => {
    if (!window.confirm(`¿Querés dar rol ADMIN a ${user.nombre} (${user.email})?`)) return;
    setActionLoading(prev => ({ ...prev, [user.id]: true }));
    try {
      await apiFetch(`/api/admin/users/${user.id}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'ADMIN' }),
      });
      setMensaje({ texto: `ADMIN otorgado a ${user.nombre}`, tipo: 'exito' });
      await fetchUsers();
    } catch (err) {
      setMensaje({ texto: `Error: ${err.message}`, tipo: 'error' });
    } finally {
      setActionLoading(prev => ({ ...prev, [user.id]: false }));
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3500);
    }
  };

  const revokeAdmin = async (user) => {
    // prevenimos que el admin se quite a sí mismo en frontend
    if (currentEmail && user.email && currentEmail.toLowerCase() === user.email.toLowerCase()) {
      alert('No podés quitarte tu propio rol ADMIN desde aquí.');
      return;
    }
    if (!window.confirm(`¿Querés quitar rol ADMIN a ${user.nombre} (${user.email})?`)) return;
    setActionLoading(prev => ({ ...prev, [user.id]: true }));
    try {
      await apiFetch(`/api/admin/users/${user.id}/roles/ADMIN`, {
        method: 'DELETE'
      });
      setMensaje({ texto: `ADMIN removido de ${user.nombre}`, tipo: 'exito' });
      await fetchUsers();
    } catch (err) {
      setMensaje({ texto: `Error: ${err.message}`, tipo: 'error' });
    } finally {
      setActionLoading(prev => ({ ...prev, [user.id]: false }));
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3500);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Administrar permisos</h2>

      {mensaje.texto && (
        <div style={{
          marginBottom: 12,
          padding: 10,
          borderRadius: 8,
          background: mensaje.tipo === 'exito' ? '#ecfdf5' : '#fff1f2',
          color: mensaje.tipo === 'exito' ? '#065f46' : '#7f1d1d'
        }}>
          {mensaje.texto}
        </div>
      )}

      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

      {isLoading ? (
        <p>Cargando usuarios…</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: 8 }}>ID</th>
              <th style={{ padding: 8 }}>Nombre</th>
              <th style={{ padding: 8 }}>Apellido</th>
              <th style={{ padding: 8 }}>Email</th>
              <th style={{ padding: 8 }}>Roles</th>
              <th style={{ padding: 8 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const hasAdmin = Array.isArray(u.roles) ? u.roles.map(r => r.toUpperCase()).includes('ADMIN') : (u.roles && u.roles.has && u.roles.has('ADMIN'));
              const self = currentEmail && u.email && currentEmail.toLowerCase() === u.email.toLowerCase();
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: 8 }}>{u.id}</td>
                  <td style={{ padding: 8 }}>{u.nombre}</td>
                  <td style={{ padding: 8 }}>{u.apellido}</td>
                  <td style={{ padding: 8 }}>{u.email}</td>
                  <td style={{ padding: 8 }}>{Array.isArray(u.roles) ? u.roles.join(', ') : (u.roles ? Array.from(u.roles).join(', ') : '')}</td>
                  <td style={{ padding: 8 }}>
                    {hasAdmin ? (
                      <button
                        onClick={() => revokeAdmin(u)}
                        disabled={actionLoading[u.id] || self}
                        style={{ marginRight: 8, padding: '6px 10px', background: self ? '#f3f4f6' : '#ef4444', color: 'white', border: 'none', borderRadius: 6, cursor: actionLoading[u.id] || self ? 'not-allowed' : 'pointer' }}
                        title={self ? 'No podés quitarte tu propio ADMIN' : 'Quitar ADMIN'}
                      >
                        {actionLoading[u.id] ? 'Procesando…' : 'Quitar ADMIN'}
                      </button>
                    ) : (
                      <button
                        onClick={() => grantAdmin(u)}
                        disabled={actionLoading[u.id]}
                        style={{ marginRight: 8, padding: '6px 10px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: 6, cursor: actionLoading[u.id] ? 'not-allowed' : 'pointer' }}
                      >
                        {actionLoading[u.id] ? 'Procesando…' : 'Dar ADMIN'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 12 }}>No hay usuarios registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};


