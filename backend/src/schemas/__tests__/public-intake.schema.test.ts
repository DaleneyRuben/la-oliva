import { publicClientIntakeSchema } from '../public-intake.schema';

const validIntake = {
  firstName: 'María',
  lastName: 'Quispe',
  sex: 'female',
  dateOfBirth: '1994-04-12',
  phoneNumber: '71234567',
  address: 'Calle 21, edificio 4, departamento 3',
  deliveryZone: 'Centro',
  preferredStartDate: '2026-09-21',
  weight: 61.5,
  height: 164,
  restrictions: ['Maní'],
  underlyingDiseases: ['Diabetes'],
  operations: ['Apendicectomía'],
  medications: ['Metformina'],
  website: '',
};

describe('publicClientIntakeSchema', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-16T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('accepts a complete intake for a future weekday', () => {
    expect(publicClientIntakeSchema.safeParse(validIntake).success).toBe(true);
  });

  it('rejects a future date of birth', () => {
    const result = publicClientIntakeSchema.safeParse({
      ...validIntake,
      dateOfBirth: '2026-09-17',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a preferred start date that is not after today', () => {
    const result = publicClientIntakeSchema.safeParse({
      ...validIntake,
      preferredStartDate: '2026-09-16',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a weekend preferred start date', () => {
    const result = publicClientIntakeSchema.safeParse({
      ...validIntake,
      preferredStartDate: '2026-09-19',
    });

    expect(result.success).toBe(false);
  });

  it('requires a description when Other disease is selected', () => {
    const result = publicClientIntakeSchema.safeParse({
      ...validIntake,
      underlyingDiseases: ['Other'],
    });

    expect(result.success).toBe(false);
  });

  it('rejects a submitted honeypot value', () => {
    const result = publicClientIntakeSchema.safeParse({
      ...validIntake,
      website: 'https://spam.example',
    });

    expect(result.success).toBe(false);
  });
});
