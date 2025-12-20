import React, { useState, useEffect, useCallback } from 'react';
import { UserModal } from '../components/UserModal';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import styles from './administrarPermisos.module.css';
import { AdminDesktopOnly } from '../components/AdminDesktopOnly';

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
    return (
      <AdminDesktopOnly>
        <Header />
        <div className={styles.container}>Cargando usuarios...</div>
        <Footer />
      </AdminDesktopOnly>
    );
  }

  return (
    <AdminDesktopOnly>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.title}>Administrar Permisos de Usuarios</h2>
        
        {mensaje.texto && (
          <div className={`${styles.mensaje} ${mensaje.tipo === 'exito' ? styles.mensajeExito : styles.mensajeError}`}>
            {mensaje.texto}
          </div>
        )}

        {/* Selector de usuario */}
        <div className={styles.section}>
          <label htmlFor="userSelect" className={styles.label}>
            Selecciona un usuario para administrar sus permisos:
          </label>
          <select
            id="userSelect"
            value={selectedUserId || ''}
            onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
            className={styles.select}
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
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Gestionar Usuarios:</h3>
          <div className={styles.usersList}>
            {users.filter(user => selectedUserId ? user.id === selectedUserId : true).map(user => (
              <div key={user.id} className={styles.userCard}>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>
                    {user.nombre} {user.apellido}
                  </span>
                  <span className={styles.userEmail}>
                    {user.email}
                  </span>
                  <span className={styles.userRole}>
                    Rol: {user.role || 'No asignado'}
                  </span>
                </div>
                <div>
                  <button
                    onClick={() => openUserModal(user)}
                    className={styles.gestionarButton}
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
          <div className={styles.permissionsPanel}>
            <h3 className={styles.panelTitle}>
              Permisos para: {users.find(u => u.id === selectedUserId)?.nombre} {users.find(u => u.id === selectedUserId)?.apellido}
            </h3>

            {/* Controles de búsqueda y filtro */}
            <div className={styles.controlsRow}>
              <input
                type="text"
                placeholder="Buscar permisos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.categorySelect}
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
              <div className={styles.permissionsGrid}>
                {filteredPermissions.map(permission => {
                  const isSelected = selectedPermissions.includes(permission);
                  
                  return (
                    <div 
                      key={permission} 
                      className={styles.permissionCard}
                      onClick={() => handlePermissionChange(permission, !isSelected)}
                    >
                      <label className={styles.permissionLabel}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                          disabled={isSaving}
                          className={styles.permissionCheckbox}
                        />
                        <span className={styles.permissionText}>{permission}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            )}

            {filteredPermissions.length === 0 && !isLoadingPermissions && (
              <p className={styles.emptyState}>
                No se encontraron permisos que coincidan con los filtros aplicados.
              </p>
            )}

            {/* Botón de guardar */}
            <div className={styles.saveButtonContainer}>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={styles.saveButton}
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
      <Footer />
    </AdminDesktopOnly>
  );
};


