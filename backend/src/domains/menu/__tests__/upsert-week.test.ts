import { Op } from 'sequelize';
import sequelize from '../../../database/sequelize';
import Menu from '../../../models/Menu';
import { appToday } from '../../../utils/date';
import { upsertWeek } from '../upsert-week';

jest.mock('../../../models/Menu');
jest.mock('../../../database/sequelize', () => ({
  __esModule: true,
  default: { query: jest.fn(), transaction: jest.fn() },
}));
jest.mock('../../../utils/date', () => ({
  ...jest.requireActual('../../../utils/date'),
  appToday: jest.fn(),
  getCurrentMenuWeek: jest.fn(() => ({ start: '2026-06-15', end: '2026-06-19' })),
}));

const transaction = { id: 't1' };

beforeEach(() => {
  jest.clearAllMocks();
  (appToday as jest.Mock).mockReturnValue('2026-06-17');
  (sequelize.transaction as jest.Mock).mockImplementation((work) => work(transaction));
  (Menu.destroy as jest.Mock).mockResolvedValue(0);
});

describe('upsertWeek', () => {
  it('creates a menu for each day that has none yet', async () => {
    (Menu.findOne as jest.Mock).mockResolvedValue(null);
    (Menu.create as jest.Mock).mockImplementation(async (data) => data);

    const result = await upsertWeek([
      { date: '2026-06-18', breakfast: 'Avena' },
      { date: '2026-06-22', lunch: 'Pollo' },
    ]);

    expect(Menu.create).toHaveBeenCalledWith(
      expect.objectContaining({ date: '2026-06-18', breakfast: 'Avena' }),
      { transaction },
    );
    expect(Menu.create).toHaveBeenCalledWith(
      expect.objectContaining({ date: '2026-06-22', lunch: 'Pollo' }),
      { transaction },
    );
    expect(result).toHaveLength(2);
  });

  it('updates the days that already have a menu', async () => {
    const existing = { update: jest.fn().mockResolvedValue({ date: '2026-06-17', dinner: 'Sopa' }) };
    (Menu.findOne as jest.Mock).mockResolvedValue(existing);

    await upsertWeek([{ date: '2026-06-17', dinner: 'Sopa' }]);

    expect(Menu.findOne).toHaveBeenCalledWith({ where: { date: '2026-06-17' }, transaction });
    expect(existing.update).toHaveBeenCalledWith({ dinner: 'Sopa' }, { transaction });
  });

  it('stores a cleared dish as null', async () => {
    const existing = { update: jest.fn().mockResolvedValue({}) };
    (Menu.findOne as jest.Mock).mockResolvedValue(existing);

    await upsertWeek([{ date: '2026-06-17', salad: '   ', juice: null }]);

    expect(existing.update).toHaveBeenCalledWith({ salad: null, juice: null }, { transaction });
  });

  it('prunes menus outside the current and next week', async () => {
    (Menu.findOne as jest.Mock).mockResolvedValue(null);
    (Menu.create as jest.Mock).mockResolvedValue({});

    await upsertWeek([{ date: '2026-06-17', breakfast: 'Avena' }]);

    expect(Menu.destroy).toHaveBeenCalledWith({
      where: { date: { [Op.notBetween]: ['2026-06-15', '2026-06-26'] } },
      transaction,
    });
  });

  it('rejects a day before today without writing anything', async () => {
    await expect(
      upsertWeek([
        { date: '2026-06-17', breakfast: 'Avena' },
        { date: '2026-06-16', breakfast: 'Avena' },
      ]),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: 'No puedes modificar el menú de un día que ya pasó.',
    });
    expect(Menu.create).not.toHaveBeenCalled();
    expect(Menu.findOne).not.toHaveBeenCalled();
  });

  it('rejects a day after the end of next week', async () => {
    await expect(upsertWeek([{ date: '2026-06-29', breakfast: 'Avena' }])).rejects.toMatchObject({
      statusCode: 400,
      message: 'Solo puedes cargar el menú de esta semana o de la próxima.',
    });
    expect(Menu.findOne).not.toHaveBeenCalled();
  });

  it('joins the caller transaction when one is given', async () => {
    const outer = { id: 'outer' };
    (Menu.findOne as jest.Mock).mockResolvedValue(null);
    (Menu.create as jest.Mock).mockResolvedValue({});

    await upsertWeek([{ date: '2026-06-18', breakfast: 'Avena' }], outer as never);

    expect(sequelize.transaction).not.toHaveBeenCalled();
    expect(Menu.create).toHaveBeenCalledWith(expect.anything(), { transaction: outer });
  });
});
