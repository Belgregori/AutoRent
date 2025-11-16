import React, { useState, useEffect } from 'react';
import styles from './PermissionManager.module.css';

export const PermissionManager = ({ 
  user, 
  allPermissions = [], 
  userPermissions = [], 
  onPermissionsChange,
  isLoadingPermissions = false,
  isSaving = false
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sincronizar permisos seleccionados cuando cambien los permisos del usuario
  useEffect(() => {
    setSelectedPermissions(userPermissions);
  }, [userPermissions]);

  // Filtrar permisos según búsqueda y categoría
  const filteredPermissions = allPermissions.filter(permission => {
    const matchesSearch = permission.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      permission.startsWith(selectedCategory.toUpperCase() + '_');
    return matchesSearch && matchesCategory;
  });

  // Manejar cambio en checkbox
  const handlePermissionChange = (permission, isChecked) => {
    const newPermissions = isChecked
      ? [...selectedPermissions, permission]
      : selectedPermissions.filter(p => p !== permission);
    
    setSelectedPermissions(newPermissions);
    onPermissionsChange(newPermissions);
  };

  // Obtener categorías disponibles
  const categories = [
    { value: 'all', label: 'Todas' },
    { value: 'products', label: 'Productos' },
    { value: 'categories', label: 'Categorías' },
    { value: 'features', label: 'Características' },
    { value: 'users', label: 'Usuarios' }
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        Gestionar Permisos
      </h3>

      {/* Controles de búsqueda y filtro */}
      <div className={styles.controls}>
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
        <div className={styles.loadingState}>
          Cargando permisos...
        </div>
      ) : (
        <div className={styles.permissionsGrid}>
          {filteredPermissions.map(permission => {
            const isSelected = selectedPermissions.includes(permission);
            
            return (
              <div 
                key={permission} 
                className={`${styles.permissionCard} ${isSelected ? styles.permissionCardSelected : ''}`}
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
        <div className={styles.emptyState}>
          No se encontraron permisos que coincidan con los filtros aplicados.
        </div>
      )}

      {/* Resumen de permisos seleccionados */}
      {selectedPermissions.length > 0 && (
        <div className={styles.summary}>
          <p className={styles.summaryTitle}>
            Permisos seleccionados: {selectedPermissions.length}
          </p>
          <div className={styles.summaryList}>
            {selectedPermissions.slice(0, 3).join(', ')}
            {selectedPermissions.length > 3 && ` y ${selectedPermissions.length - 3} más...`}
          </div>
        </div>
      )}
    </div>
  );
};
