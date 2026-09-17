import { DISEASES } from '@/features/clients/constants/diseases';

const standardDiseases = DISEASES.filter((disease) => disease !== 'Otro');

export function normalizeUnderlyingDiseases(underlyingDiseases: string[]) {
  const otherDisease = underlyingDiseases.find(
    (disease) =>
      disease !== 'Otro' &&
      !standardDiseases.includes(disease as (typeof standardDiseases)[number]),
  );

  return {
    underlyingDiseases: [
      ...underlyingDiseases.filter((disease) =>
        standardDiseases.includes(disease as (typeof standardDiseases)[number]),
      ),
      ...(otherDisease || underlyingDiseases.includes('Otro') ? ['Otro'] : []),
    ],
    otherUnderlyingDisease: otherDisease ?? '',
  };
}
