import Subscription from '../../../models/Subscription';
import { finalizeAllForClient } from '../finalize-all-for-client';

jest.mock('../../../models/Subscription');

const transaction = { id: 'transaction' } as never;

describe('finalizeAllForClient', () => {
  beforeEach(() => jest.clearAllMocks());

  it('finalizes every unfinalized subscription for the client in the supplied transaction', async () => {
    await finalizeAllForClient(1, transaction);

    expect(Subscription.update).toHaveBeenCalledWith(
      expect.objectContaining({ finalizedAt: expect.any(String) }),
      expect.objectContaining({ where: { clientId: 1, finalizedAt: null }, transaction }),
    );
  });
});
