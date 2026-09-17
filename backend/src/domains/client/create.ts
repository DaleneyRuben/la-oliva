import { Transaction } from 'sequelize';
import Client from '../../models/Client';
import { CreateClientDto } from '../../schemas/client.schema';
import { ConflictError } from '../../utils/errors';

export const DUPLICATE_PHONE_MESSAGE =
  'Este número de celular ya está registrado. Si necesitas ayuda, contáctanos.';

export const create = async (data: CreateClientDto, transaction?: Transaction) => {
  const existing = await Client.findOne({
    where: { phoneNumber: data.phoneNumber },
    ...(transaction ? { transaction } : {}),
  });
  if (existing) throw new ConflictError(DUPLICATE_PHONE_MESSAGE);

  return transaction ? Client.create(data as never, { transaction }) : Client.create(data as never);
};
