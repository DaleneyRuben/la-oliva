import { withTransaction } from '../../database/with-transaction';
import type { CreateClientDto } from '../../schemas/client.schema';
import type { CreateSubscriptionDto } from '../../schemas/subscription.schema';
import type { Actor } from '../../types/actor';
import { create as createSubscription } from '../subscription';
import { create } from './create';

// One transaction for both writes: a failed subscription must not leave a client behind, or the
// admin's retry creates a second one.
export const createWithSubscription = (
  clientData: CreateClientDto,
  subscriptionData: CreateSubscriptionDto,
  actor: Actor,
) =>
  withTransaction(undefined, async (transaction) => {
    const client = await create(clientData, transaction);
    await createSubscription(client.id, { ...subscriptionData, paid: true }, actor, transaction);
    return client;
  });
