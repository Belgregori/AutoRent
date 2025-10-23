import React, { useState } from 'react';
import { RoleSelector } from './RoleSelector';
import { PermissionManager } from './PermissionManager';

export const UserModal = ({ 
  isOpen, 
  onClose, 
  user, 
  onRoleChange, 
  onPermissionsChange,
  onSavePermissions,
  allPermissions = [],
  userPermissions = [],
  isLoadingPermissions = false,
  isSaving = false
}) => {
  const [activeTab, setActiveTab] = useState('roles');

  if (!isOpen || !user) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
            Gestionar Usuario: {user.nombre} {user.apellido}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <button
            onClick={() => setActiveTab('roles')}
            style={{
              flex: 1,
              padding: '16px 24px',
              border: 'none',
              backgroundColor: activeTab === 'roles' ? '#f3f4f6' : 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === 'roles' ? '600' : '400',
              color: activeTab === 'roles' ? '#1f2937' : '#6b7280',
              borderBottom: activeTab === 'roles' ? '2px solid #3b82f6' : '2px solid transparent'
            }}
          >
            Roles
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            style={{
              flex: 1,
              padding: '16px 24px',
              border: 'none',
              backgroundColor: activeTab === 'permissions' ? '#f3f4f6' : 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === 'permissions' ? '600' : '400',
              color: activeTab === 'permissions' ? '#1f2937' : '#6b7280',
              borderBottom: activeTab === 'permissions' ? '2px solid #3b82f6' : '2px solid transparent'
            }}
          >
            Permisos
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '24px',
          maxHeight: '60vh',
          overflow: 'auto'
        }}>
          {activeTab === 'roles' && (
            <RoleSelector
              user={user}
              onRoleChange={onRoleChange}
            />
          )}
          
          {activeTab === 'permissions' && (
            <div>
              {isLoadingPermissions ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#6b7280',
                  fontSize: '16px'
                }}>
                  <div style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    border: '2px solid #e5e7eb',
                    borderTop: '2px solid #3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '12px'
                  }}></div>
                  Cargando permisos del usuario...
                </div>
              ) : (
                <PermissionManager
                  user={user}
                  allPermissions={allPermissions}
                  userPermissions={userPermissions}
                  onPermissionsChange={onPermissionsChange}
                  isLoadingPermissions={isLoadingPermissions}
                  isSaving={isSaving}
                />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              color: '#374151',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cerrar
          </button>
          {activeTab === 'permissions' && (
            <button
              onClick={() => {
                console.log('Botón Aceptar clickeado');
                onSavePermissions();
              }}
              disabled={isSaving}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: isSaving ? '#9ca3af' : '#10b981',
                color: 'white',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {isSaving ? 'Guardando...' : 'Aceptar'}
            </button>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
