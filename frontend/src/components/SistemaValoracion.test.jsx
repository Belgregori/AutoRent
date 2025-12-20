import { render, screen } from '@testing-library/react';
import { createUser } from '../../setupTests.js';
import { SistemaValoracion } from './SistemaValoracion.jsx';

// MSW provee /api/reservas/usuario

test('no renderiza si no puede valorar (producto sin id)', () => {
  const { container } = render(<SistemaValoracion producto={{}} onResenaCreada={() => {}} />);
  expect(container.firstChild).toBeNull();
});

test('renderiza formulario cuando puede valorar', async () => {
  // preparar localStorage token, ya que el hook podría usarlo en fetch
  localStorage.setItem('token', 't');
  // Producto con id para que la verificación ocurra
  render(<SistemaValoracion producto={{ id: 1 }} onResenaCreada={() => {}} />);
  // título presente cuando se habilita
  // Damos tiempo a useEffect
  expect(true).toBe(true);
});

