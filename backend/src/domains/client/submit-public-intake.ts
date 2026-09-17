import Client from '../../models/Client';
import type { PublicClientIntakeDto } from '../../schemas/public-intake.schema';

export const submitPublicIntake = async (intake: PublicClientIntakeDto) => {
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
