import { Op, Transaction } from 'sequelize';
import { planHasSubscriptionsMessage } from '../../constants/plan.constants';
import { withTransaction } from '../../database/with-transaction';
import Plan from '../../models/Plan';
import Subscription from '../../models/Subscription';
import { appToday } from '../../utils/date';
import { ConflictError } from '../../utils/errors';

export const remove = async (id: number, transaction?: Transaction): Promise<boolean> =>
  withTransaction(transaction, async (t) => {
    const plan = await Plan.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!plan) return false;

    const blockingSubscriptions = await Subscription.count({
      where: {
        planId: id,
        finalizedAt: null,
        [Op.or]: [{ contractEndDate: null }, { contractEndDate: { [Op.gte]: appToday() } }],
      },
      transaction: t,
    });
    if (blockingSubscriptions > 0) {
      throw new ConflictError(planHasSubscriptionsMessage(blockingSubscriptions));
    }

    await plan.destroy({ transaction: t });
    return true;
  });
