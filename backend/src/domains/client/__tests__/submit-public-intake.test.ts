import Client from '../../../models/Client';
import { ConflictError } from '../../../utils/errors';
// The module is intentionally absent in this red TDD commit.
// eslint-disable-next-line import/extensions
import { submitPublicIntake } from '../submit-public-intake';

jest.mock('../../../models/Client');

const intake = {
  firstName: ' María ',
  lastName: ' Quispe ',
  sex: 'female',
  dateOfBirth: '1994-04-12',
  phoneNumber: '71234567',
  address: 'Calle 21 #23',
  deliveryZone: 'Centro',
  preferredStartDate: '2026-09-21',
  weight: 61.5,
  height: 164,
  restrictions: ['Maní'],
  underlyingDiseases: ['Other'],
  otherUnderlyingDisease: 'Hipotiroidismo',
  operations: ['Apendicectomía'],
  medications: ['Levotiroxina'],
  website: '',
} as const;

describe('submitPublicIntake', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates a delivery-less draft and preserves the intake health information', async () => {
    (Client.findOne as jest.Mock).mockResolvedValue(null);
    (Client.create as jest.Mock).mockResolvedValue({ id: 17 });

    await submitPublicIntake(intake);

    expect(Client.create).toHaveBeenCalledWith({
      name: 'María Quispe',
      sex: 'female',
      dateOfBirth: '1994-04-12',
      phoneNumber: '71234567',
      address: 'Calle 21 #23',
      deliveryZone: 'Centro',
      delivery: null,
      isDraft: true,
      preferredStartDate: '2026-09-21',
      weight: 61.5,
      height: 164,
      restrictions: ['Maní'],
      underlyingDiseases: ['Hipotiroidismo'],
      operations: ['Apendicectomía'],
      medications: ['Levotiroxina'],
    });
  });

  it('rejects a phone number already held by a non-deleted client', async () => {
    (Client.findOne as jest.Mock).mockResolvedValue({ id: 4 });

    await expect(submitPublicIntake(intake)).rejects.toEqual(
      new ConflictError(
        'Este número de celular ya está registrado. Si necesitas ayuda, contáctanos.',
      ),
    );
    expect(Client.create).not.toHaveBeenCalled();
  });
});
