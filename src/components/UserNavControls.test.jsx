import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserNavControls } from './UserNavControls.jsx';

test('renderiza barra de navegación y botones', () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <UserNavControls />
    </MemoryRouter>
  );
  expect(screen.getByRole('navigation')).toBeTruthy();
  expect(screen.getByRole('button', { name: /Inicio/i })).toBeTruthy();
});

