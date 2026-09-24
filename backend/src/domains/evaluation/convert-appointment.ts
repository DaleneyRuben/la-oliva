import Appointment from '../../models/Appointment';
import sequelize from '../../database/sequelize';
import { CreateClientDto } from '../../schemas/client.schema';
import { CreateSubscriptionDto } from '../../schemas/subscription.schema';
import type { Actor } from '../../types/actor';
import { create as createClient } from '../client';
import { create as createSubscription } from '../subscription';

export const convertAppointment = (
  appointmentId: number,
  clientData: CreateClientDto,
  subscriptionData: CreateSubscriptionDto,
  actor: Actor,
) =>
  sequelize.transaction(async (transaction) => {
    // The row lock makes a concurrent second request wait for this one to commit, so it sees the
    // appointment already resolved instead of creating a second client.
    const appointment = await Appointment.findByPk(appointmentId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!appointment || appointment.subscriptionId) return null;

    const client = await createClient(clientData, transaction);
    const subscription = await createSubscription(
      client.id,
      { ...subscriptionData, appointmentId },
      actor,
      transaction,
    );
    if (!subscription) return null;

    await appointment.update({ subscriptionId: subscription.id }, { transaction });
    return { client, subscription };
  });
