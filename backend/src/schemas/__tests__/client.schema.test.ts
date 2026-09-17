import { createClientSchema, updateClientSchema } from '../client.schema';

describe('client schema', () => {
  const validClient = {
    name: 'Ana Pérez',
    sex: 'female',
    dateOfBirth: '1990-05-15',
    phoneNumber: '+59170000000',
    address: 'Calle 1',
    deliveryZone: 'Centro',
    delivery: 'La Oliva',
    weight: 60,
    height: 165,
  };

  it('requires weight and height when a staff member creates a client', () => {
    expect(createClientSchema.safeParse({ ...validClient, weight: undefined }).success).toBe(false);
    expect(createClientSchema.safeParse({ ...validClient, height: undefined }).success).toBe(false);
  });

  it('accepts the health fields on creation and editing', () => {
    expect(createClientSchema.safeParse(validClient).success).toBe(true);
    expect(
      updateClientSchema.safeParse({ weight: 61.5, height: 166, operations: ['Cirugía'] }).success,
    ).toBe(true);
  });

  it('rejects a future date of birth', () => {
    expect(
      createClientSchema.safeParse({ ...validClient, dateOfBirth: '2999-01-01' }).success,
    ).toBe(false);
  });
});
