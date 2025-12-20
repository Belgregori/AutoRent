import { rest } from 'msw';

export const handlers = [
  // Reservas
  rest.post('/api/reservas', (req, res, ctx) => {
    // Verificar que el token esté presente
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ error: 'No token provided' }));
    }
    return res(ctx.status(200), ctx.json({ id: 'r1' }));
  }),

  // Reseñas: verificar reservas del usuario
  rest.get('/api/reservas/usuario', (req, res, ctx) => {
    // Verificar que el token esté presente
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ error: 'No token provided' }));
    }
    return res(ctx.json([{ id: 'r1', producto: { id: 1 } }]));
  }),

  // Favoritos
  rest.get('/api/favoritos', (req, res, ctx) => {
    // Verificar que el token esté presente
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ error: 'No token provided' }));
    }
    return res(ctx.json([]));
  }),
  rest.post('/api/favoritos', (req, res, ctx) => {
    // Verificar que el token esté presente
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ error: 'No token provided' }));
    }
    return res(ctx.json({ ok: true }));
  }),
  rest.delete('/api/favoritos/:id', (req, res, ctx) => {
    // Verificar que el token esté presente
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ error: 'No token provided' }));
    }
    return res(ctx.json({ ok: true }));
  }),

  // Catálogo
  rest.get('/api/categorias', (req, res, ctx) => {
    return res(ctx.json([]));
  }),
  rest.get('/api/productos', (req, res, ctx) => {
    return res(ctx.json([]));
  }),
  rest.get('/api/productos/random', (req, res, ctx) => {
    return res(ctx.json([]));
  }),
  rest.get('/api/productos/disponibles', (req, res, ctx) => {
    return res(ctx.json([]));
  }),
];

