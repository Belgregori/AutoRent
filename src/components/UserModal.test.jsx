import { render, screen } from '@testing-library/react';
import { createUser } from '../../setupTests.js';
import { UserModal } from './UserModal.jsx';

const baseProps = {
  isOpen: true,
  onClose: jest.fn(),
  user: { id: 1, nombre: 'Juan', apellido: 'Pérez' },
  onRoleChange: jest.fn(),
  onPermissionsChange: jest.fn(),
  onSavePermissions: jest.fn(),
};

test('renderiza y permite cerrar', async () => {
  const user = await createUser();
  render(<UserModal {...baseProps} />);
  await user.click(screen.getByRole('button', { name: '×' }));
  expect(baseProps.onClose).toHaveBeenCalled();
});

