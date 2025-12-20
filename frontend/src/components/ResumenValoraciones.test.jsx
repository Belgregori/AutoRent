import { render, screen } from '@testing-library/react';
import { ResumenValoraciones } from './ResumenValoraciones.jsx';

test('muestra mensaje sin valoraciones', () => {
  render(<ResumenValoraciones resumen={{ totalResenas: 0 }} />);
  expect(screen.getByText(/No hay valoraciones/i)).toBeTruthy();
});

test('muestra resumen cuando hay datos', () => {
  const resumen = { totalResenas: 10, puntuacionMedia: 4.5, puntuacion5: 6, puntuacion4: 3, puntuacion3: 1 };
  render(<ResumenValoraciones resumen={resumen} />);
  expect(screen.getByText(/4.5/)).toBeTruthy();
  expect(screen.getByText(/10/)).toBeTruthy();
});

