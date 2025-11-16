import React from 'react';
import styles from './RoleSelector.module.css';

export const RoleSelector = ({ user, onRoleChange }) => {
  const handleRoleChange = (newRole) => {
    onRoleChange(user.id, newRole);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        Asignar Rol
      </h3>
      
      <div className={styles.currentRole}>
        <p className={styles.currentRoleText}>
          Rol actual: <span className={styles.currentRoleValue}>{user.role || 'No asignado'}</span>
        </p>
      </div>

      <div className={styles.buttons}>
        <button
          onClick={() => handleRoleChange('ADMIN')}
          className={`${styles.roleButton} ${styles.roleButtonAdmin}`}
        >
          Asignar ADMIN
        </button>

        <button
          onClick={() => handleRoleChange('USER')}
          className={`${styles.roleButton} ${styles.roleButtonUser}`}
        >
          Asignar USER
        </button>
      </div>

      <div className={styles.infoBox}>
        <strong>Información:</strong>
        <ul>
          <li><strong>ADMIN:</strong> Acceso completo al sistema administrativo</li>
          <li><strong>USER:</strong> Acceso según permisos específicos asignados</li>
        </ul>
      </div>
    </div>
  );
};
