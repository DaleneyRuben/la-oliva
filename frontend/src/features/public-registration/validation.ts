import { RegistrationForm, RegistrationStep } from '@/features/public-registration/types';

export type RegistrationErrors = Partial<Record<keyof RegistrationForm, string>>;

const REQUIRED_PERSONAL: [keyof RegistrationForm, string][] = [
  ['firstName', 'Ingresa tu primer nombre'],
  ['lastName', 'Ingresa tu primer apellido'],
  ['sex', 'Selecciona tu sexo'],
  ['dateOfBirth', 'Selecciona tu fecha de nacimiento'],
  ['phoneNumber', 'Ingresa tu número de celular'],
  ['preferredStartDate', 'Selecciona una fecha de inicio'],
  ['address', 'Ingresa tu dirección'],
  ['deliveryZone', 'Selecciona una zona'],
];

const isBlank = (value: string) => value.trim() === '';

const measurementError = (value: string, missing: string, notPositive: string) => {
  if (isBlank(value)) return missing;
  return Number(value) > 0 ? undefined : notPositive;
};

const validatePersonal = (form: RegistrationForm): RegistrationErrors =>
  Object.fromEntries(REQUIRED_PERSONAL.filter(([key]) => isBlank(form[key] as string)));

function validateHealth(form: RegistrationForm): RegistrationErrors {
  const errors: RegistrationErrors = {};
  const weight = measurementError(form.weight, 'Ingresa tu peso', 'Ingresa un peso mayor a 0');
  const height = measurementError(form.height, 'Ingresa tu talla', 'Ingresa una talla mayor a 0');
  if (weight) errors.weight = weight;
  if (height) errors.height = height;
  if (form.underlyingDiseases.includes('Otro') && isBlank(form.otherUnderlyingDisease)) {
    errors.otherUnderlyingDisease = 'Especifica la enfermedad';
  }
  return errors;
}

export function validateRegistrationStep(
  step: RegistrationStep,
  form: RegistrationForm,
): RegistrationErrors {
  if (step === 1) return validatePersonal(form);
  if (step === 2) return validateHealth(form);
  return {};
}
