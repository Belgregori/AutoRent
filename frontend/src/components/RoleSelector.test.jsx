import { render, screen } from '@testing-library/react';
import { createUser } from '../../setupTests.js';
import { RoleSelector } from './RoleSelector.jsx';

test('permite asignar roles', async () => {
  const user = await createUser();
  const onRoleChange = jest.fn();
  render(<RoleSelector user={{ id: 1, role: 'USER' }} onRoleChange={onRoleChange} />);
  await user.click(screen.getByRole('button', { name: /Asignar ADMIN/i }));
  expect(onRoleChange).toHaveBeenCalled();
});

