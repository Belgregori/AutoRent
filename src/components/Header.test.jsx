import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header.jsx';

test('muestra el logo y botones cuando no hay usuario', () => {
  localStorage.clear();
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
  expect(screen.getByAltText(/AutoRent logo/i)).toBeTruthy();
  expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeTruthy();
  expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeTruthy();
});

