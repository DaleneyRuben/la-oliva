import Payment from '../../../models/Payment';
import { voidPayment } from '../void-payment';

jest.mock('../../../models/Payment');

const actor = { userId: 7, username: 'Silvia' };
const mockedFindOne = Payment.findOne as jest.Mock;

describe('voidPayment', () => {
  beforeEach(() => jest.clearAllMocks());

  it('voids a payment only when its client is archived', async () => {
    const update = jest.fn().mockResolvedValue({});
    mockedFindOne.mockResolvedValue({ update });

    await expect(voidPayment(9, actor)).resolves.toBe(true);

    expect(update).toHaveBeenCalledWith(expect.objectContaining({ voidedBy: 7 }));
  });

  it('does not void a payment whose client is still active', async () => {
    mockedFindOne.mockResolvedValue(null);

    await expect(voidPayment(9, actor)).resolves.toBe(false);
  });
});
