import Client from '../../../models/Client';
import sequelize from '../../../database/sequelize';
import { create as createSubscription } from '../../subscription';
import { reviewDraft } from '../review-draft';

jest.mock('../../../models/Client');
jest.mock('../../subscription');
jest.mock('../../../database/sequelize', () => ({
  __esModule: true,
  default: { transaction: jest.fn() },
}));

const transaction = { id: 'review-transaction', LOCK: { UPDATE: 'UPDATE' } } as never;
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
  contractDate: '2026-09-16',
  startDate: '2026-09-17',
  duration: 20,
  price: 500,
};

describe('reviewDraft', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (sequelize.transaction as jest.Mock).mockImplementation((work) => work(transaction));
  });

  it('updates the draft and creates a paid subscription in one transaction', async () => {
    const draft = {
      id: 1,
      isDraft: true,
      update: jest.fn().mockResolvedValue({ id: 1, isDraft: false }),
    };
    (Client.findByPk as jest.Mock).mockResolvedValue(draft);
    (createSubscription as jest.Mock).mockResolvedValue({ id: 9 });

    const result = await reviewDraft(1, clientData as never, subscriptionData as never, actor);

    expect(draft.update).toHaveBeenCalledWith({ ...clientData, isDraft: false }, { transaction });
    expect(createSubscription).toHaveBeenCalledWith(
      1,
      { ...subscriptionData, paid: true },
      actor,
      transaction,
    );
    expect(result).toEqual({ id: 1, isDraft: false });
  });

  it('does not review a client that is not a draft', async () => {
    (Client.findByPk as jest.Mock).mockResolvedValue({ id: 1, isDraft: false });

    await expect(
      reviewDraft(1, clientData as never, subscriptionData as never, actor),
    ).resolves.toBeNull();
    expect(createSubscription).not.toHaveBeenCalled();
  });
});
