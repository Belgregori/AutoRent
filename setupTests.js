import 'whatwg-fetch';
import { server } from './src/test/msw/server.js';
import userEvent from '@testing-library/user-event';

// MSW lifecycle
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mocks globales de navegador utilizados por componentes
if (typeof window !== 'undefined') {
  // window.open mock
  if (!window.open) {
    window.open = () => null;
  }

  // Definir URL base para que fetch con rutas relativas funcione
  try {
    Object.defineProperty(window, 'location', {
      value: new URL('http://localhost/'),
      writable: false,
      configurable: true,
    });
  } catch (_) {
    // fallback si no se puede redefinir
    // eslint-disable-next-line no-self-assign
    window.location = window.location;
  }
}

// alert mock
if (!globalThis.alert) {
  globalThis.alert = () => {};
}

// Clipboard seguro (para tests que lo usen)
if (typeof navigator !== 'undefined' && !navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: () => Promise.resolve() },
    configurable: true,
  });
}

// Helper para user-event
export const createUser = () => userEvent.setup();

