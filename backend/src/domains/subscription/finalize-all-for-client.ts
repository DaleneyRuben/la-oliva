import { Transaction } from 'sequelize';
import Subscription from '../../models/Subscription';
import { appToday } from '../../utils/date';

export const finalizeAllForClient = async (clientId: number, transaction?: Transaction) =>
  Subscription.update(
    { finalizedAt: appToday() },
    {
      where: { clientId, finalizedAt: null },
      ...(transaction ? { transaction } : {}),
    },
  );
