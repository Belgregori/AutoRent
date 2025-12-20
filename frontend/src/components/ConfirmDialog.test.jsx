import { render, screen } from '@testing-library/react';
import { ConfirmDialog } from './ConfirmDialog.jsx';
import { createUser } from '../../setupTests.js';

const baseProps = {
  isOpen: true,
  title: 'Confirmar',
  message: '¿Estás seguro?',
  onConfirm: jest.fn(),
  onCancel: jest.fn(),
};

test('renderiza con props mínimas', () => {
  render(<ConfirmDialog {...baseProps} />);
  expect(screen.getByRole('heading', { name: /confirmar/i })).toBeTruthy();
  expect(screen.getByText('¿Estás seguro?')).toBeTruthy();
});

test('dispara onConfirm y onCancel', async () => {
  const user = await createUser();
  const onConfirm = jest.fn();
  const onCancel = jest.fn();
  render(<ConfirmDialog {...baseProps} onConfirm={onConfirm} onCancel={onCancel} />);
  await user.click(screen.getByRole('button', { name: /confirmar/i }));
  expect(onConfirm).toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: /cancelar/i }));
  expect(onCancel).toHaveBeenCalled();
});

