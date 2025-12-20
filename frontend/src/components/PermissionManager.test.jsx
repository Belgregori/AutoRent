import { render, screen } from '@testing-library/react';
import { PermissionManager } from './PermissionManager.jsx';

test('muestra título y controles', () => {
  render(
    <PermissionManager 
      user={{ id: 1 }} 
      allPermissions={["PRODUCTS_READ", "USERS_WRITE"]}
      userPermissions={["PRODUCTS_READ"]}
      onPermissionsChange={() => {}}
    />
  );
  expect(screen.getByText(/Gestionar Permisos/i)).toBeTruthy();
});

