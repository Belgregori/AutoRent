import { render, screen } from '@testing-library/react';
import { Notification } from './Notification.jsx';

test('renderiza y luego se puede cerrar', () => {
  const onClose = jest.fn();
  render(<Notification message="Hola" duration={0} onClose={onClose} />);
  expect(screen.getByText('Hola')).toBeTruthy();
});

