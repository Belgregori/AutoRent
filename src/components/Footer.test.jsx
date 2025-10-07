import { render, screen } from '@testing-library/react';
import { Footer } from './Footer.jsx';

test('renderiza texto y copyright', () => {
  render(<Footer />);
  expect(screen.getAllByText(/AutoRent/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/Todos los derechos reservados/i)).toBeTruthy();
});

