import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Main } from './Main.jsx';

test('renderiza sección principal y buscador', () => {
  render(
    <MemoryRouter>
      <Main />
    </MemoryRouter>
  );
  expect(screen.getByRole('main')).toBeTruthy();
  expect(screen.getByLabelText(/Buscar vehículo/i)).toBeTruthy();
});

