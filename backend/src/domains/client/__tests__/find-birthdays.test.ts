import Client from '../../../models/Client';
import { findBirthdays } from '../find-birthdays';

jest.mock('../../../models/Client');

jest.mock('../../../utils/date', () => ({
  ...jest.requireActual('../../../utils/date'),
  appToday: jest.fn(() => '2026-06-25'),
}));

describe('findBirthdays', () => {
  beforeEach(() => jest.clearAllMocks());

  it('maps id, name, dateOfBirth, and an active plan status for each client', async () => {
    (Client.findAll as jest.Mock).mockResolvedValue([
      {
        id: 1,
        name: 'Jorge Rengel',
        dateOfBirth: '1990-06-06',
        subscriptions: [{ id: 1, finalizedAt: null }],
      },
    ]);

    const result = await findBirthdays();

    expect(result).toEqual([
      {
        id: 1,
        name: 'Jorge Rengel',
        dateOfBirth: '1990-06-06',
        isToday: false,
        planStatus: 'active',
      },
    ]);
  });

  it('marks a finalized plan as finalized', async () => {
    (Client.findAll as jest.Mock).mockResolvedValue([
      {
        id: 1,
        name: 'Jorge Rengel',
        dateOfBirth: '1990-06-06',
        subscriptions: [{ id: 1, finalizedAt: '2026-06-20' }],
      },
    ]);

    const result = await findBirthdays();

    expect(result[0].planStatus).toBe('finalized');
  });

  it('marks an expired plan as finalized', async () => {
    (Client.findAll as jest.Mock).mockResolvedValue([
      {
        id: 1,
        name: 'Indira Mercado',
        dateOfBirth: '1990-06-06',
        subscriptions: [
          {
            id: 1,
            startDate: '2026-08-01',
            contractEndDate: '2026-06-24',
            finalizedAt: null,
            suspendedDates: [],
            pausedSince: null,
          },
        ],
      },
    ]);

    const result = await findBirthdays();

    expect(result[0].planStatus).toBe('finalized');
  });

  it('uses the latest plan when an older one was finalized', async () => {
    (Client.findAll as jest.Mock).mockResolvedValue([
      {
        id: 1,
        name: 'Jorge Rengel',
        dateOfBirth: '1990-06-06',
        subscriptions: [
          { id: 1, finalizedAt: '2026-06-20' },
          { id: 2, finalizedAt: null },
        ],
      },
    ]);

    const result = await findBirthdays();

    expect(result[0].planStatus).toBe('active');
  });

  it('marks isToday true when the month and day match today', async () => {
    (Client.findAll as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Pablo', dateOfBirth: '1999-06-25' },
    ]);

    const result = await findBirthdays();

    expect(result[0].isToday).toBe(true);
  });

  it('filters by the current month via EXTRACT', async () => {
    (Client.findAll as jest.Mock).mockResolvedValue([]);

    await findBirthdays();

    const call = (Client.findAll as jest.Mock).mock.calls[0][0];
    expect(call.where).toBeDefined();
  });
});
