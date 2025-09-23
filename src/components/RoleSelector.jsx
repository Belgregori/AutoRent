import React from 'react';

export const RoleSelector = ({ user, onRoleChange }) => {
  const handleRoleChange = (newRole) => {
    onRoleChange(user.id, newRole);
  };

  return (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
        Asignar Rol
      </h3>
      
      <div style={{ marginBottom: '16px' }}>
        <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px' }}>
          Rol actual: <span style={{ fontWeight: '600', color: '#1f2937' }}>{user.role || 'No asignado'}</span>
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleRoleChange('ADMIN')}
          style={{
            padding: '12px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s',
            minWidth: '120px'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          Asignar ADMIN
        </button>

        <button
          onClick={() => handleRoleChange('USER')}
          style={{
            padding: '12px 20px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s',
            minWidth: '120px'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
        >
          Asignar USER
        </button>
      </div>

      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#f3f4f6',
        borderRadius: '6px',
        fontSize: '13px',
        color: '#6b7280'
      }}>
        <strong>Información:</strong>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
          <li><strong>ADMIN:</strong> Acceso completo al sistema administrativo</li>
          <li><strong>USER:</strong> Acceso según permisos específicos asignados</li>
        </ul>
      </div>
    </div>
  );
};
