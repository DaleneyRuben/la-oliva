import { Transaction } from 'sequelize';
import Client from '../../models/Client';
import { CreateClientDto } from '../../schemas/client.schema';
import { resolveDeliveryShift } from './_helpers';

export const create = (data: CreateClientDto, transaction?: Transaction) => {
  const row = { ...data, deliveryShift: resolveDeliveryShift(data.delivery, data.deliveryShift) };
  return transaction ? Client.create(row as never, { transaction }) : Client.create(row as never);
};
