import React, { useState, useEffect } from 'react';

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
    <div>
      <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
        Gestionar Permisos
      </h3>

      {/* Controles de búsqueda y filtro */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
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
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          Cargando permisos...
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '12px',
          marginBottom: '20px',
          maxHeight: '300px',
          overflow: 'auto'
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
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => handlePermissionChange(permission, !isSelected)}
                onMouseOver={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.backgroundColor = '#f8fafc';
                }}
                onMouseOut={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = '#ffffff';
                }}
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
        <div style={{ 
          textAlign: 'center', 
          color: '#6b7280', 
          fontStyle: 'italic',
          padding: '40px'
        }}>
          No se encontraron permisos que coincidan con los filtros aplicados.
        </div>
      )}

      {/* Resumen de permisos seleccionados */}
      {selectedPermissions.length > 0 && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#ecfdf5',
          borderRadius: '6px',
          border: '1px solid #d1fae5'
        }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#065f46' }}>
            Permisos seleccionados: {selectedPermissions.length}
          </p>
          <div style={{ fontSize: '12px', color: '#047857' }}>
            {selectedPermissions.slice(0, 3).join(', ')}
            {selectedPermissions.length > 3 && ` y ${selectedPermissions.length - 3} más...`}
          </div>
        </div>
      )}
    </div>
  );
};
