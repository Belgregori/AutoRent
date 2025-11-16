import React, { useState } from 'react';
import { RoleSelector } from './RoleSelector';
import { PermissionManager } from './PermissionManager';
import styles from './UserModal.module.css';

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
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>
            Gestionar Usuario: {user.nombre} {user.apellido}
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            onClick={() => setActiveTab('roles')}
            className={`${styles.tab} ${activeTab === 'roles' ? styles.tabActive : ''}`}
          >
            Roles
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`${styles.tab} ${activeTab === 'permissions' ? styles.tabActive : ''}`}
          >
            Permisos
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {activeTab === 'roles' && (
            <RoleSelector
              user={user}
              onRoleChange={onRoleChange}
            />
          )}
          
          {activeTab === 'permissions' && (
            <div>
              {isLoadingPermissions ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
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
        <div className={styles.footer}>
          <button
            onClick={onClose}
            className={`${styles.footerButton} ${styles.closeFooterButton}`}
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
              className={`${styles.footerButton} ${styles.saveFooterButton}`}
            >
              {isSaving ? 'Guardando...' : 'Aceptar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
