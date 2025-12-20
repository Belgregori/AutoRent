import { render, screen } from '@testing-library/react';
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

test('renderiza campos minimos', () => {
  openModal();
  expect(screen.getByLabelText(/Fecha de inicio/i)).toBeTruthy();
  expect(screen.getByLabelText(/Fecha de fin/i)).toBeTruthy();
  expect(screen.getByRole('button', { name: /confirmar reserva/i })).toBeTruthy();
});

test('muestra informacion del producto', () => {
  openModal();
  expect(screen.getByText('Auto')).toBeTruthy();
  expect(screen.getByText('$100.00 por día')).toBeTruthy();
});

