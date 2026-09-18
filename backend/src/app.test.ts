import request from 'supertest';
import app from './app';

jest.mock('./database/sequelize', () => ({ __esModule: true, default: { query: jest.fn() } }));

describe('GET /api/health', () => {
  it('requires authentication', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(401);
  });
});

describe('CORS', () => {
  const originalStaffOrigin = process.env.CORS_STAFF_ORIGIN;
  const originalPublicOrigin = process.env.CORS_PUBLIC_ORIGIN;

  beforeEach(() => {
    process.env.CORS_STAFF_ORIGIN = 'https://staff.laoliva.example';
    process.env.CORS_PUBLIC_ORIGIN = 'https://registro.laoliva.example';
  });

  afterAll(() => {
    process.env.CORS_STAFF_ORIGIN = originalStaffOrigin;
    process.env.CORS_PUBLIC_ORIGIN = originalPublicOrigin;
  });

  it('allows requests from the local frontend', async () => {
    const res = await request(app)
      .options('/api/health')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Method', 'GET');

    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });

  it.each(['https://staff.laoliva.example', 'https://registro.laoliva.example'])(
    'allows requests from configured production origin %s',
    async (origin) => {
      const res = await request(app)
        .options('/api/health')
        .set('Origin', origin)
        .set('Access-Control-Request-Method', 'GET');

      expect(res.headers['access-control-allow-origin']).toBe(origin);
    },
  );

  it('allows requests from staff vercel preview deployments', async () => {
    const previewOrigin =
      'https://la-oliva-frontend-9pfvrvpti-fernando-daleney-s-projects.vercel.app';

    const res = await request(app)
      .options('/api/health')
      .set('Origin', previewOrigin)
      .set('Access-Control-Request-Method', 'GET');

    expect(res.headers['access-control-allow-origin']).toBe(previewOrigin);
  });

  it('allows requests from public vercel preview deployments', async () => {
    const previewOrigin =
      'https://la-oliva-registro-9pfvrvpti-fernando-daleney-s-projects.vercel.app';

    const res = await request(app)
      .options('/api/health')
      .set('Origin', previewOrigin)
      .set('Access-Control-Request-Method', 'GET');

    expect(res.headers['access-control-allow-origin']).toBe(previewOrigin);
  });

  it('allows requests from staff vercel git branch alias deployments', async () => {
    const branchOrigin =
      'https://la-oliva-frontend-git-fix-ve-badeeb-fernando-daleney-s-projects.vercel.app';

    const res = await request(app)
      .options('/api/health')
      .set('Origin', branchOrigin)
      .set('Access-Control-Request-Method', 'GET');

    expect(res.headers['access-control-allow-origin']).toBe(branchOrigin);
  });

  it('allows requests from public vercel git branch alias deployments', async () => {
    const branchOrigin =
      'https://la-oliva-registro-git-fix-ve-badeeb-fernando-daleney-s-projects.vercel.app';

    const res = await request(app)
      .options('/api/health')
      .set('Origin', branchOrigin)
      .set('Access-Control-Request-Method', 'GET');

    expect(res.headers['access-control-allow-origin']).toBe(branchOrigin);
  });

  it('rejects requests from unrelated origins', async () => {
    const res = await request(app)
      .options('/api/health')
      .set('Origin', 'https://evil.example.com')
      .set('Access-Control-Request-Method', 'GET');

    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('rejects lookalike domains that embed the preview hostname', async () => {
    const res = await request(app)
      .options('/api/health')
      .set(
        'Origin',
        'https://la-oliva-frontend-9pfvrvpti-fernando-daleney-s-projects.vercel.app.evil.com',
      )
      .set('Access-Control-Request-Method', 'GET');

    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('rejects arbitrary vercel preview origins', async () => {
    const res = await request(app)
      .options('/api/health')
      .set('Origin', 'https://unrelated-project-abc123.vercel.app')
      .set('Access-Control-Request-Method', 'GET');

    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});
