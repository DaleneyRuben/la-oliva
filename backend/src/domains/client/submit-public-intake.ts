import Client from '../../models/Client';
import type { PublicClientIntakeDto } from '../../schemas/public-intake.schema';
import { ConflictError } from '../../utils/errors';

const DUPLICATE_PHONE_MESSAGE =
  'Este número de celular ya está registrado. Si necesitas ayuda, contáctanos.';

export const submitPublicIntake = async (intake: PublicClientIntakeDto) => {
  const existing = await Client.findOne({ where: { phoneNumber: intake.phoneNumber } });
  if (existing) throw new ConflictError(DUPLICATE_PHONE_MESSAGE);

  const underlyingDiseases = intake.underlyingDiseases.flatMap((disease) =>
    disease === 'Otro' || disease === 'Other' ? [intake.otherUnderlyingDisease!] : [disease],
  );

  return Client.create({
    name: `${intake.firstName.trim()} ${intake.lastName.trim()}`,
    sex: intake.sex,
    dateOfBirth: intake.dateOfBirth,
    phoneNumber: intake.phoneNumber,
    address: intake.address,
    deliveryZone: intake.deliveryZone,
    delivery: null,
    isDraft: true,
    preferredStartDate: intake.preferredStartDate,
    weight: intake.weight,
    height: intake.height,
    restrictions: intake.restrictions,
    underlyingDiseases,
    operations: intake.operations,
    medications: intake.medications,
  });
};
