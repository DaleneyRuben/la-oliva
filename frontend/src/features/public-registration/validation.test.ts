import { createInitialRegistrationForm, RegistrationForm } from './types';
import { validateRegistrationStep } from './validation';

const completeForm = (): RegistrationForm => ({
  ...createInitialRegistrationForm(),
  firstName: 'María',
  lastName: 'Pérez',
  sex: 'female',
  dateOfBirth: '1990-01-01',
  phoneNumber: '70000001',
  address: 'Calle de prueba 123',
  deliveryZone: 'Centro',
  preferredStartDate: '2026-11-02',
  weight: '60',
  height: '165',
});

describe('validateRegistrationStep', () => {
  it('flags every empty personal field on step 1', () => {
    expect(validateRegistrationStep(1, createInitialRegistrationForm())).toEqual({
      firstName: 'Ingresa tu primer nombre',
      lastName: 'Ingresa tu primer apellido',
      sex: 'Selecciona tu sexo',
      dateOfBirth: 'Selecciona tu fecha de nacimiento',
      phoneNumber: 'Ingresa tu número de celular',
      preferredStartDate: 'Selecciona una fecha de inicio',
      address: 'Ingresa tu dirección',
      deliveryZone: 'Selecciona una zona',
    });
  });

  it('treats whitespace-only text as empty', () => {
    const form = { ...completeForm(), firstName: '   ' };
    expect(validateRegistrationStep(1, form)).toEqual({ firstName: 'Ingresa tu primer nombre' });
  });

  it('passes a complete step 1', () => {
    expect(validateRegistrationStep(1, completeForm())).toEqual({});
  });

  it('flags missing weight and height on step 2', () => {
    const form = { ...completeForm(), weight: '', height: '' };
    expect(validateRegistrationStep(2, form)).toEqual({
      weight: 'Ingresa tu peso',
      height: 'Ingresa tu talla',
    });
  });

  it('rejects weight and height of zero', () => {
    const form = { ...completeForm(), weight: '0', height: '0' };
    expect(validateRegistrationStep(2, form)).toEqual({
      weight: 'Ingresa un peso mayor a 0',
      height: 'Ingresa una talla mayor a 0',
    });
  });

  it('requires the disease name only when Otro is selected', () => {
    const form = { ...completeForm(), underlyingDiseases: ['Otro'] };
    expect(validateRegistrationStep(2, form)).toEqual({
      otherUnderlyingDisease: 'Especifica la enfermedad',
    });
    expect(validateRegistrationStep(2, completeForm())).toEqual({});
  });

  it('checks nothing on the review step', () => {
    expect(validateRegistrationStep(3, createInitialRegistrationForm())).toEqual({});
  });
});
