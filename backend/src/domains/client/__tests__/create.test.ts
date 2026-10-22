import Client from '../../../models/Client';
import { create } from '../create';

jest.mock('../../../models/Client');
jest.mock('../../../database/sequelize', () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

const mockClient = {
  id: 1,
  name: 'John Doe',
  sex: 'male',
  dateOfBirth: '1990-05-15',
  phoneNumber: '+1234567890',
  address: '123 Main St',
  deliveryZone: 'Centro',
  delivery: 'La Oliva',
  underlyingDiseases: ['diabetes'],
  restrictions: ['gluten'],
};

const validPayload = {
  name: 'John Doe',
  sex: 'male',
  dateOfBirth: '1990-05-15',
  phoneNumber: '+1234567890',
  address: '123 Main St',
  deliveryZone: 'Centro',
  delivery: 'La Oliva',
  underlyingDiseases: ['diabetes'],
  restrictions: ['gluten'],
} as const;

describe('create', () => {
  it('creates a client with valid data', async () => {
    (Client.findOne as jest.Mock).mockResolvedValue(null);
    (Client.create as jest.Mock).mockResolvedValue(mockClient);

    const result = await create(validPayload as never);

    expect(Client.create).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({ name: 'John Doe', deliveryZone: 'Centro' });
  });

  it('propagates db errors', async () => {
    (Client.findOne as jest.Mock).mockResolvedValue(null);
    (Client.create as jest.Mock).mockRejectedValue(new Error('db error'));

    await expect(create(validPayload as never)).rejects.toThrow('db error');
  });

  it('threads an optional transaction through to Client.create', async () => {
    (Client.findOne as jest.Mock).mockResolvedValue(null);
    (Client.create as jest.Mock).mockResolvedValue(mockClient);
    const transaction = { id: 'txn-1' } as never;

    await create(validPayload as never, transaction);

    expect(Client.create).toHaveBeenCalledWith(
      { ...validPayload, deliveryShift: 'day' },
      { transaction },
    );
  });

  it('allows a phone number shared by multiple clients', async () => {
    jest.clearAllMocks();
    (Client.findOne as jest.Mock).mockResolvedValue(mockClient);
    (Client.create as jest.Mock).mockResolvedValue(mockClient);

    await expect(create(validPayload as never)).resolves.toEqual(mockClient);
    expect(Client.create).toHaveBeenCalledWith({ ...validPayload, deliveryShift: 'day' });
  });

  it('stores the shift a La Oliva client chose, and none for Otro', async () => {
    jest.clearAllMocks();
    (Client.create as jest.Mock).mockResolvedValue(mockClient);

    await create({ ...validPayload, deliveryShift: 'night' } as never);
    await create({ ...validPayload, delivery: 'Otro', deliveryShift: 'night' } as never);

    expect((Client.create as jest.Mock).mock.calls[0][0]).toMatchObject({ deliveryShift: 'night' });
    expect((Client.create as jest.Mock).mock.calls[1][0]).toMatchObject({ deliveryShift: null });
  });
});
