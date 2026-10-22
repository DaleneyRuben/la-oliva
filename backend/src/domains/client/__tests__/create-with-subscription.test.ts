import Client from '../../../models/Client';
import sequelize from '../../../database/sequelize';
import { create as createSubscription } from '../../subscription';
// The module is intentionally absent in this red TDD commit.
// eslint-disable-next-line import/extensions
import { createWithSubscription } from '../create-with-subscription';

jest.mock('../../../models/Client');
jest.mock('../../subscription');
jest.mock('../../../database/sequelize', () => ({
  __esModule: true,
  default: { transaction: jest.fn() },
}));

const transaction = { id: 'create-transaction' } as never;
const actor = { userId: 3, username: 'admin' };
const clientData = {
  name: 'Ana Pérez',
  sex: 'female',
  dateOfBirth: '1990-05-15',
  phoneNumber: '+59170000000',
  address: 'Calle 1',
  deliveryZone: 'Centro',
  delivery: 'La Oliva',
  weight: 60,
  height: 165,
  underlyingDiseases: [],
  restrictions: [],
  operations: [],
  medications: [],
};
const subscriptionData = {
  planId: 4,
  contractDate: '2026-09-23',
  startDate: '2026-09-24',
  duration: 20,
  price: 500,
};

describe('createWithSubscription', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (sequelize.transaction as jest.Mock).mockImplementation((work) => work(transaction));
  });

  it('creates the client and a paid first subscription in one transaction', async () => {
    (Client.create as jest.Mock).mockResolvedValue({ id: 12 });
    (createSubscription as jest.Mock).mockResolvedValue({ id: 30 });

    const result = await createWithSubscription(
      clientData as never,
      subscriptionData as never,
      actor,
    );

    expect(Client.create).toHaveBeenCalledWith(
      expect.objectContaining({ ...clientData, deliveryShift: 'day' }),
      { transaction },
    );
    expect(createSubscription).toHaveBeenCalledWith(
      12,
      { ...subscriptionData, paid: true },
      actor,
      transaction,
    );
    expect(result).toEqual({ id: 12 });
  });

  it('propagates a subscription failure so the transaction rolls the client back', async () => {
    (Client.create as jest.Mock).mockResolvedValue({ id: 12 });
    (createSubscription as jest.Mock).mockRejectedValue(new Error('plan unavailable'));

    await expect(
      createWithSubscription(clientData as never, subscriptionData as never, actor),
    ).rejects.toThrow('plan unavailable');
    expect(sequelize.transaction).toHaveBeenCalledTimes(1);
  });
});
