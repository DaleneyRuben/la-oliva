import { findActiveSubscriptionsForDate } from '../../subscription/find-active-subscriptions-for-date';
import { findRoute } from '../find-route';

jest.mock('../../subscription/find-active-subscriptions-for-date', () => ({
  findActiveSubscriptionsForDate: jest.fn(),
}));
jest.mock('../../../utils/date', () => ({
  ...jest.requireActual('../../../utils/date'),
  appToday: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { appToday } = require('../../../utils/date');

const makeClient = (overrides: Partial<Record<string, unknown>> = {}) => ({
  id: 1,
  name: 'Ana López',
  phoneNumber: '+591 7000 0000',
  deliveryZone: 'Centro',
  delivery: 'La Oliva',
  groupToken: null,
  address: 'Av. Siempre Viva #123',
  ...overrides,
});

const makeSubscription = (client = makeClient(), startDate = '2020-01-01') => ({
  client,
  startDate,
});

describe('findRoute', () => {
  beforeEach(() => jest.clearAllMocks());

  it('keys the response by today and tomorrow as calendar dates on a weekday', async () => {
    (appToday as jest.Mock).mockReturnValue('2026-06-23');
    (findActiveSubscriptionsForDate as jest.Mock).mockResolvedValue([]);

    const result = await findRoute();

    expect(Object.keys(result)).toEqual(['2026-06-23', '2026-06-24']);
  });

  it('returns no zones for today when today is a Saturday, without querying', async () => {
    (appToday as jest.Mock).mockReturnValue('2026-06-27');
    (findActiveSubscriptionsForDate as jest.Mock).mockResolvedValue([makeSubscription()]);

    const result = await findRoute();

    expect(result['2026-06-27'].day.zones).toEqual([]);
    expect(findActiveSubscriptionsForDate).not.toHaveBeenCalledWith('2026-06-27');
  });

  it('returns no zones for today when today is a Sunday', async () => {
    (appToday as jest.Mock).mockReturnValue('2026-06-28');
    (findActiveSubscriptionsForDate as jest.Mock).mockResolvedValue([makeSubscription()]);

    const result = await findRoute();

    expect(result['2026-06-28'].day.zones).toEqual([]);
  });

  it('returns no zones for tomorrow when tomorrow is a Saturday, while today still has data', async () => {
    (appToday as jest.Mock).mockReturnValue('2026-06-26');
    (findActiveSubscriptionsForDate as jest.Mock).mockResolvedValue([makeSubscription()]);

    const result = await findRoute();

    expect(result['2026-06-26'].day.zones).toHaveLength(1);
    expect(result['2026-06-27'].day.zones).toEqual([]);
  });

  it('returns an empty zones array when nothing matches on a weekday', async () => {
    (appToday as jest.Mock).mockReturnValue('2026-06-23');
    (findActiveSubscriptionsForDate as jest.Mock).mockResolvedValue([]);

    const result = await findRoute();

    expect(result['2026-06-23'].day.zones).toEqual([]);
    expect(result['2026-06-24'].day.zones).toEqual([]);
  });

  describe('zone/group clustering', () => {
    it('omits clients delivered elsewhere from a delivery user route', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-06-23');
      (findActiveSubscriptionsForDate as jest.Mock).mockResolvedValue([
        makeSubscription(makeClient({ name: 'La Oliva', delivery: 'La Oliva' })),
        makeSubscription(makeClient({ id: 2, name: 'Otro repartidor', delivery: 'Otro' })),
      ]);

      const result = await findRoute('delivery');

      expect(result['2026-06-23'].day.zones[0]?.singles.map((client) => client.name)).toEqual([
        'La Oliva',
      ]);
    });

    it('includes clients delivered elsewhere for an admin and identifies them', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-06-23');
      (findActiveSubscriptionsForDate as jest.Mock).mockResolvedValue([
        makeSubscription(makeClient({ name: 'Otro repartidor', delivery: 'Otro' })),
      ]);

      const result = await findRoute('admin');

      expect(result['2026-06-23'].day.zones[0]?.singles[0]).toMatchObject({
        name: 'Otro repartidor',
        delivery: 'Otro',
      });
    });

    it('groups clients sharing a groupToken together within their zone', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-06-23');
      (findActiveSubscriptionsForDate as jest.Mock).mockResolvedValue([
        makeSubscription(
          makeClient({ id: 1, name: 'Carmen Tapia', deliveryZone: 'Centro', groupToken: 'tok-1' }),
        ),
        makeSubscription(
          makeClient({ id: 2, name: 'Jorge Rengel', deliveryZone: 'Centro', groupToken: 'tok-1' }),
        ),
      ]);

      const result = await findRoute();

      const centro = result['2026-06-23'].day.zones.find((z) => z.zone === 'Centro');
      expect(centro?.groups).toEqual([
        {
          groupToken: 'tok-1',
          members: [
            {
              id: 1,
              name: 'Carmen Tapia',
              phone: '+591 7000 0000',
              deliveryZone: 'Centro',
              address: 'Av. Siempre Viva #123',
              isNew: false,
            },
            {
              id: 2,
              name: 'Jorge Rengel',
              phone: '+591 7000 0000',
              deliveryZone: 'Centro',
              address: 'Av. Siempre Viva #123',
              isNew: false,
            },
          ],
        },
      ]);
      expect(centro?.singles).toEqual([]);
    });

    // A token is cleared when a group is reduced to one member, but it survives when the other
    // members' contracts simply lapse — leaving one client holding a token and rendering as a
    // "group" of one. It is one stop either way, so it belongs with the individual rows.
    it('renders a client left alone under a shared token as an individual stop', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-06-23');
      (findActiveSubscriptionsForDate as jest.Mock).mockResolvedValue([
        makeSubscription(
          makeClient({ id: 1, name: 'Carmen Tapia', deliveryZone: 'Centro', groupToken: 'tok-1' }),
        ),
      ]);

      const result = await findRoute();

      const centro = result['2026-06-23'].day.zones.find((z) => z.zone === 'Centro');
      expect(centro?.groups).toEqual([]);
      expect(centro?.singles.map((s) => s.name)).toEqual(['Carmen Tapia']);
      expect(centro?.deliveryCount).toBe(1);
    });

    it('puts clients without a groupToken into singles', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-06-23');
      (findActiveSubscriptionsForDate as jest.Mock).mockResolvedValue([
        makeSubscription(makeClient({ id: 1, name: 'Ana López', groupToken: null })),
      ]);

      const result = await findRoute();

      const centro = result['2026-06-23'].day.zones.find((z) => z.zone === 'Centro');
      expect(centro?.groups).toEqual([]);
      expect(centro?.singles).toEqual([
        {
          id: 1,
          name: 'Ana López',
          phone: '+591 7000 0000',
          deliveryZone: 'Centro',
          address: 'Av. Siempre Viva #123',
          isNew: false,
        },
      ]);
    });

    it('omits zones with no clients', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-06-23');
      (findActiveSubscriptionsForDate as jest.Mock).mockResolvedValue([
        makeSubscription(makeClient({ deliveryZone: 'Centro' })),
      ]);

      const result = await findRoute();

      expect(result['2026-06-23'].day.zones.map((z) => z.zone)).toEqual(['Centro']);
    });

    it('orders zones as Sur then Centro', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-06-23');
      (findActiveSubscriptionsForDate as jest.Mock).mockResolvedValue([
        makeSubscription(makeClient({ id: 1, name: 'Centro Client', deliveryZone: 'Centro' })),
        makeSubscription(makeClient({ id: 2, name: 'Sur Client', deliveryZone: 'Sur' })),
      ]);

      const result = await findRoute();

      expect(result['2026-06-23'].day.zones.map((z) => z.zone)).toEqual(['Sur', 'Centro']);
    });

    it('sorts singles alphabetically by name', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-06-23');
      (findActiveSubscriptionsForDate as jest.Mock).mockResolvedValue([
        makeSubscription(makeClient({ id: 1, name: 'Zara Gomez' })),
        makeSubscription(makeClient({ id: 2, name: 'Ana López' })),
      ]);

      const result = await findRoute();

      const centro = result['2026-06-23'].day.zones.find((z) => z.zone === 'Centro');
      expect(centro?.singles.map((s) => s.name)).toEqual(['Ana López', 'Zara Gomez']);
    });

    it('counts deliveryCount as groups.length + singles.length', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-06-23');
      (findActiveSubscriptionsForDate as jest.Mock).mockResolvedValue([
        makeSubscription(makeClient({ id: 1, name: 'A', groupToken: 'tok-1' })),
        makeSubscription(makeClient({ id: 2, name: 'B', groupToken: 'tok-1' })),
        makeSubscription(makeClient({ id: 3, name: 'C', groupToken: null })),
        makeSubscription(makeClient({ id: 4, name: 'D', groupToken: null })),
      ]);

      const result = await findRoute();

      const centro = result['2026-06-23'].day.zones.find((z) => z.zone === 'Centro');
      expect(centro?.deliveryCount).toBe(3);
    });
  });

  describe('isNew flag', () => {
    it('flags a client as new when their subscription starts on the route day', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-06-23');
      (findActiveSubscriptionsForDate as jest.Mock).mockResolvedValue([
        makeSubscription(makeClient({ id: 1, name: 'Ana López' }), '2026-06-23'),
      ]);

      const result = await findRoute();

      const centro = result['2026-06-23'].day.zones.find((z) => z.zone === 'Centro');
      expect(centro?.singles[0].isNew).toBe(true);
    });

    it('does not flag a client whose subscription started before the route day', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-06-23');
      (findActiveSubscriptionsForDate as jest.Mock).mockResolvedValue([
        makeSubscription(makeClient({ id: 1, name: 'Ana López' }), '2026-06-01'),
      ]);

      const result = await findRoute();

      const centro = result['2026-06-23'].day.zones.find((z) => z.zone === 'Centro');
      expect(centro?.singles[0].isNew).toBe(false);
    });

    it('evaluates isNew independently per day, since tomorrow has a different route day', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-06-23');
      (findActiveSubscriptionsForDate as jest.Mock).mockResolvedValue([
        makeSubscription(makeClient({ id: 1, name: 'Ana López' }), '2026-06-24'),
      ]);

      const result = await findRoute();

      const centroToday = result['2026-06-23'].day.zones.find((z) => z.zone === 'Centro');
      const centroTomorrow = result['2026-06-24'].day.zones.find((z) => z.zone === 'Centro');
      expect(centroToday?.singles[0].isNew).toBe(false);
      expect(centroTomorrow?.singles[0].isNew).toBe(true);
    });
  });

  describe('address', () => {
    it('passes the client address through to the delivery person', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-06-23');
      (findActiveSubscriptionsForDate as jest.Mock).mockResolvedValue([
        makeSubscription(makeClient({ id: 1, name: 'Ana López', address: 'C. Los Cusis #18' })),
      ]);

      const result = await findRoute();

      const centro = result['2026-06-23'].day.zones.find((z) => z.zone === 'Centro');
      expect(centro?.singles[0].address).toBe('C. Los Cusis #18');
    });
  });

  describe('delivery shifts', () => {
    const night = (overrides: Partial<Record<string, unknown>> = {}) =>
      makeClient({ deliveryShift: 'night', ...overrides });

    const mockByDate = (byDate: Record<string, unknown[]>) =>
      (findActiveSubscriptionsForDate as jest.Mock).mockImplementation(
        async (date: string) => byDate[date] ?? [],
      );

    it('puts day clients in the day run for their own meal day', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-10-22');
      mockByDate({ '2026-10-22': [makeSubscription(makeClient({ deliveryShift: 'day' }))] });

      const result = await findRoute();

      expect(result['2026-10-22'].day.mealDate).toBe('2026-10-22');
      expect(result['2026-10-22'].day.zones[0].singles).toHaveLength(1);
      expect(result['2026-10-22'].night.zones).toEqual([]);
    });

    it('puts night clients in the night run of the evening before their meal day', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-10-22');
      mockByDate({
        '2026-10-22': [makeSubscription(night({ name: 'Hoy noche no' }))],
        '2026-10-23': [makeSubscription(night({ name: 'Julia Cuentas' }))],
      });

      const result = await findRoute();

      expect(result['2026-10-22'].night.mealDate).toBe('2026-10-23');
      expect(result['2026-10-22'].night.zones[0].singles.map((p) => p.name)).toEqual([
        'Julia Cuentas',
      ]);
      expect(result['2026-10-22'].day.zones).toEqual([]);
    });

    it('treats clients delivered by Otro as day clients', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-10-22');
      mockByDate({
        '2026-10-22': [makeSubscription(makeClient({ delivery: 'Otro', deliveryShift: null }))],
      });

      const result = await findRoute('admin');

      expect(result['2026-10-22'].day.zones[0].singles).toHaveLength(1);
      expect(result['2026-10-22'].night.zones).toEqual([]);
    });

    it('runs a Sunday night route for Monday meals while the Sunday day run stays empty', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-10-25');
      mockByDate({
        '2026-10-26': [makeSubscription(night()), makeSubscription(makeClient({ id: 2 }))],
      });

      const result = await findRoute();

      expect(result['2026-10-25'].day.zones).toEqual([]);
      expect(result['2026-10-25'].night.mealDate).toBe('2026-10-26');
      expect(result['2026-10-25'].night.zones[0].singles).toHaveLength(1);
      expect(findActiveSubscriptionsForDate).not.toHaveBeenCalledWith('2026-10-25');
    });

    it('has no night run on Friday, since Saturday has no meals', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-10-23');
      mockByDate({ '2026-10-23': [makeSubscription(makeClient())] });

      const result = await findRoute();

      expect(result['2026-10-23'].day.zones).toHaveLength(1);
      expect(result['2026-10-23'].night.zones).toEqual([]);
      expect(findActiveSubscriptionsForDate).not.toHaveBeenCalledWith('2026-10-24');
    });

    it('flags a night client as new on the evening before their start date', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-10-22');
      mockByDate({ '2026-10-23': [makeSubscription(night(), '2026-10-23')] });

      const result = await findRoute();

      expect(result['2026-10-22'].night.zones[0].singles[0].isNew).toBe(true);
    });

    it('builds tomorrow from its own meal days', async () => {
      (appToday as jest.Mock).mockReturnValue('2026-10-21');
      mockByDate({
        '2026-10-22': [makeSubscription(makeClient({ name: 'Día jueves' }))],
        '2026-10-23': [makeSubscription(night({ name: 'Noche viernes' }))],
      });

      const result = await findRoute();

      expect(result['2026-10-22'].day.zones[0].singles[0].name).toBe('Día jueves');
      expect(result['2026-10-22'].night.zones[0].singles[0].name).toBe('Noche viernes');
    });
  });
});
