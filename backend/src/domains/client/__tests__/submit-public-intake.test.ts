import Client from '../../../models/Client';
import type { PublicClientIntakeDto } from '../../../schemas/public-intake.schema';
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
} satisfies PublicClientIntakeDto;

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

  it('allows a public draft to share a phone number with an existing client', async () => {
    (Client.findOne as jest.Mock).mockResolvedValue({ id: 4 });
    (Client.create as jest.Mock).mockResolvedValue({ id: 18 });

    await expect(submitPublicIntake(intake)).resolves.toEqual({ id: 18 });
    expect(Client.create).toHaveBeenCalled();
  });
});
