import { render, screen } from '@testing-library/react';
import { createUser } from '../../setupTests.js';
import { WhatsAppButton } from './WhatsAppButton.jsx';

beforeEach(() => {
  window.open = jest.fn();
});

test('abre panel y envía WhatsApp', async () => {
  const user = await createUser();
  render(<WhatsAppButton />);
  await user.click(screen.getByRole('button', { name: /Contactar por WhatsApp/i }));
  await user.click(screen.getByRole('button', { name: /Enviar por WhatsApp/i }));
  expect(window.open).toHaveBeenCalled();
});

