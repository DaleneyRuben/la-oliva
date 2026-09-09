import request from 'supertest';
import app from '../../app';
import { verifyToken } from '../../domains/auth';
import { findRoute } from '../../domains/delivery';
import { ROLES } from '../../constants/roles.constants';

jest.mock('../../domains/auth');
jest.mock('../../domains/delivery');

const mockVerifyToken = verifyToken as jest.Mock;

const headersForRole = (role: string) => {
  mockVerifyToken.mockReturnValue({ userId: 1, role });
  return { Authorization: 'Bearer test-token' };
};

beforeEach(() => {
  jest.clearAllMocks();
  (findRoute as jest.Mock).mockResolvedValue({});
});

describe('GET /api/delivery role guard', () => {
  it('allows audit', async () => {
    const res = await request(app).get('/api/delivery').set(headersForRole(ROLES.AUDIT));

    expect(res.status).toBe(200);
  });
});
