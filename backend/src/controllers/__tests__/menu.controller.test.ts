import request from 'supertest';
import app from '../../app';
import { findAll, findByDate, upsertWeek } from '../../domains/menu';

jest.mock('../../domains/menu');
jest.mock('../../database/sequelize', () => ({ __esModule: true, default: { query: jest.fn() } }));
jest.mock('../../middleware/auth', () => ({
  requireAuth: (_req: unknown, _res: unknown, next: () => void) => next(),
  requireRole: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

const mockMenu = {
  id: 1,
  date: '2026-06-05',
  breakfast: 'Queque de platano',
  morningSnack: null,
  salad: null,
  lunch: null,
  afternoonSnack: null,
  dinner: null,
  juice: null,
};

beforeEach(() => jest.clearAllMocks());

describe('GET /api/menus', () => {
  it('returns 200 with all menus', async () => {
    (findAll as jest.Mock).mockResolvedValue([mockMenu]);

    const res = await request(app).get('/api/menus');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]).toMatchObject({ date: '2026-06-05' });
  });

  it('returns 500 when service throws', async () => {
    (findAll as jest.Mock).mockRejectedValue(new Error('db error'));

    const res = await request(app).get('/api/menus');

    expect(res.status).toBe(500);
  });
});

describe('GET /api/menus/:date', () => {
  it('returns 200 with menu when found', async () => {
    (findByDate as jest.Mock).mockResolvedValue(mockMenu);

    const res = await request(app).get('/api/menus/2026-06-05');

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ date: '2026-06-05' });
  });

  it('returns 404 when menu not found', async () => {
    (findByDate as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get('/api/menus/2026-06-05');

    expect(res.status).toBe(404);
  });
});

describe('PUT /api/menus/week', () => {
  const validPayload = {
    menus: [
      { date: '2026-06-05', breakfast: 'Queque de platano', salad: null },
      { date: '2026-06-08', lunch: 'Pollo' },
    ],
  };

  it('returns 200 with the saved menus', async () => {
    (upsertWeek as jest.Mock).mockResolvedValue([mockMenu]);

    const res = await request(app).put('/api/menus/week').send(validPayload);

    expect(res.status).toBe(200);
    expect(upsertWeek).toHaveBeenCalledWith(validPayload.menus);
    expect(res.body.data[0]).toMatchObject({ date: '2026-06-05' });
  });

  it('returns 400 when no menus are sent', async () => {
    const res = await request(app).put('/api/menus/week').send({ menus: [] });

    expect(res.status).toBe(400);
  });

  it('returns 400 when a date format is invalid', async () => {
    const res = await request(app)
      .put('/api/menus/week')
      .send({ menus: [{ date: '06-06-2026', breakfast: 'Queque' }] });

    expect(res.status).toBe(400);
  });

  it('returns 400 when a date falls on a weekend', async () => {
    const res = await request(app)
      .put('/api/menus/week')
      .send({ menus: [{ date: '2026-06-06', breakfast: 'Queque' }] });

    expect(res.status).toBe(400);
  });

  it('returns 400 when the same date is sent twice', async () => {
    const res = await request(app)
      .put('/api/menus/week')
      .send({ menus: [{ date: '2026-06-05' }, { date: '2026-06-05' }] });

    expect(res.status).toBe(400);
  });

  it('answers with the status the domain signals', async () => {
    (upsertWeek as jest.Mock).mockRejectedValue(
      Object.assign(new Error('No puedes modificar el menú de un día que ya pasó.'), {
        statusCode: 400,
      }),
    );

    const res = await request(app).put('/api/menus/week').send(validPayload);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('No puedes modificar el menú de un día que ya pasó.');
  });

  it('returns 500 when service throws', async () => {
    (upsertWeek as jest.Mock).mockRejectedValue(new Error('db error'));

    const res = await request(app).put('/api/menus/week').send(validPayload);

    expect(res.status).toBe(500);
  });
});
