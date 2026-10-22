import Client from '../../../models/Client';
import sequelize from '../../../database/sequelize';
import { record } from '../../client-history';
import { pause, resume } from '../../subscription';
import { update } from '../update';

jest.mock('../../../models/Client');
jest.mock('../../client-history');
jest.mock('../../subscription');
jest.mock('../../../models/Subscription');
jest.mock('../../../database/sequelize', () => ({
  __esModule: true,
  default: { query: jest.fn(), transaction: jest.fn() },
}));
jest.mock('../../../utils/date', () => ({
  ...jest.requireActual('../../../utils/date'),
  appToday: jest.fn(() => '2026-06-05'),
}));

const mockClient = { id: 1, name: 'John Doe' };
const actor = { userId: 9, username: 'ada' };
const transaction = { id: 'own' };
const callerTransaction = { id: 'caller' } as never;
const PAUSED_AT = '2026-06-10T12:00:00Z';

const runningSub = (over: Record<string, unknown> = {}) => ({
  id: 5,
  paid: true,
  startDate: '2026-06-01',
  contractEndDate: '2026-06-12',
  duration: 10,
  finalizedAt: null,
  pausedSince: null,
  ...over,
});

const clientWith = (subscriptions: object[], over: Record<string, unknown> = {}) => ({
  id: 1,
  subscriptions,
  update: jest.fn().mockResolvedValue({ ...mockClient }),
  ...over,
});

describe('update', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (sequelize.transaction as jest.Mock).mockImplementation((work) => work(transaction));
  });

  // Pause state lives on the subscription now, so the client domain only decides WHICH plan the
  // request refers to — the pause itself belongs to the domain that owns subscriptions.
  it('pauses the current subscription rather than the client record', async () => {
    const instance = clientWith([runningSub()]);
    (Client.findByPk as jest.Mock).mockResolvedValue(instance);

    await update(1, { pausedSince: PAUSED_AT }, actor);

    expect(pause).toHaveBeenCalledWith(5, actor, transaction);
    expect(instance.update).not.toHaveBeenCalledWith(
      expect.objectContaining({ pausedSince: expect.anything() }),
      expect.anything(),
    );
  });

  it('resumes the current subscription', async () => {
    const instance = clientWith([runningSub({ pausedSince: new Date('2026-06-03') })]);
    (Client.findByPk as jest.Mock).mockResolvedValue(instance);

    await update(1, { pausedSince: null }, actor);

    expect(resume).toHaveBeenCalledWith(5, actor, transaction);
  });

  it('pauses the paid subscription, not a newer pending unpaid renewal', async () => {
    const paidSub = runningSub({ id: 60, paid: true });
    const unpaidSub = runningSub({ id: 66, paid: false, startDate: null, contractEndDate: null });
    (Client.findByPk as jest.Mock).mockResolvedValue(clientWith([unpaidSub, paidSub]));

    await update(1, { pausedSince: PAUSED_AT }, actor);

    expect(pause).toHaveBeenCalledWith(60, actor, transaction);
  });

  it('pauses the subscription covering today, not a queued future renewal', async () => {
    const futureSub = runningSub({ id: 8, startDate: '2026-07-01', contractEndDate: '2026-07-15' });
    const currentSub = runningSub({ id: 5 });
    (Client.findByPk as jest.Mock).mockResolvedValue(clientWith([futureSub, currentSub]));

    await update(1, { pausedSince: PAUSED_AT }, actor);

    expect(pause).toHaveBeenCalledWith(5, actor, transaction);
  });

  it('does not pause again when the current subscription is already paused', async () => {
    (Client.findByPk as jest.Mock).mockResolvedValue(
      clientWith([runningSub({ pausedSince: new Date('2026-06-03') })]),
    );

    await update(1, { pausedSince: PAUSED_AT }, actor);

    expect(pause).not.toHaveBeenCalled();
  });

  it('does not resume a subscription that is not paused', async () => {
    (Client.findByPk as jest.Mock).mockResolvedValue(clientWith([runningSub()]));

    await update(1, { pausedSince: null }, actor);

    expect(resume).not.toHaveBeenCalled();
  });

  it('does nothing when the client has no subscription to pause', async () => {
    (Client.findByPk as jest.Mock).mockResolvedValue(clientWith([]));

    await update(1, { pausedSince: PAUSED_AT }, actor);

    expect(pause).not.toHaveBeenCalled();
  });

  it('does not record history itself — the subscription domain owns the pause events', async () => {
    (Client.findByPk as jest.Mock).mockResolvedValue(clientWith([runningSub()]));

    await update(1, { pausedSince: PAUSED_AT }, actor);

    expect(record).not.toHaveBeenCalled();
  });

  it('updates ordinary fields without touching the subscription', async () => {
    const instance = clientWith([runningSub()]);
    (Client.findByPk as jest.Mock).mockResolvedValue(instance);

    await update(1, { name: 'Jane Doe' }, actor);

    expect(pause).not.toHaveBeenCalled();
    expect(resume).not.toHaveBeenCalled();
    expect(instance.update).toHaveBeenCalledWith({ name: 'Jane Doe' }, { transaction });
  });

  it('allows changing a phone number to one used by another client', async () => {
    const instance = clientWith([runningSub()], { phoneNumber: '+59170000001' });
    (Client.findByPk as jest.Mock).mockResolvedValue(instance);
    (Client.findOne as jest.Mock).mockResolvedValue({ id: 2 });

    await update(1, { phoneNumber: '+59170000002' }, actor);
    expect(instance.update).toHaveBeenCalledWith({ phoneNumber: '+59170000002' }, { transaction });
  });

  it("joins the caller's transaction rather than opening its own", async () => {
    const instance = clientWith([runningSub()]);
    (Client.findByPk as jest.Mock).mockResolvedValue(instance);

    await update(1, { name: 'Jane Doe' }, actor, callerTransaction);

    expect(sequelize.transaction).not.toHaveBeenCalled();
    expect(instance.update).toHaveBeenCalledWith(
      { name: 'Jane Doe' },
      { transaction: callerTransaction },
    );
  });

  it('leaves the client unchanged when resuming the plan fails', async () => {
    const instance = clientWith([runningSub({ pausedSince: new Date('2026-06-03') })]);
    (Client.findByPk as jest.Mock).mockResolvedValue(instance);
    (resume as jest.Mock).mockRejectedValueOnce(new Error('db error'));

    await expect(update(1, { pausedSince: null }, actor)).rejects.toThrow('db error');
    expect(instance.update).not.toHaveBeenCalled();
  });

  it('returns null when client not found', async () => {
    (Client.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await update(999, { pausedSince: null }, actor);

    expect(result).toBeNull();
    expect(sequelize.transaction).not.toHaveBeenCalled();
  });

  describe('delivery shift', () => {
    it('changes the shift for every other member of the client group', async () => {
      const instance = clientWith([], {
        delivery: 'La Oliva',
        deliveryShift: 'day',
        groupToken: 'tok-1',
      });
      (Client.findByPk as jest.Mock).mockResolvedValue(instance);

      await update(1, { deliveryShift: 'night' }, actor);

      expect(instance.update).toHaveBeenCalledWith(
        expect.objectContaining({ deliveryShift: 'night' }),
        { transaction },
      );
      expect(Client.update).toHaveBeenCalledWith(
        { deliveryShift: 'night' },
        { where: { groupToken: 'tok-1' }, transaction },
      );
    });

    it('does not touch the group when the shift did not change', async () => {
      const instance = clientWith([], {
        delivery: 'La Oliva',
        deliveryShift: 'night',
        groupToken: 'tok-1',
      });
      (Client.findByPk as jest.Mock).mockResolvedValue(instance);

      await update(1, { deliveryShift: 'night', name: 'Ana' }, actor);

      expect(Client.update).not.toHaveBeenCalled();
    });

    it('clears the shift when the client moves to Otro', async () => {
      const instance = clientWith([], { delivery: 'La Oliva', deliveryShift: 'night' });
      (Client.findByPk as jest.Mock).mockResolvedValue(instance);

      await update(1, { delivery: 'Otro' }, actor);

      expect(instance.update).toHaveBeenCalledWith(
        expect.objectContaining({ delivery: 'Otro', deliveryShift: null }),
        { transaction },
      );
    });

    it('gives a client moving to La Oliva a day shift when none was sent', async () => {
      const instance = clientWith([], { delivery: 'Otro', deliveryShift: null });
      (Client.findByPk as jest.Mock).mockResolvedValue(instance);

      await update(1, { delivery: 'La Oliva' }, actor);

      expect(instance.update).toHaveBeenCalledWith(
        expect.objectContaining({ delivery: 'La Oliva', deliveryShift: 'day' }),
        { transaction },
      );
    });

    it('leaves the shift alone when the edit does not mention delivery', async () => {
      const instance = clientWith([], { delivery: 'La Oliva', deliveryShift: 'night' });
      (Client.findByPk as jest.Mock).mockResolvedValue(instance);

      await update(1, { name: 'Ana' }, actor);

      expect(instance.update).toHaveBeenCalledWith({ name: 'Ana' }, { transaction });
    });
  });
});
