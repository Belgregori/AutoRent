import { render, screen, waitFor } from '@testing-library/react';
import { createUser } from '../../setupTests.js';
import { FormularioReserva } from './FormularioReserva.jsx';

const producto = { id: 1, nombre: 'Auto', precio: 100 };

function openModal(overrides = {}) {
  const props = {
    producto,
    isOpen: true,
    onClose: jest.fn(),
    onReservaExitosa: jest.fn(),
    ...overrides,
  };
  render(<FormularioReserva {...props} />);
  return props;
}

test('renderiza campos mínimos', () => {
  openModal();
  expect(screen.getByLabelText(/Fecha de inicio/i)).toBeTruthy();
  expect(screen.getByLabelText(/Fecha de fin/i)).toBeTruthy();
  expect(screen.getByRole('button', { name: /confirmar reserva/i })).toBeTruthy();
});

test('envía reserva con MSW y llama onReservaExitosa', async () => {
  const user = await createUser();
  localStorage.setItem('token', 'test');
  const props = openModal();

  const hoy = new Date();
  const mañana = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const toStr = (d) => d.toISOString().slice(0, 10);

  await user.type(screen.getByLabelText(/Fecha de inicio/i), toStr(hoy));
  await user.type(screen.getByLabelText(/Fecha de fin/i), toStr(mañana));
  await user.type(screen.getByLabelText(/Nombre completo/i), 'Juan Pérez');
  await user.type(screen.getByLabelText(/^Email/i), 'juan@example.com');
  await user.type(screen.getByLabelText(/Teléfono/i), '123456');

  await user.click(screen.getByRole('button', { name: /confirmar reserva/i }));

  await waitFor(() => {
    expect(props.onReservaExitosa).toHaveBeenCalledWith(expect.objectContaining({ id: 'r1' }));
  }, { timeout: 2000 });
});

