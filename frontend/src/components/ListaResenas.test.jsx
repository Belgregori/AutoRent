import { render, screen } from '@testing-library/react';
import { ListaResenas } from './ListaResenas.jsx';

test('muestra mensaje cuando no hay reseñas', () => {
  render(<ListaResenas resenas={[]} />);
  expect(screen.getByText(/No hay reseñas/i)).toBeTruthy();
});

test('renderiza lista de reseñas', () => {
  const resenas = [
    { id: '1', puntuacion: 5, comentario: 'Excelente', fechaCreacion: new Date().toISOString() },
  ];
  render(<ListaResenas resenas={resenas} />);
  expect(screen.getByText(/Excelente/i)).toBeTruthy();
});

