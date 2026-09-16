import { Transaction } from 'sequelize';
import { withTransaction } from '../../database/with-transaction';
import Client from '../../models/Client';
import Plan from '../../models/Plan';
import Subscription from '../../models/Subscription';
import { CreateSubscriptionDto } from '../../schemas/subscription.schema';
import type { Actor } from '../../types/actor';
import { appToday, calcContractEndDate } from '../../utils/date';
import { ConflictError } from '../../utils/errors';
import { record } from '../client-history';
import { recordPayment } from '../finance';
import { finalizeOverlappingSubscriptions } from './finalize-overlapping';
import {
  applyRenewalPauseState,
  findInheritedInstructions,
  findUpcomingSubscription,
  historyEventTypeFor,
} from './_helpers';

// TODO: restore contractDate === today validation once backfilling of existing clients is complete
const createWithinTransaction = async (
  clientId: number,
  data: CreateSubscriptionDto,
  actor: Actor,
  transaction: Transaction,
) => {
  const client = await Client.findByPk(clientId, { transaction });
  if (!client) return null;

  const plan = await Plan.findByPk(data.planId, {
    transaction,
    lock: transaction.LOCK.KEY_SHARE,
  });
  if (!plan) throw new ConflictError('The selected plan is no longer available.');

  const today = appToday();
  const paid = data.paid ?? true;

  if (await findUpcomingSubscription(clientId, today)) {
    throw new ConflictError(
      'El cliente ya tiene una renovación registrada. Elimínala para registrar otra.',
    );
  }

  const contractEndDate = calcContractEndDate(data.startDate ?? null, data.duration);

  // While unpaid, this subscription "isn't real yet" (see ADR-004/005): side effects on
  // other state are deferred to markPaid so an abandoned unpaid renewal never has anything
  // else to undo.
  if (paid && data.startDate) {
    await finalizeOverlappingSubscriptions(clientId, data.startDate, undefined, transaction);
  }

  // A renewal or reactivation continues the same client's diet, so it inherits the instructions of
  // the contract it follows unless this request states its own. A brand-new client has none.
  const specialInstructions =
    data.specialInstructions ??
    (data.renewalType ? await findInheritedInstructions(clientId, transaction) : null);

  const subscriptionData = {
    planId: data.planId,
    startDate: data.startDate ?? null,
    contractDate: data.contractDate,
    price: data.price,
    duration: data.duration,
    contractEndDate,
    clientId,
    paid,
    renewalType: data.renewalType ?? null,
    appointmentId: data.appointmentId ?? null,
    ...(specialInstructions ? { specialInstructions } : {}),
  } as never;
  const subscription = await Subscription.create(subscriptionData, { transaction });

  const eventType = historyEventTypeFor(data.renewalType ?? null);

  // unpaid subscriptions of any kind defer their history write until an admin marks them paid
  if (paid) {
    await record(
      actor,
      {
        type: eventType,
        clientId,
        metadata: {
          planId: data.planId,
          planName: plan?.name ?? null,
          planPrice: plan?.price ?? null,
          startDate: data.startDate ?? null,
          duration: data.duration,
          contractEndDate,
          price: data.price,
          ...(data.appointmentId ? { appointmentId: data.appointmentId } : {}),
        },
      },
      transaction,
    );

    // The agreed total already stored on the row — never recomputed from the plan, whose price
    // may be edited later without touching what this client paid (ADR-008).
    await recordPayment(
      { clientId, subscriptionId: subscription.id, amount: data.price },
      actor,
      transaction,
    );
  }

  if (paid) {
    await applyRenewalPauseState(
      subscription,
      data.renewalType ?? null,
      data.startDate ?? null,
      transaction,
    );
  }

  return subscription;
};

export const create = (
  clientId: number,
  data: CreateSubscriptionDto,
  actor: Actor,
  transaction?: Transaction,
) => withTransaction(transaction, (t) => createWithinTransaction(clientId, data, actor, t));
