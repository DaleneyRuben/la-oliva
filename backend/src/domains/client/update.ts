import { Transaction } from 'sequelize';
import Client from '../../models/Client';
import { withTransaction } from '../../database/with-transaction';
import { UpdateClientDto } from '../../schemas/client.schema';
import type { Actor } from '../../types/actor';
import { appToday } from '../../utils/date';
import { pause, resume } from '../subscription';
import {
  withStatus,
  getCurrentSubscription,
  INCLUDE_SUBSCRIPTION_ORDERED,
  resolveDeliveryShift,
} from './_helpers';

type SubLike = {
  id: number;
  paid?: boolean;
  startDate: string | null;
  contractEndDate?: string | null;
  finalizedAt?: string | null;
  pausedSince?: Date | null;
};

type ClientFields = Omit<UpdateClientDto, 'pausedSince'>;

// The shift is only re-resolved when the edit touches delivery, so an unrelated edit never
// rewrites it.
const withResolvedShift = (client: Client, fields: ClientFields): ClientFields => {
  if (fields.delivery === undefined && fields.deliveryShift === undefined) return fields;
  const delivery = fields.delivery ?? client.delivery;
  const shift = fields.deliveryShift !== undefined ? fields.deliveryShift : client.deliveryShift;
  return { ...fields, deliveryShift: resolveDeliveryShift(delivery, shift) };
};

export const update = async (
  id: number,
  data: UpdateClientDto,
  actor: Actor,
  transaction?: Transaction,
) => {
  const client = await Client.findByPk(id, { include: INCLUDE_SUBSCRIPTION_ORDERED });
  if (!client) return null;

  // The API still speaks of pausing "the client", but a pause belongs to a plan. This domain
  // resolves which plan the request means; the subscription domain owns the pause itself.
  const { pausedSince, ...clientFields } = data;
  const previousShift = client.deliveryShift;

  const updated = await withTransaction(transaction, async (t) => {
    let pauseChanged = false;

    if (pausedSince !== undefined) {
      const subs = (client as never as { subscriptions: SubLike[] }).subscriptions ?? [];
      const sub = getCurrentSubscription(subs, appToday());

      if (sub) {
        if (pausedSince !== null && !sub.pausedSince) {
          await pause(sub.id, actor, t);
          pauseChanged = true;
        }
        if (pausedSince === null && sub.pausedSince) {
          await resume(sub.id, actor, t);
          pauseChanged = true;
        }
      }
    }

    const fields = withResolvedShift(client, clientFields);
    const saved = await client.update(fields, { transaction: t });

    // Everyone in a group shares one shift, since a group is one stop.
    if (client.groupToken && 'deliveryShift' in fields && fields.deliveryShift !== previousShift) {
      await Client.update(
        { deliveryShift: fields.deliveryShift },
        { where: { groupToken: client.groupToken }, transaction: t },
      );
    }

    // The pause was written to a different row than the one held in memory here, so the
    // subscriptions loaded above are stale and would report the status from before the change.
    if (!pauseChanged) return saved;
    return (
      (await Client.findByPk(id, { include: INCLUDE_SUBSCRIPTION_ORDERED, transaction: t })) ??
      saved
    );
  });

  return withStatus(updated);
};
