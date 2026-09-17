import request from 'supertest';
import app from '../../app';
import { submitPublicIntake } from '../../domains/client';

jest.mock('../../domains/client');

const payload = {
  firstName: 'María',
  lastName: 'Quispe',
  sex: 'female',
  dateOfBirth: '1994-04-12',
  phoneNumber: '71234567',
  address: 'Calle 21 #23',
  deliveryZone: 'Centro',
  preferredStartDate: '2026-09-21',
  weight: 61.5,
  height: 164,
  website: '',
};

describe('POST /api/public/client-intakes', () => {
  it('creates a public draft without requiring authentication', async () => {
    (submitPublicIntake as jest.Mock).mockResolvedValue({ id: 1 });

    const res = await request(app).post('/api/public/client-intakes').send(payload);

    expect(res.status).toBe(201);
    expect(submitPublicIntake).toHaveBeenCalledWith(expect.objectContaining(payload));
  });

  it('rejects malformed public intake data', async () => {
    const res = await request(app)
      .post('/api/public/client-intakes')
      .send({ ...payload, weight: 0 });

    expect(res.status).toBe(400);
    expect(submitPublicIntake).not.toHaveBeenCalled();
  });
});
