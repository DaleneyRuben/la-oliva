import Client from '../../models/Client';
import { withTransaction } from '../../database/with-transaction';
import { resolveDeliveryShift } from './_helpers';
import { create as createSubscription } from '../subscription';
import type { CreateClientDto } from '../../schemas/client.schema';
import type { CreateSubscriptionDto } from '../../schemas/subscription.schema';
import type { Actor } from '../../types/actor';

export const reviewDraft = (
  id: number,
  clientData: CreateClientDto,
  subscriptionData: CreateSubscriptionDto,
  actor: Actor,
) =>
  withTransaction(undefined, async (transaction) => {
    const draft = await Client.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!draft || !draft.isDraft) return null;

    const deliveryShift = resolveDeliveryShift(clientData.delivery, clientData.deliveryShift);
    const reviewed = await draft.update({ ...clientData, deliveryShift, isDraft: false } as never, {
      transaction,
    });
    await createSubscription(id, { ...subscriptionData, paid: true }, actor, transaction);
    return reviewed;
  });
