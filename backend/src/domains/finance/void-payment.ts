import { Op } from 'sequelize';
import Client from '../../models/Client';
import Payment from '../../models/Payment';
import type { Actor } from '../../types/actor';

export const voidPayment = async (id: number, actor: Actor): Promise<boolean> => {
  const payment = await Payment.findOne({
    where: { id, voidedAt: null },
    include: [
      {
        model: Client,
        required: true,
        paranoid: false,
        where: { deletedAt: { [Op.not]: null } },
      },
    ],
  });
  if (!payment) return false;

  await payment.update({
    voidedAt: new Date(),
    voidedBy: actor.userId,
    voidReason: 'Cliente creado por error',
  });
  return true;
};
