import React, { useState, useEffect, useCallback } from 'react';
import { UserModal } from '../components/UserModal';

export const AdministrarPermisos = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [allPermissions, setAllPermissions] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Función para realizar peticiones a la API
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

  // Cargar lista de usuarios
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch('/api/admin/users', { headers: { 'Content-Type': 'application/json' } });
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setMensaje({ texto: `Error al cargar usuarios: ${err.message}`, tipo: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [apiFetch]);

  // Cargar permisos del usuario seleccionado
  const fetchUserPermissions = useCallback(async (userId) => {
    if (!userId) return;
    
    setIsLoadingPermissions(true);
    try {
      const permissions = await apiFetch(`/api/admin/users/${userId}/permissions`);
      const userPerms = Array.isArray(permissions) ? permissions : [];
      setUserPermissions(userPerms);
      setSelectedPermissions(userPerms);
    } catch (err) {
      setMensaje({ 
        texto: `Error al cargar permisos del usuario: ${err.message}`, 
        tipo: 'error' 
      });
    } finally {
      setIsLoadingPermissions(false);
    }
  }, [apiFetch]);

  // Cargar lista completa de permisos
  const loadAllPermissions = useCallback(async () => {
    try {
      const perms = await apiFetch('/api/admin/permissions', {
        headers: { 'Content-Type': 'application/json' }
      });
      setAllPermissions(Array.isArray(perms) ? perms : []);
    } catch (err) {
      setMensaje({ texto: `Error al cargar permisos: ${err.message}`, tipo: 'error' });
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchUsers();
    loadAllPermissions();
  }, [fetchUsers, loadAllPermissions]);

  // Cargar permisos cuando se selecciona un usuario
  useEffect(() => {
    if (selectedUserId) {
      fetchUserPermissions(selectedUserId);
    }
  }, [selectedUserId, fetchUserPermissions]);

  // Filtrar permisos según búsqueda y categoría
  const filteredPermissions = allPermissions.filter(permission => {
    const matchesSearch = permission.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      permission.startsWith(selectedCategory.toUpperCase() + '_');
    return matchesSearch && matchesCategory;
  });

  // Manejar cambio en checkbox
  const handlePermissionChange = (permission, isChecked) => {
    setSelectedPermissions(prev => {
      if (isChecked) {
        return [...prev, permission];
      } else {
        return prev.filter(p => p !== permission);
      }
    });
  };

  // Guardar cambios
  const handleSave = async () => {
    if (!selectedUserId) {
      setMensaje({ text: 'ID de usuario no válido', type: 'error' });
      return;
    }

    setIsSaving(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      await apiFetch(`/api/admin/users/${selectedUserId}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: selectedPermissions })
      });

      // Actualizar permisos del usuario
      setUserPermissions(selectedPermissions);
      setMensaje({ 
        texto: 'Permisos actualizados correctamente', 
        tipo: 'exito' 
      });

    } catch (error) {
      setMensaje({ 
        texto: `Error al guardar permisos: ${error.message}`, 
        tipo: 'error' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAssignRole = async (userId, role) => {
    try {
      await apiFetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      setMensaje({ texto: `Rol asignado: ${role}`, tipo: "exito" });
      // Actualizar la lista de usuarios
      fetchUsers();
    } catch (err) {
      setMensaje({ texto: `Error: ${err.message}`, tipo: "error" });
    }
  };

  // Funciones para el modal
  const openUserModal = async (user) => {
    setSelectedUser(user);
    setSelectedUserId(user.id);
    setIsModalOpen(true);
    // Cargar permisos del usuario inmediatamente
    await fetchUserPermissions(user.id);
  };

  const closeUserModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setSelectedUserId(null);
  };

  const handlePermissionsChange = (newPermissions) => {
    setSelectedPermissions(newPermissions);
  };

  // Función para guardar permisos desde el modal
  const handleSavePermissions = async () => {
    console.log('handleSavePermissions ejecutándose...');
    console.log('selectedUserId:', selectedUserId);
    console.log('selectedPermissions:', selectedPermissions);
    
    if (!selectedUserId) {
      setMensaje({ texto: 'ID de usuario no válido', tipo: 'error' });
      return;
    }

    setIsSaving(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      console.log('Enviando petición al backend...');
      const response = await apiFetch(`/api/admin/users/${selectedUserId}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: selectedPermissions })
      });
      
      console.log('Respuesta del backend:', response);

      // Actualizar permisos del usuario
      setUserPermissions(selectedPermissions);
      setMensaje({ 
        texto: 'Permisos actualizados correctamente', 
        tipo: 'exito' 
      });

    } catch (error) {
      console.error('Error en handleSavePermissions:', error);
      setMensaje({ 
        texto: `Error al guardar permisos: ${error.message}`, 
        tipo: 'error' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Obtener categorías disponibles
  const categories = [
    { value: 'all', label: 'Todas' },
    { value: 'products', label: 'Productos' },
    { value: 'categories', label: 'Categorías' },
    { value: 'features', label: 'Características' },
    { value: 'users', label: 'Usuarios' }
  ];

  if (isLoading) {
    return <div style={{ padding: 16 }}>Cargando usuarios...</div>;
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Administrar Permisos de Usuarios</h2>
      
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

      {/* Selector de usuario */}
      <div style={{ marginBottom: 24 }}>
        <label htmlFor="userSelect" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
          Selecciona un usuario para administrar sus permisos:
        </label>
        <select
          id="userSelect"
          value={selectedUserId || ''}
          onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
          style={{
            padding: '8px 12px',
            border: '2px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '14px',
            minWidth: '300px'
          }}
        >
          <option value="">-- Selecciona un usuario --</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.nombre} {user.apellido} ({user.email})
            </option>
          ))}
        </select>
      </div>

      {/* Lista de usuarios con botón de gestión */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Gestionar Usuarios:</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {users.filter(user => selectedUserId ? user.id === selectedUserId : true).map(user => (
            <div key={user.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              backgroundColor: '#f9fafb'
            }}>
              <div>
                <span style={{ fontWeight: '500', display: 'block' }}>
                  {user.nombre} {user.apellido}
                </span>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  {user.email}
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#6b7280',
                  display: 'block',
                  marginTop: '4px'
                }}>
                  Rol: {user.role || 'No asignado'}
                </span>
              </div>
              <div>
                <button
                  onClick={() => openUserModal(user)}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                >
                  Gestionar Usuario
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel de permisos */}
      {selectedUserId && (
        <div style={{ 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#f9fafb'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>
            Permisos para: {users.find(u => u.id === selectedUserId)?.nombre} {users.find(u => u.id === selectedUserId)?.apellido}
          </h3>

          {/* Controles de búsqueda y filtro */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Buscar permisos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '8px 12px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Lista de permisos */}
          {isLoadingPermissions ? (
            <p>Cargando permisos...</p>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '12px',
              marginBottom: '20px'
            }}>
              {filteredPermissions.map(permission => {
                const isSelected = selectedPermissions.includes(permission);
                
                return (
                  <div 
                    key={permission} 
                    style={{
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer'
                    }}
                    onClick={() => handlePermissionChange(permission, !isSelected)}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                        disabled={isSaving}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>{permission}</span>
                    </label>
                  </div>
                );
              })}
            </div>
          )}

          {filteredPermissions.length === 0 && !isLoadingPermissions && (
            <p style={{ textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>
              No se encontraron permisos que coincidan con los filtros aplicados.
            </p>
          )}

          {/* Botón de guardar */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                padding: '12px 24px',
                backgroundColor: isSaving ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                minWidth: '140px'
              }}
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      )}

      {/* Modal de gestión de usuario */}
      <UserModal
        isOpen={isModalOpen}
        onClose={closeUserModal}
        user={selectedUser}
        onRoleChange={handleAssignRole}
        onPermissionsChange={handlePermissionsChange}
        onSavePermissions={handleSavePermissions}
        allPermissions={allPermissions}
        userPermissions={userPermissions}
        isLoadingPermissions={isLoadingPermissions}
        isSaving={isSaving}
      />
    </div>
  );
};


