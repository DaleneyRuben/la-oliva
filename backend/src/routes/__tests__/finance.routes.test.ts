import request from 'supertest';
import app from '../../app';
import { verifyToken } from '../../domains/auth';
import { ROLES } from '../../constants/roles.constants';

jest.mock('../../domains/auth');
jest.mock('../../domains/finance');
jest.mock('../../database/sequelize', () => ({ __esModule: true, default: { query: jest.fn() } }));

const mockVerifyToken = verifyToken as jest.Mock;

const headersForRole = (role: string) => {
  mockVerifyToken.mockReturnValue({ userId: 1, role });
  return { Authorization: 'Bearer test-token' };
};

beforeEach(() => {
  jest.clearAllMocks();
});

const readRoutes = ['/api/finance', '/api/finance/categories'];

const writeRoutes = [
  { method: 'post', path: '/api/finance/categories' },
  { method: 'patch', path: '/api/finance/categories/abc' },
  { method: 'post', path: '/api/finance/expenses' },
  { method: 'patch', path: '/api/finance/expenses/abc' },
  { method: 'delete', path: '/api/finance/expenses/abc' },
  { method: 'delete', path: '/api/finance/payments/abc' },
] as const;

describe('finance read routes role guard', () => {
  it.each(readRoutes)('lets audit through on %s', async (path) => {
    const res = await request(app).get(path).set(headersForRole(ROLES.AUDIT));

    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });

  it.each(readRoutes)('rejects kitchen on %s with 403', async (path) => {
    const res = await request(app).get(path).set(headersForRole(ROLES.KITCHEN));

    expect(res.status).toBe(403);
  });
});

describe('finance write routes role guard', () => {
  it.each(writeRoutes)('rejects audit on $method $path with 403', async ({ method, path }) => {
    const res = await request(app)[method](path).set(headersForRole(ROLES.AUDIT)).send({});

    expect(res.status).toBe(403);
  });

  it.each(writeRoutes)('lets admin through on $method $path', async ({ method, path }) => {
    const res = await request(app)[method](path).set(headersForRole(ROLES.ADMIN)).send({});

    expect(res.status).not.toBe(403);
  });
});
