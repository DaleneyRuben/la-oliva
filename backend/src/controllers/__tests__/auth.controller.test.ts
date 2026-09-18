import request from 'supertest';
import app from '../../app';
import { checkLoginRateLimit, login, InvalidCredentialsError } from '../../domains/auth';

jest.mock('../../domains/auth');
jest.mock('../../database/sequelize', () => ({ __esModule: true, default: { query: jest.fn() } }));

const mockLogin = login as jest.Mock;
const mockCheckLoginRateLimit = checkLoginRateLimit as jest.Mock;

const loginResponse = {
  token: 'signed-token',
  user: { id: 1, username: 'ada', role: 'admin' },
};

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckLoginRateLimit.mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
  });

  it('returns token and user on valid credentials', async () => {
    mockLogin.mockResolvedValue(loginResponse);

    const res = await request(app)
      .post('/api/auth/login')
      .set('User-Agent', 'test-agent/1.0')
      .set('x-vercel-forwarded-for', '203.0.113.7')
      .send({ username: 'ada', password: 'secret123' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(loginResponse);
    expect(mockCheckLoginRateLimit).toHaveBeenCalledWith({
      username: 'ada',
      ip: '203.0.113.7',
    });
    expect(mockLogin).toHaveBeenCalledWith('ada', 'secret123', 'test-agent/1.0');
  });

  it('returns 400 when username is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({ password: 'secret123' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Usuario y contraseña son requeridos' });
    expect(mockCheckLoginRateLimit).not.toHaveBeenCalled();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('returns 429 without checking credentials when either limit is exhausted', async () => {
    mockCheckLoginRateLimit.mockResolvedValue({ allowed: false, retryAfterSeconds: 90 });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'ada', password: 'secret123' });

    expect(res.status).toBe(429);
    expect(res.headers['retry-after']).toBe('90');
    expect(res.body).toEqual({
      error: 'Demasiados intentos. Intenta nuevamente más tarde.',
    });
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('returns 400 when password is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'ada' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Usuario y contraseña son requeridos' });
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('returns 400 when body is empty', async () => {
    const res = await request(app).post('/api/auth/login').send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Usuario y contraseña son requeridos' });
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('returns 401 on invalid credentials', async () => {
    mockLogin.mockRejectedValue(new InvalidCredentialsError());

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'ada', password: 'wrong' });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Credenciales inválidas' });
  });

  it('forwards unexpected errors to error handler', async () => {
    mockLogin.mockRejectedValue(new Error('db connection failed'));

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'ada', password: 'secret123' });

    expect(res.status).toBe(500);
  });
});
