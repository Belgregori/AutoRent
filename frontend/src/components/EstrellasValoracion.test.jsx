import { render, screen } from '@testing-library/react';
import { EstrellasValoracion } from './EstrellasValoracion.jsx';
import { createUser } from '../../setupTests.js';

test('renderiza 5 estrellas y estado inicial', () => {
  render(<EstrellasValoracion puntuacion={3} onCambioPuntuacion={() => {}} />);
  const estrellas = screen.getAllByText('★');
  expect(estrellas.length).toBe(5);
});

test('permite cambiar la puntuación', async () => {
  const user = await createUser();
  const onCambioPuntuacion = jest.fn();
  render(<EstrellasValoracion puntuacion={2} onCambioPuntuacion={onCambioPuntuacion} />);
  const estrellas = screen.getAllByText('★');
  await user.click(estrellas[3]);
  expect(onCambioPuntuacion).toHaveBeenCalled();
});

