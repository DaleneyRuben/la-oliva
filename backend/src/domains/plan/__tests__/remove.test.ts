import { Op } from 'sequelize';
import sequelize from '../../../database/sequelize';
import Plan from '../../../models/Plan';
import Subscription from '../../../models/Subscription';
import { appToday } from '../../../utils/date';
import { remove } from '../remove';

jest.mock('../../../models/Plan');
jest.mock('../../../models/Subscription');
jest.mock('../../../database/sequelize', () => ({
  __esModule: true,
  default: { query: jest.fn(), transaction: jest.fn() },
}));

const transaction = { LOCK: { UPDATE: 'UPDATE' } };

describe('remove', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (sequelize.transaction as jest.Mock).mockImplementation((work) => work(transaction));
    (Subscription.count as jest.Mock).mockResolvedValue(0);
  });

  it('soft-deletes a plan when it has no current or future subscriptions', async () => {
    const mockInstance = { destroy: jest.fn().mockResolvedValue(undefined) };
    (Plan.findByPk as jest.Mock).mockResolvedValue(mockInstance);

    const result = await remove(1);

    expect(Plan.findByPk).toHaveBeenCalledWith(1, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    expect(Subscription.count).toHaveBeenCalledWith({
      where: {
        planId: 1,
        finalizedAt: null,
        [Op.or]: [{ contractEndDate: null }, { contractEndDate: { [Op.gte]: appToday() } }],
      },
      transaction,
    });
    expect(mockInstance.destroy).toHaveBeenCalledWith({ transaction });
    expect(result).toBe(true);
  });

  it('rejects deletion when the plan has a current or future subscription', async () => {
    const mockInstance = { destroy: jest.fn().mockResolvedValue(undefined) };
    (Plan.findByPk as jest.Mock).mockResolvedValue(mockInstance);
    (Subscription.count as jest.Mock).mockResolvedValue(2);

    await expect(remove(1)).rejects.toMatchObject({
      statusCode: 409,
      message: 'No se puede eliminar este plan porque tiene 2 suscripciones actuales o futuras.',
    });
    expect(mockInstance.destroy).not.toHaveBeenCalled();
  });

  it('uses singular Spanish copy when one subscription blocks deletion', async () => {
    const mockInstance = { destroy: jest.fn().mockResolvedValue(undefined) };
    (Plan.findByPk as jest.Mock).mockResolvedValue(mockInstance);
    (Subscription.count as jest.Mock).mockResolvedValue(1);

    await expect(remove(1)).rejects.toMatchObject({
      statusCode: 409,
      message: 'No se puede eliminar este plan porque tiene 1 suscripción actual o futura.',
    });
  });

  it('returns false when plan not found', async () => {
    (Plan.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await remove(999);

    expect(result).toBe(false);
  });

  it('propagates db errors', async () => {
    const mockInstance = { destroy: jest.fn().mockRejectedValue(new Error('db error')) };
    (Plan.findByPk as jest.Mock).mockResolvedValue(mockInstance);

    await expect(remove(1)).rejects.toThrow('db error');
  });
});
