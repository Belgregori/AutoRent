import { render, screen } from '@testing-library/react';
import { createUser } from '../../setupTests.js';
import { ModalCompartir } from './ModalCompartir.jsx';

const producto = { nombre: 'Auto', descripcion: 'Desc', precio: 10, imagenesUrls: [] };

beforeEach(() => {
  window.open = jest.fn();
  global.alert = jest.fn();
  if (!navigator.clipboard) {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
  } else {
    navigator.clipboard.writeText = jest.fn().mockResolvedValue(undefined);
  }
});

test('no renderiza cuando no está abierto', () => {
  const { container } = render(
    <ModalCompartir isOpen={false} producto={producto} onClose={() => {}} urlProducto="http://x" />
  );
  expect(container.firstChild).toBeNull();
});

test('WhatsApp abre ventana', async () => {
  const user = await createUser();
  render(<ModalCompartir isOpen producto={producto} onClose={() => {}} urlProducto="http://x" />);
  await user.click(screen.getByRole('button', { name: /WhatsApp/i }));
  expect(window.open).toHaveBeenCalled();
});

test('Copiar enlace usa clipboard', async () => {
  const user = await createUser();
  render(<ModalCompartir isOpen producto={producto} onClose={() => {}} urlProducto="http://x" />);
  await user.click(screen.getByRole('button', { name: /Copiar Enlace/i }));
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://x');
  expect(global.alert).toHaveBeenCalled();
});

